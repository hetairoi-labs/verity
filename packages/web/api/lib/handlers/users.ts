import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db";
import { schema } from "../db/schema";
import { isActive } from "../db/utils";
import { ApiError } from "../utils/hono/error";
import { safeQuery } from "../utils/safe";

const { users } = schema;

export const createUserInputSchema = z.object({
	name: z
		.string()
		.min(1, "Minimum 1 character required")
		.max(32, "Maximum 32 characters required")
		.optional(),
});
export type CreateUserInput = z.infer<typeof createUserInputSchema>;

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
	const [user] = await safeQuery(
		db.insert(users).values({ id: userId, name: json.name }).returning(),
	);
	if (!user) throw new ApiError(500, "Failed to create user");
	return { user };
}
