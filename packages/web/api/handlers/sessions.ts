import { desc } from "drizzle-orm";
import { z } from "zod";
import { db } from "../lib/db";
import { schema } from "../lib/db/schema";
import { buildWhereActive } from "../lib/db/utils/builders";
import { softCascade } from "../lib/db/utils/cascade";
import { requireAtLeastOne, safeQuery } from "../lib/db/utils/safe";
import { ApiError } from "../lib/utils/hono/error";

const { sessions, meetings, goals } = schema;

// Schemas
export const createSessionInputSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().optional(),
	price: z
		.number()
		.min(0, "Price in USDC must be greater than 0")
		.max(1000000, "Price in USDC must be less than 1,000,000"),
});

export const getAllSessionsInputSchema = z.object({
	page: z.number().min(1).default(1),
	limit: z.number().min(1).max(100).default(10),
});

export const getSessionByIdInputSchema = z.object({
	sessionId: z.number().min(1, "Session ID is required"),
});

export const deleteSessionInputSchema = z.object({
	sessionId: z.number().min(1, "Session ID is required"),
});

// Types
export type CreateSessionInput = z.input<typeof createSessionInputSchema>;
export type GetAllSessionsInput = z.input<typeof getAllSessionsInputSchema>;
export type GetSessionByIdInput = z.input<typeof getSessionByIdInputSchema>;
export type DeleteSessionInput = z.input<typeof deleteSessionInputSchema>;

// Handlers
export async function createSession(json: CreateSessionInput, hostId: string) {
	const input = createSessionInputSchema.parse(json);

	// Create Session
	const [result] = await safeQuery(
		db
			.insert(sessions)
			.values({
				title: input.title,
				description: input.description,
				price: input.price.toString(),
				hostId,
			})
			.returning(),
	);
	if (!result) throw new ApiError(500, "Failed to create session..");
	return result;
}

export async function getAllSessions(
	params: GetAllSessionsInput,
	hostId?: string,
) {
	const { page = 1, limit = 10 } = getAllSessionsInputSchema.parse(params);
	const offset = (page - 1) * limit;

	const result = await safeQuery(
		db
			.select()
			.from(sessions)
			.where(buildWhereActive([{ table: sessions, filters: { hostId } }]))
			.orderBy(desc(sessions.createdAt))
			.limit(limit)
			.offset(offset),
	);
	return result;
}

export async function getSessionById(params: GetSessionByIdInput) {
	const { sessionId } = getSessionByIdInputSchema.parse(params);
	requireAtLeastOne({ sessionId }, "Session ID is required");

	const [result] = await safeQuery(
		db
			.select()
			.from(sessions)
			.where(
				buildWhereActive([{ table: sessions, filters: { id: sessionId } }]),
			),
	);
	if (!result) throw new ApiError(404, "Session not found");
	return result;
}

export async function deleteSession(
	params: DeleteSessionInput,
	hostId: string,
) {
	const { sessionId } = deleteSessionInputSchema.parse(params);

	const session = await getSessionById({ sessionId });
	if (session.hostId !== hostId) throw new ApiError(403, "Unauthorized");

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
