import { sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "../lib/db";
import { schema } from "../lib/db/schema";
import { isoNow } from "../lib/db/utils";
import { buildUpdateData, buildWhereActive } from "../lib/db/utils/builders";
import { softCascade } from "../lib/db/utils/cascade";
import { safeQuery } from "../lib/db/utils/safe";
import { ApiError } from "../lib/utils/hono/error";

const { users, sessions, goals, meetings, participants } = schema;

// Schemas
export const createUserInputSchema = z.object({
	name: z
		.string()
		.min(1, "Minimum 1 character required")
		.max(32, "Maximum 32 characters required")
		.optional(),
});

export const getUserInputSchema = z.object({
	userId: z.string().min(1, "User ID is required"),
});

export const deleteUserInputSchema = z.object({
	userId: z.string().min(1, "User ID is required"),
});

export const updateUserInputSchema = z.object({
	name: z
		.string()
		.min(1, "Name is required")
		.max(32, "Name must be less than 32 characters")
		.optional(),
});

// Types
export type CreateUserInput = z.input<typeof createUserInputSchema>;
export type GetUserInput = z.input<typeof getUserInputSchema>;
export type DeleteUserInput = z.input<typeof deleteUserInputSchema>;
export type UpdateUserInput = z.input<typeof updateUserInputSchema>;

// Handlers
export async function createUser(userId: string, params: CreateUserInput) {
	const { name } = createUserInputSchema.parse(params);
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
	return user;
}

export async function getUser(params: GetUserInput) {
	const { userId } = getUserInputSchema.parse(params);
	const [user] = await safeQuery(
		db
			.select()
			.from(users)
			.where(buildWhereActive([{ table: users, filters: { id: userId } }])),
	);
	if (!user) throw new ApiError(404, "User not found");
	return user;
}

export async function deleteUser(
	params: DeleteUserInput,
): Promise<typeof users.$inferSelect | undefined> {
	const { userId } = deleteUserInputSchema.parse(params);
	const result = await softCascade(db, users, userId, [
		{
			table: sessions,
			foreignKeyField: sessions.hostId,
			children: [
				{ table: meetings, foreignKeyField: meetings.sessionId },
				{ table: participants, foreignKeyField: participants.sessionId },
				{ table: goals, foreignKeyField: goals.sessionId },
			],
		},
	]);
	if (!result.success) throw new ApiError(500, "Failed to delete user");
	return result.row;
}

export async function updateUser(userId: string, params: UpdateUserInput) {
	const input = updateUserInputSchema.parse(params);
	const values = buildUpdateData(input);

	const [user] = await safeQuery(
		db
			.update(users)
			.set({
				...values,
				updatedAt: isoNow(),
			})
			.where(buildWhereActive([{ table: users, filters: { id: userId } }]))
			.returning(),
	);
	if (!user) throw new ApiError(404, "User not found");
	return user;
}
