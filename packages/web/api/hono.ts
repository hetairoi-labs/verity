import { Hono } from "hono";
import { cors } from "hono/cors";
import { trimTrailingSlash } from "hono/trailing-slash";
import { rateLimiter } from "hono-rate-limiter";
import { logger } from "@/api/lib/middleware/logger";
import { ApiError, handleError } from "@/api/lib/utils/hono/error";
import routes from "@/api/routes/router";

// Extend Hono context types
const hono = new Hono()
	.basePath("/api/v1")
	.use(cors())
	.use(logger)
	.use(trimTrailingSlash())
	.use(
		rateLimiter({
			windowMs: 1000,
			limit: 300,
			standardHeaders: "draft-6",
			keyGenerator: (ctx) =>
				ctx.req.header("CF-Connecting-IP") ||
				ctx.req.header("X-Forwarded-For")?.split(",")[0]?.trim() ||
				ctx.req.header("X-Real-IP") ||
				"127.0.0.1",
		})
	)
	.onError(handleError)
	.route("/", routes)
	.get("*", () => {
		throw new ApiError(404, "Invalid v1 API route");
	});

export default hono;
