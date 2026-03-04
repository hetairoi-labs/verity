import { Hono } from "hono";
import { respond } from "@/api/lib/utils/hono/respond";
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

	// get all sessions (all users)
	.get("/all", validator("query", getAllSessionsInputSchema), async (c) => {
		const sessions = await getAllSessions(c.req.valid("query"));
		return respond.ok(c, 200, "Sessions fetched successfully", { sessions });
	})

	// get session details by id (all users)
	.get("/session", validator("query", getSessionByIdInputSchema), async (c) => {
		const session = await getSessionById(c.req.valid("query"));
		return respond.ok(c, 200, "Session fetched successfully", { session });
	})

	// create session (all users)
	.post("/", validator("json", createSessionInputSchema), async (c) => {
		const session = await createSession(
			c.req.valid("json"),
			c.var.user.user_id
		);
		return respond.ok(c, 201, "Session created successfully", { session });
	})

	// get all sessions by host (host only)
	.get("/host", validator("query", getAllSessionsInputSchema), async (c) => {
		const sessions = await getAllSessions(
			c.req.valid("query"),
			c.var.user.user_id
		);
		return respond.ok(c, 200, "Sessions fetched successfully", { sessions });
	})

	// delete session by id (host only)
	.delete(
		"/session",
		validator("json", deleteSessionInputSchema),
		async (c) => {
			const session = await deleteSession(
				c.req.valid("json"),
				c.var.user.user_id
			);
			return respond.ok(c, 200, "Session deleted successfully", { session });
		}
	);

export default sessionsRoute;
export type SessionsType = typeof sessionsRoute;
