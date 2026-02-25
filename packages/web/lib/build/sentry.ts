import { env } from "../utils/env.ts";

export async function uploadSourcemaps(outdir: string) {
	if (!env.PUBLIC_SENTRY_DSN) return;
	console.log("\n\nUploading sourcemaps to Sentry...");
	const args = ["--bun", "@sentry/cli", "sourcemaps"];
	await Bun.spawn(["bunx", ...args, "upload", outdir], {
		stdout: "ignore",
		stderr: "inherit",
	}).exited;
}
