import { cp, rm } from "node:fs/promises";
import tailwindPlugin from "bun-plugin-tailwind";
import { safeAsync } from "../utils/safe";

const outdir = `${process.cwd()}/dist`;
const entrypoints = [`${process.cwd()}/src/index.html`];

export async function bundle() {
	await safeAsync(rm(outdir, { recursive: true, force: true }));

	const start = performance.now();
	const result = await Bun.build({
		entrypoints,
		outdir,
		target: "browser",
		minify: true,
		sourcemap: "linked",
		env: "PUBLIC_*",
		define: {
			"process.env.NODE_ENV": JSON.stringify("production"),
		},
		plugins: [tailwindPlugin],
		splitting: true,
		naming: {
			chunk: "chunks/[name]-[hash].[ext]",
			asset: "assets/[name]-[hash].[ext]",
		},
		drop: ["console", "debugger"],
	});

	if (result.logs.length > 0) {
		for (const msg of result.logs) console.warn(msg);
	}

	const publicDir = `${process.cwd()}/public`;
	await safeAsync(cp(publicDir, outdir, { recursive: true }));

	return { result, duration: performance.now() - start };
}
