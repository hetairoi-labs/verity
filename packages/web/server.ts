import { serve } from "bun";
import { websocket } from "hono/bun";
import hono from "@/api/hono";
import html from "@/src/index.html";
import { validateEnv } from "./utils/env";

validateEnv();
const isDev = process.env.NODE_ENV !== "production";

const server = serve({
	development: isDev
		? {
				hmr: true,
				console: true,
			}
		: false,
	port: process.env.PORT,

	routes: {
		"/api": new Response(
			JSON.stringify({
				message: "Bun Web Server",
				version: "v1.0.0",
			}),
		),

		"/api/v1/*": (req) => hono.fetch(req),

		"/*": html,
	},

	websocket,

	error(error) {
		console.error(error);
		return new Response(`Internal Error: ${error.message}`, { status: 500 });
	},
});

console.log(`🐰 Bun version: ${Bun.version}`);
console.log(`🔥 ${isDev ? "Dev" : "Prod"} server is running at ${server.url}`);
