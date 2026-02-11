import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { trimTrailingSlash } from "hono/trailing-slash";
import { rateLimiter } from "hono-rate-limiter";
import { AppError, handleError } from "@/api/lib/utils/hono/error";
import routes from "@/api/routes/router";

const hono = new Hono()
	.basePath("/api/v1")
	.use(cors())
	.use(logger())
	.use(trimTrailingSlash())
	.use(
		rateLimiter({
			windowMs: 1000,
			limit: 300,
			standardHeaders: "draft-6",
			keyGenerator: async (ctx) => {
				return (
					ctx.req.header("CF-Connecting-IP") ||
					ctx.req.header("X-Forwarded-For")?.split(",")[0]?.trim() ||
					ctx.req.header("X-Real-IP") ||
					"127.0.0.1"
				);
			},
		}),
	)
	.onError(handleError)
	.route("/", routes)
	.get("*", () => {
		throw new AppError("Invalid v1 api route", 404);
	});

export default hono;
