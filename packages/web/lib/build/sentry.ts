import { getEnv } from "../utils/env";

export async function uploadSourcemaps(outdir: string) {
	let env: ReturnType<typeof getEnv> | null = null;
	try {
		env = getEnv();
	} catch {
		return;
	}
	if (!env?.SENTRY_AUTH_TOKEN || !env?.SENTRY_PROJECT) return;

	const args = ["--bun", "@sentry/cli", "sourcemaps"];
	await Bun.spawn(["bunx", ...args, "upload", outdir], {
		stdout: "ignore",
		stderr: "inherit",
	}).exited;
}
