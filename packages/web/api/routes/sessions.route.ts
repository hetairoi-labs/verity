import { Hono } from "hono";
import { z } from "zod";
import { downloadTranscript, retrieveBot } from "@/api/lib/utils/bot";
import { respond } from "@/api/lib/utils/hono/respond";
import { createSession, createSessionInputSchema } from "../handlers/sessions";
import { requireAuth } from "../lib/middleware/auth";
import { validator } from "../lib/utils/zod";

const sessionsRoute = new Hono()
	.use(requireAuth)
	.post("/", validator("json", createSessionInputSchema), async (c) => {
		const { session } = await createSession(
			c.var.user.user_id,
			c.req.valid("json"),
		);
		return respond.ok(c, 201, "Session created successfully", { session });
	})
	.get(
		"/bot",
		validator(
			"query",
			z.object({ botId: z.string().min(1, "Bot ID is required") }),
		),
		async (c) => {
			const { botId } = c.req.valid("query");
			const bot = await retrieveBot(botId);
			return respond.ok(c, 200, "Bot retrieved successfully", {
				bot,
			});
		},
	)
	.get(
		"/transcript",
		validator("query", z.object({ transcriptUrl: z.url() })),
		async (c) => {
			const { transcriptUrl } = c.req.valid("query");
			const transcript = await downloadTranscript(new URL(transcriptUrl));
			return respond.ok(c, 200, "Transcript downloaded successfully", {
				transcript,
			});
		},
	);

export default sessionsRoute;
export type SessionsType = typeof sessionsRoute;
