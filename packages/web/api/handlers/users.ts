import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "../lib/db";
import { schema } from "../lib/db/schema";
import { isActive, isoNow } from "../lib/db/utils";
import { softCascade } from "../lib/db/utils/cascade";
import { ApiError } from "../lib/utils/hono/error";
import { safeQuery } from "../lib/utils/safe";

const { users, sessions, goals } = schema;

export const createUserInputSchema = z.object({
	name: z
		.string()
		.min(1, "Minimum 1 character required")
		.max(32, "Maximum 32 characters required")
		.optional(),
});
export type CreateUserInput = z.input<typeof createUserInputSchema>;

export async function getUser(userId: string) {
	const [user] = await safeQuery(
		db
			.select()
			.from(users)
			.where(and(eq(users.id, userId), isActive(users))),
	);
	if (!user) throw new ApiError(404, "User not found");
	return user;
}

export async function createUser(userId: string, json: CreateUserInput) {
	const { name } = createUserInputSchema.parse(json);
	const [user] = await safeQuery(
		db
			.insert(users)
			.values({ id: userId, name })
			.onConflictDoUpdate({
				target: users.id,
				set: {
					name,
					deletedAt: null,
					updatedAt: isoNow(),
				},
				setWhere: sql`${users.deletedAt} IS NOT NULL`,
			})
			.returning(),
	);
	if (!user) throw new ApiError(409, "User already exists");
	return user;
}

export async function deleteUser(userId: string) {
	const result = await softCascade(db, users, userId, [
		{
			table: sessions,
			foreignKeyField: sessions.userId,
			children: [{ table: goals, foreignKeyField: goals.sessionId }],
		},
	]);
	if (!result.row) throw new ApiError(404, "No user to delete");
	return { user: result.row };
}
