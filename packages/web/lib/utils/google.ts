import { google } from "googleapis";

const TOKEN_PATH = `${process.cwd()}/lib/secrets/credentials.json`;
const PORT = 30012;

const SCOPES = [
	"https://www.googleapis.com/auth/calendar.events",
	"https://www.googleapis.com/auth/drive.file",
	"https://www.googleapis.com/auth/gmail.modify",
	"https://www.googleapis.com/auth/userinfo.email",
];

const REDIRECT_URI = `http://localhost:${PORT}/oauth2callback`;

function openBrowser(url: string) {
	const cmd =
		process.platform === "darwin"
			? ["open", url]
			: process.platform === "win32"
				? ["cmd", "/c", "start", url]
				: ["xdg-open", url];

	Bun.spawn(cmd);
}

export async function getAuthenticatedClient() {
	const oauth = new google.auth.OAuth2(
		process.env.GOOGLE_CLIENT_ID,
		process.env.GOOGLE_CLIENT_SECRET,
		REDIRECT_URI,
	);

	const file = Bun.file(TOKEN_PATH);

	/* reuse token */
	if (await file.exists()) {
		oauth.setCredentials(JSON.parse(await file.text()));
		try {
			await oauth.getAccessToken();
			return oauth;
		} catch {
			console.log("Token expired, reauth required");
		}
	}

	/* login flow */
	const url = oauth.generateAuthUrl({
		access_type: "offline",
		prompt: "consent",
		scope: SCOPES,
	});

	console.log("Opening browser for login...");
	openBrowser(url);

	let code: string | null = null;

	const server = Bun.serve({
		port: PORT,
		fetch(req) {
			const u = new URL(req.url);
			if (u.pathname !== "/oauth2callback")
				return new Response("Not found", { status: 404 });

			code = u.searchParams.get("code");
			return new Response("Login successful. You can close this tab.");
		},
	});

	while (!code) await Bun.sleep(50);

	server.stop();

	const { tokens } = await oauth.getToken(code);
	await Bun.write(TOKEN_PATH, JSON.stringify(tokens, null, 2));
	Bun.spawn(["chmod", "600", TOKEN_PATH]);

	oauth.setCredentials(tokens);
	return oauth;
}

/* CLI mode */
if (import.meta.main) {
	await getAuthenticatedClient();
	console.log("Authenticated ✓");
}
