import { Hono } from "hono";
import { respond } from "@/api/lib/utils/hono/respond";
import { safeAsync } from "@/lib/utils/safe";
import {
	createSession,
	createSessionInputSchema,
	deleteSession,
	deleteSessionInputSchema,
	enrollParticipant,
	enrollParticipantInputSchema,
	getAllSessions,
	getAllSessionsInputSchema,
	getDashboardMetrics,
	getSessionById,
	getSessionByIdInputSchema,
	getSessionHistory,
	getSessionHistoryInputSchema,
	updateSession,
	updateSessionInputSchema,
} from "../handlers/sessions";
import { requireAuth } from "../lib/middleware/auth";
import { logger } from "../lib/utils/pino";
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
	.post("/", validator("json", createSessionInputSchema), (c) => {
		safeAsync(async () => {
			await createSession(c.req.valid("json"), c.var.user.user_id);
		}).then(([, error]) => {
			if (error) {
				logger.error(error, "evm.session.upsert.error");
			}
		});
		return respond.ok(c, 200, "Creation queued successfully", {});
	})
	.patch("/", validator("json", updateSessionInputSchema), (c) => {
		safeAsync(async () => {
			await updateSession(c.req.valid("json"), c.var.user.user_id);
		}).then(([, error]) => {
			if (error) {
				logger.error(error, "evm.session.update.error");
			}
		});
		return respond.ok(c, 200, "Update queued successfully", {});
	})

	// get all sessions by host (host only)
	.get("/host", validator("query", getAllSessionsInputSchema), async (c) => {
		const sessions = await getAllSessions(
			c.req.valid("query"),
			c.var.user.user_id
		);
		return respond.ok(c, 200, "Sessions fetched successfully", { sessions });
	})
	.get(
		"/history",
		validator("query", getSessionHistoryInputSchema),
		async (c) => {
			const sessions = await getSessionHistory(
				c.req.valid("query"),
				c.var.user.user_id
			);
			return respond.ok(c, 200, "Session history fetched successfully", {
				sessions,
			});
		}
	)
	.get("/dashboard/metrics", async (c) => {
		const metrics = await getDashboardMetrics(c.var.user.user_id);
		return respond.ok(c, 200, "Dashboard metrics fetched successfully", {
			metrics,
		});
	})
	.post(
		"/participants/enroll",
		validator("json", enrollParticipantInputSchema),
		async (c) => {
			const participant = await enrollParticipant(
				c.req.valid("json"),
				c.var.user.user_id
			);
			return respond.ok(c, 200, "Participant enrolled successfully", {
				participant,
			});
		}
	)

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
