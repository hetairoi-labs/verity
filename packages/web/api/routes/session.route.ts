import { and, eq, sql } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import { db } from "@/api/lib/db";
import { schema } from "@/api/lib/db/schema";
import { isActive } from "@/api/lib/db/utils";
import { softCascade } from "@/api/lib/db/utils/cascade";
import { requireAuth } from "@/api/lib/middleware/auth";
import { ApiError } from "@/api/lib/utils/hono/error";
import { respond } from "@/api/lib/utils/hono/respond";
import { safeQuery } from "@/api/lib/utils/safe";
import { validator } from "@/api/lib/utils/zod";

const { sessions, goals } = schema;

const goalSchema = z.object({
	key: z.string().min(1),
	result: z.coerce.number(),
	unit: z.string().min(1),
	title: z.string().optional(),
	desc: z.string().optional(),
	weightage: z.coerce.number().default(0),
});

const sessionRoute = new Hono()
	.use(requireAuth)
	.get(
		"/",
		validator(
			"query",
			z.object({
				page: z.coerce.number().default(1),
				limit: z.coerce.number().default(5),
			}),
		),
		async (c) => {
			const { page, limit } = c.req.valid("query");
			const userId = c.var.user.user_id;
			const offset = (page - 1) * limit;
			const data = await safeQuery(
				db
					.select()
					.from(sessions)
					.where(and(eq(sessions.userId, userId), isActive(sessions)))
					.limit(limit)
					.offset(offset),
			);
			if (data.length === 0) throw new ApiError(404, "No sessions found");
			return respond.ok(c, 200, "Sessions fetched successfully", {
				page,
				limit,
				sessions: data,
			});
		},
	)
	.get(
		"/:id",
		validator("param", z.object({ id: z.coerce.number() })),
		async (c) => {
			const { id } = c.req.valid("param");
			const userId = c.var.user.user_id;
			const data = await safeQuery(
				db
					.select()
					.from(sessions)
					.where(
						and(
							eq(sessions.id, id),
							eq(sessions.userId, userId),
							isActive(sessions),
						),
					),
			);
			if (data.length === 0) throw new ApiError(404, "Session not found");
			return respond.ok(c, 200, `Session ${id} fetched successfully`, {
				session: data[0],
			});
		},
	)
	.post(
		"/",
		validator(
			"json",
			z.object({
				meetingUrl: z.url().optional(),
				botId: z.string().optional(),
				transcriptUrl: z.url().optional(),
				goals: z.array(goalSchema).default([]),
			}),
		),
		async (c) => {
			const {
				meetingUrl,
				botId,
				transcriptUrl,
				goals: goalsData,
			} = c.req.valid("json");
			const userId = c.var.user.user_id;
			const [session] = await safeQuery(
				db
					.insert(sessions)
					.values({ meetingUrl, botId, transcriptUrl, userId })
					.returning(),
			);
			if (!session) throw new ApiError(500, "Failed to create session");
			if (goalsData.length > 0) {
				await db.insert(goals).values(
					goalsData.map((g) => ({
						sessionId: session.id,
						key: g.key,
						result: String(g.result),
						unit: g.unit,
						title: g.title,
						desc: g.desc,
						weightage: g.weightage,
					})),
				);
			}
			return respond.ok(c, 201, "Session created successfully", {
				session,
			});
		},
	)
	.patch(
		"/:id",
		validator("param", z.object({ id: z.coerce.number() })),
		validator(
			"json",
			z.object({
				meetingUrl: z.string().url().optional(),
				botId: z.string().optional(),
				transcriptUrl: z.string().url().optional(),
			}),
		),
		async (c) => {
			const { id } = c.req.valid("param");
			const json = c.req.valid("json");
			const userId = c.var.user.user_id;

			const updateData = Object.fromEntries(
				Object.entries(json).filter(([_, value]) => value !== undefined),
			);
			if (Object.keys(updateData).length === 0) {
				throw new ApiError(400, "At least one field must be provided");
			}

			const result = await safeQuery(
				db
					.update(sessions)
					.set({ ...updateData, updatedAt: sql`CURRENT_TIMESTAMP` })
					.where(
						and(
							eq(sessions.id, id),
							eq(sessions.userId, userId),
							isActive(sessions),
						),
					)
					.returning(),
			);

			if (result.length === 0) throw new ApiError(404, "Session not found");

			return respond.ok(c, 200, "Session updated successfully", {
				session: result[0],
			});
		},
	)
	.delete(
		"/:id",
		validator("param", z.object({ id: z.coerce.number() })),
		async (c) => {
			const { id } = c.req.valid("param");
			const userId = c.var.user.user_id;
			const [session] = await safeQuery(
				db
					.select()
					.from(sessions)
					.where(
						and(
							eq(sessions.id, id),
							eq(sessions.userId, userId),
							isActive(sessions),
						),
					),
			);
			if (!session) throw new ApiError(404, "Session not found");
			await softCascade(db, sessions, id, [
				{ table: goals, foreignKeyField: goals.sessionId },
			]);
			return respond.ok(c, 200, "Session deleted successfully");
		},
	);

export default sessionRoute;
export type SessionType = typeof sessionRoute;
