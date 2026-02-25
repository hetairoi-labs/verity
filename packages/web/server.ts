import { serve } from "bun";
import { websocket } from "hono/bun";
import hono from "@/api/hono";
import html from "@/src/index.html";
import { logger } from "./api/lib/utils/pino";

const isDev = process.env.NODE_ENV === "development";

serve({
	development: isDev
		? {
				hmr: true,
				console: false,
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
		"/api/v1": new Response(
			JSON.stringify({
				message: "Hono API",
				version: "v1.0.0",
			}),
		),

		"/api/v1/*": (req, server) => hono.fetch(req, server),

		"/*": html,
	},

	websocket,

	error(error) {
		logger.error(
			{
				message: error.message,
				stack: error.stack,
			},
			"server.bun.error",
		);
		return new Response(`Internal Error: ${error.message}`, { status: 500 });
	},
});

logger.info(
	{
		bunVersion: Bun.version,
		port: process.env.PORT,
		env: isDev ? "development" : "production",
		url: process.env.PUBLIC_APP_URL,
	},
	"server.started",
);
