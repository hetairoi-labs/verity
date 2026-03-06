import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../lib/db";
import { schema } from "../lib/db/schema";
import { safeQuery } from "../lib/db/utils/safe";
import { ApiError } from "../lib/utils/hono/error";

const { sessions, goals } = schema;

export const createGoalInputSchema = z.object({
	sessionId: z.number().min(1, "Session ID is required"),
	name: z.string().min(1, "Name is required"),
	weightage: z
		.number()
		.min(1, "Weightage must be greater than 0")
		.max(100, "Weightage must be less than 100")
		.optional(),
});

export type CreateGoalInput = z.input<typeof createGoalInputSchema>;

export async function createGoal(userId: string, json: CreateGoalInput) {
	const input = createGoalInputSchema.parse(json);

	const [session] = await safeQuery(
		db
			.select({
				hostId: sessions.hostId,
			})
			.from(sessions)
			.where(eq(sessions.id, input.sessionId))
			.limit(1)
	);
	if (!session) {
		throw new ApiError(404, "Session not found");
	}
	if (session.hostId !== userId) {
		throw new ApiError(403, "Unauthorized");
	}

	// create goal
	const [goal] = await safeQuery(db.insert(goals).values(input).returning());
	if (!goal) {
		throw new ApiError(500, "Failed to create goal");
	}

	return goal;
}
