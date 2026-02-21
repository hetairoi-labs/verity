import { desc } from "drizzle-orm";
import { z } from "zod";
import { db } from "../lib/db";
import { schema } from "../lib/db/schema";
import { buildWhereActive } from "../lib/db/utils/builders";
import { softCascade } from "../lib/db/utils/cascade";
import { safeQuery } from "../lib/db/utils/safe";
import { ApiError } from "../lib/utils/hono/error";

const { sessions, meetings, goals } = schema;

// Schemas
export const createSessionInputSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().optional(),
	price: z.number().min(0, "Price in USDC must be greater than 0"),
});

export const getAllSessionsInputSchema = z.object({
	page: z.number().min(1).default(1),
	limit: z.number().min(1).max(100).default(10),
	userId: z.string().optional(),
});

export const getSessionByIdInputSchema = z.object({
	sessionId: z.number().optional(),
	hostId: z.string().optional(),
});

export const deleteSessionInputSchema = z.object({
	sessionId: z.number().min(1),
});

// Types
export type CreateSessionInput = z.input<typeof createSessionInputSchema>;
export type GetAllSessionsInput = z.input<typeof getAllSessionsInputSchema>;
export type GetSessionByIdInput = z.input<typeof getSessionByIdInputSchema>;
export type DeleteSessionInput = z.input<typeof deleteSessionInputSchema>;

// Handlers
export async function createSession(userId: string, json: CreateSessionInput) {
	const input = createSessionInputSchema.parse(json);

	// Create Session
	const [result] = await safeQuery(
		db
			.insert(sessions)
			.values({
				title: input.title,
				description: input.description,
				price: input.price.toString(),
				hostId: userId,
			})
			.returning(),
	);
	if (!result) throw new ApiError(500, "Failed to create session..");
	return result;
}

export async function getAllSessions(params: GetAllSessionsInput) {
	const {
		page = 1,
		limit = 10,
		userId,
	} = getAllSessionsInputSchema.parse(params);
	const offset = (page - 1) * limit;

	const result = await safeQuery(
		db
			.select()
			.from(sessions)
			.where(
				buildWhereActive([{ table: sessions, filters: { hostId: userId } }]),
			)
			.orderBy(desc(sessions.createdAt))
			.limit(limit)
			.offset(offset),
	);
	return result;
}

export async function getSessionById(params: GetSessionByIdInput) {
	const { sessionId, hostId } = getSessionByIdInputSchema.parse(params);
	if (!sessionId && !hostId)
		throw new ApiError(400, "Session ID or host ID is required");

	const [result] = await safeQuery(
		db
			.select()
			.from(sessions)
			.where(
				buildWhereActive([
					{ table: sessions, filters: { id: sessionId, hostId } },
				]),
			),
	);
	if (!result) throw new ApiError(404, "Session not found");
	return { session: result };
}

export async function deleteSession(params: DeleteSessionInput) {
	const { sessionId } = deleteSessionInputSchema.parse(params);
	const result = await softCascade(db, sessions, sessionId, [
		{
			table: meetings,
			foreignKeyField: meetings.sessionId,
			children: [{ table: goals, foreignKeyField: goals.meetingId }],
		},
	]);
	if (!result.row) throw new ApiError(404, "Session not found");
	return { session: result.row };
}
