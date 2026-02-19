import { afterEach, describe, expect, test } from "bun:test";
import { createUser, deleteUser, getUser } from "../handlers/users";
import { db } from "../lib/db";
import { schema } from "../lib/db/schema";
import { ApiError } from "../lib/utils/hono/error";
import { zIsoDate } from "../lib/utils/zod";

const { users } = schema;

afterEach(async () => {
	await db.delete(users);
});

describe("getUser", () => {
	test("should return user when found", async () => {
		await db.insert(users).values({
			id: "user-1",
			name: "Alice",
		});
		const user = await getUser("user-1");
		expect(user.id).toBe("user-1");
		expect(user.name).toBe("Alice");
	});

	test("should throw ApiError 404 when user not found", async () => {
		expect(getUser("nonexistent")).rejects.toThrow(ApiError);
		expect(getUser("nonexistent")).rejects.toMatchObject({
			status: 404,
			message: "User not found",
		});
	});

	test("should not be able to fetch deleted user", async () => {
		const now = new Date().toISOString();
		await db
			.insert(users)
			.values({
				id: "deleted-user",
				name: "Deleted",
				deletedAt: now,
			})
			.returning();

		expect(getUser("deleted-user")).rejects.toThrow(ApiError);
	});
});

describe("createUser", () => {
	test("should create user with name", async () => {
		const user = await createUser("user-2", {
			name: "Bob",
		});
		expect(user.id).toBe("user-2");
		expect(user.name).toBe("Bob");
	});

	test("should create user without name", async () => {
		const user = await createUser("user-3", {});
		expect(user.id).toBe("user-3");
		expect(user.name).toBe("");
	});

	test("should ressurect deleted user", async () => {
		await db.insert(users).values({ id: "user-7", name: "Deleted User" });
		await deleteUser("user-7");
		const user = await createUser("user-7", { name: "New User" });
		expect(user.id).toBe("user-7");
		expect(user.name).toBe("New User");
		expect(zIsoDate().parse(user.createdAt)).toBeInstanceOf(Date);
	});

	test("should set correct ISOString createdAt", async () => {
		const user = await createUser("user-4", { name: "Charlie" });
		expect(zIsoDate().parse(user.createdAt)).toBeInstanceOf(Date);
	});
});

describe("deleteUser", () => {
	test("should set correct ISOString deletedAt", async () => {
		await db.insert(users).values({ id: "user-5", name: "Deleted User" });
		const result = await deleteUser("user-5");
		expect(zIsoDate().parse(result.user.deletedAt)).toBeInstanceOf(Date);
	});
});
