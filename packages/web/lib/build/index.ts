#!/usr/bin/env bun
import { runBuild } from "./bundle";
import { summary } from "./output";
import { uploadSourcemaps } from "./sentry";

const outdir = `${process.cwd()}/dist`;

console.log("Building project...");
const { result, duration } = await runBuild();

summary(result.outputs, duration);

if (result.success) {
	console.log("\n\nUploading sourcemaps to Sentry...");
	await uploadSourcemaps(outdir);
}
