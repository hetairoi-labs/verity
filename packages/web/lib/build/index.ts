#!/usr/bin/env bun
import { bundle } from "./bundle";
import { uploadSourcemaps } from "./sentry";
import { summary } from "./summary";

const outdir = `${process.cwd()}/dist`;

console.log("Building project...");
const { result, duration } = await bundle();

summary(result.outputs, duration);

if (result.success) {
	console.log("\n\nUploading sourcemaps to Sentry...");
	await uploadSourcemaps(outdir);
}
