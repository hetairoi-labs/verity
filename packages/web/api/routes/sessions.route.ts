import { Hono } from "hono";
import { respond } from "@/api/lib/utils/hono/respond";
import { createMeeting, createMeetingInputSchema } from "../handlers/meetings";
import {
	createSession,
	createSessionInputSchema,
	deleteSession,
	deleteSessionInputSchema,
	getAllSessions,
	getAllSessionsInputSchema,
	getSessionById,
	getSessionByIdInputSchema,
} from "../handlers/sessions";
import { requireAuth } from "../lib/middleware/auth";
import { validator } from "../lib/utils/zod";

const sessionsRoute = new Hono()
	.use(requireAuth)
	// sessions
	.post("/", validator("json", createSessionInputSchema), async (c) => {
		const session = await createSession(
			c.var.user.user_id,
			c.req.valid("json"),
		);
		return respond.ok(c, 201, "Session created successfully", { session });
	})
	.get("/", validator("query", getAllSessionsInputSchema), async (c) => {
		const sessions = await getAllSessions(c.req.valid("query"));
		return respond.ok(c, 200, "Sessions fetched successfully", { sessions });
	})
	.get("/session", validator("query", getSessionByIdInputSchema), async (c) => {
		const session = await getSessionById(c.req.valid("query"));
		return respond.ok(c, 200, "Session fetched successfully", { session });
	})
	.delete(
		"/session",
		validator("json", deleteSessionInputSchema),
		async (c) => {
			const session = await deleteSession(c.req.valid("json"));
			return respond.ok(c, 200, "Session deleted successfully", { session });
		},
	)

	// meetings
	.post("/meeting", validator("json", createMeetingInputSchema), async (c) => {
		const result = await createMeeting(c.var.user.user_id, c.req.valid("json"));
		return respond.ok(c, 201, "Meeting created successfully", { ...result });
	});

export default sessionsRoute;
export type SessionsType = typeof sessionsRoute;
