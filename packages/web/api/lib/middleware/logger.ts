import { createMiddleware } from "hono/factory";
import { logger as pinoLogger } from "@/api/lib/utils/pino";
// import { safeAsync } from "@/lib/utils/safe";

export const logger = createMiddleware(async (c, next) => {
	const startedAt = Date.now();
	const reqId = c.req.header("X-Request-Id") ?? crypto.randomUUID();
	c.header("X-Request-Id", reqId);

	const requestLogger = pinoLogger.child({ reqId, path: c.req.path });
	c.set("logger", requestLogger);

	const query = c.req.query();
	// const [jsonBody, jsonError] = await safeAsync(async () =>
	// 	c.req.header("content-type")?.includes("application/json")
	// 		? c.req.json()
	// 		: null,
	// );

	await next();

	if (c.res.status < 400) {
		requestLogger.info(
			{
				res: `${c.res.status} ${c.req.method} ${c.req.path.replace("/api/v1", "")}`,
				durationMs: Date.now() - startedAt,
				...(Object.keys(query).length > 0 && { query }),
				// ...(jsonBody && !jsonError && { json: jsonBody }),
				// ...(jsonError && { bodyError: jsonError.message }),
			},
			"http.request"
		);
	}
});
