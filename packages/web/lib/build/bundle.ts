import { cp, rm } from "node:fs/promises";
import tailwindPlugin from "bun-plugin-tailwind";

const outdir = `${process.cwd()}/dist`;
const entrypoints = [`${process.cwd()}/src/index.html`];

export async function bundle() {
	if (await Bun.file(outdir).exists()) {
		console.log(`Cleaning up previous build...`);
		await rm(outdir, { recursive: true, force: true });
	}

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
	});

	const publicDir = `${process.cwd()}/public`;
	if (await Bun.file(publicDir).exists()) {
		await cp(publicDir, outdir, { recursive: true });
	}

	return { result, duration: performance.now() - start };
}
