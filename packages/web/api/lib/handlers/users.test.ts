import { afterEach, describe, expect, test } from "bun:test";
import { db } from "../db";
import { schema } from "../db/schema";
import { ApiError } from "../utils/hono/error";
import { createUser, getUser } from "./users";

const { users } = schema;

afterEach(() => {
	db.delete(users);
});

describe("getUser", () => {
	test("returns user when found", async () => {
		await db.insert(users).values({
			id: "user-1",
			name: "Alice",
		});
		const user = await getUser("user-1");
		expect(user.id).toBe("user-1");
		expect(user.name).toBe("Alice");
	});

	test("throws ApiError 404 when user not found", async () => {
		await expect(getUser("nonexistent")).rejects.toThrow(ApiError);
		await expect(getUser("nonexistent")).rejects.toMatchObject({
			status: 404,
			message: "User not found",
		});
	});

	test("throws when user is soft-deleted", async () => {
		const now = new Date().toISOString();
		await db.insert(users).values({
			id: "deleted-user",
			name: "Deleted",
			deletedAt: now,
		});
		await expect(getUser("deleted-user")).rejects.toThrow(ApiError);
	});
});

describe("createUser", () => {
	test("creates user with name", async () => {
		const result = await createUser("user-2", {
			name: "Bob",
		});
		expect(result.user.id).toBe("user-2");
		expect(result.user.name).toBe("Bob");
	});

	test("creates user without optional name", async () => {
		const result = await createUser("user-3", {});
		expect(result.user.id).toBe("user-3");
		expect(result.user.name).toBe("");
	});
});
