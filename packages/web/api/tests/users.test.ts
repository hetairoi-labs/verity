import { afterEach, describe, expect, test } from "bun:test";
import { eq } from "drizzle-orm";
import { createSessionRecord } from "../handlers/sessions";
import { createUser, deleteUser, getUser } from "../handlers/users";
import { db } from "../lib/db";
import { schema } from "../lib/db/schema";
import { ApiError } from "../lib/utils/hono/error";
import { zIsoDate } from "../lib/utils/zod";

const { users, sessions, meetings, goals } = schema;

afterEach(async () => {
	await db.delete(users);
	await db.delete(sessions);
	await db.delete(meetings);
	await db.delete(goals);
});

describe("getUser", () => {
	test("should return user when found", async () => {
		await db.insert(users).values({
			id: "user-1",
			name: "Alice",
		});
		const user = await getUser({ userId: "user-1" });
		expect(user.id).toBe("user-1");
		expect(user.name).toBe("Alice");
	});

	test("should throw ApiError 404 when user not found", () => {
		return Promise.all([
			expect(getUser({ userId: "nonexistent" })).rejects.toThrow(ApiError),
			expect(getUser({ userId: "nonexistent" })).rejects.toMatchObject({
				status: 404,
				message: "User not found",
			}),
		]);
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

		expect(getUser({ userId: "deleted-user" })).rejects.toThrow(ApiError);
	});
});

describe("createUser", () => {
	test("should create user with name", async () => {
		const user = await createUser("user-2", {
			name: "Bob",
		});
		expect(user?.id).toBe("user-2");
		expect(user?.name).toBe("Bob");
	});

	test("should create user without name", async () => {
		const user = await createUser("user-3", {});
		expect(user?.id).toBe("user-3");
		expect(user?.name).toBe("");
	});

	test("should ressurect deleted user", async () => {
		await db.insert(users).values({ id: "user-7", name: "Deleted User" });
		await deleteUser({ userId: "user-7" });
		const user = await createUser("user-7", { name: "New User" });
		expect(user?.id).toBe("user-7");
		expect(user?.name).toBe("New User");
		expect(user?.createdAt && zIsoDate().parse(user.createdAt)).toBeInstanceOf(
			Date
		);
	});

	test("should set correct ISOString createdAt", async () => {
		const user = await createUser("user-4", { name: "Charlie" });
		expect(user?.createdAt && zIsoDate().parse(user.createdAt)).toBeInstanceOf(
			Date
		);
	});
});

describe("deleteUser", () => {
	test("should set correct ISOString deletedAt", async () => {
		await db.insert(users).values({ id: "user-5", name: "Deleted User" });
		const result = await deleteUser({ userId: "user-5" });
		expect(zIsoDate().parse(result?.deletedAt)).toBeInstanceOf(Date);
	});
	test("should associated sessions, meetings, and goals", async () => {
		const user = await createUser("user-8", { name: "Deleted User" });
		if (!user) {
			throw new Error("createUser failed");
		}
		const session = await createSessionRecord(
			{
				title: "Session 1",
				email: "test@example.com",
				price: 100,
				topic: "Integration Test Topic",
				index: 1,
				cid: "test-cid",
			},
			user.id
		);
		if (!session) {
			throw new ApiError(500, "Session not created");
		}
		const [meeting] = await db
			.insert(meetings)
			.values({
				duration: 1,
				sessionId: session.id,
				eventId: "event-1",
				meetingUrl: "https://example.com",
				startDate: new Date().toISOString(),
			})
			.returning();
		if (!meeting) {
			throw new ApiError(500, "Meeting not created");
		}
		const [goal] = await db
			.insert(goals)
			.values({
				name: "increase sale",
				weightage: 100,
				sessionId: session.id,
			})
			.returning();
		if (!goal) {
			throw new ApiError(500, "Goal not created");
		}
		const result = await deleteUser({ userId: user.id });
		expect(result).toBeDefined();
		expect(result?.deletedAt).toBeDefined();
		expect(getUser({ userId: user.id })).rejects.toThrow(ApiError);
		const [session2] = await db
			.select()
			.from(sessions)
			.where(eq(sessions.id, session.id));
		expect(session2?.deletedAt).toBeDefined();
		const [meeting2] = await db
			.select()
			.from(meetings)
			.where(eq(meetings.id, meeting.id));
		expect(meeting2?.deletedAt).toBeDefined();
		const [goal2] = await db.select().from(goals).where(eq(goals.id, goal.id));
		expect(goal2?.deletedAt).toBeDefined();
	});
});
