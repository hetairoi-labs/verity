import { afterEach, describe, expect, test } from "bun:test";
import { db } from "../db";
import { schema } from "../db/schema";
import { ApiError } from "../utils/hono/error";
import { zIsoDate } from "../utils/zod";
import { createUser, deleteUser, getUser } from "./users";

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
		const result = await createUser("user-2", {
			name: "Bob",
		});
		expect(result.user.id).toBe("user-2");
		expect(result.user.name).toBe("Bob");
	});

	test("should create user without name", async () => {
		const result = await createUser("user-3", {});
		expect(result.user.id).toBe("user-3");
		expect(result.user.name).toBe("");
	});

	test("should ressurect deleted user", async () => {
		await db.insert(users).values({ id: "user-7", name: "Deleted User" });
		await deleteUser("user-7");
		const result = await createUser("user-7", { name: "New User" });
		expect(result.user.id).toBe("user-7");
		expect(result.user.name).toBe("New User");
		expect(zIsoDate().parse(result.user.createdAt)).toBeInstanceOf(Date);
	});

	test("should set correct ISOString createdAt", async () => {
		const result = await createUser("user-4", { name: "Charlie" });
		expect(zIsoDate().parse(result.user.createdAt)).toBeInstanceOf(Date);
	});
});

describe("deleteUser", () => {
	test("should set correct ISOString deletedAt", async () => {
		await db.insert(users).values({ id: "user-5", name: "Deleted User" });
		const result = await deleteUser("user-5");
		expect(zIsoDate().parse(result.user.deletedAt)).toBeInstanceOf(Date);
	});
});
