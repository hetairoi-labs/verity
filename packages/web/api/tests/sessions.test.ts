import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { createMeeting } from "../handlers/meetings";
import { createSessionRecord } from "../handlers/sessions";
import { createUser } from "../handlers/users";
import { db } from "../lib/db";
import { schema } from "../lib/db/schema";
import { isIntegrationEnv } from "../lib/utils/tests";

const { meetings, sessions } = schema;
const RUN_INTEGRATION = process.env.INTEGRATION === "true";

describe("createMeeting Integration", () => {
	let userId: string;

	beforeEach(async () => {
		if (!RUN_INTEGRATION) {
			return;
		}

		const created = await createUser(`user-int-${Date.now()}`, {
			name: "Integration Test User",
		});
		if (!created) {
			throw new Error("createUser failed");
		}
		userId = created.id;
	});

	afterEach(async () => {
		if (!RUN_INTEGRATION) {
			return;
		}
		await db.delete(meetings);
		await db.delete(sessions);
	});

	test(
		"create a new meeting",
		async () => {
			if (!isIntegrationEnv()) {
				return;
			}

			const session = await createSessionRecord(
				{
					title: "Integration Test Session",
					description: "Test",
					email: "test@example.com",
					price: 0,
					topic: "Integration Test Topic",
					index: 1,
					cid: "test-cid",
				},
				userId
			);
			const input = {
				sessionId: session.id,
				summary: "Integration Test Meeting 5599",
				startDate: new Date(Date.now() + 120_000),
				duration: 0.1,
				attendees: [] as string[],
			};
			const result = await createMeeting(input, userId);

			expect(result.meetingUrl).toBeDefined();
			expect(result.sessionPrice).toBeDefined();

			const dbMeetings = await db.select().from(meetings);
			expect(dbMeetings).toHaveLength(1);
			expect(dbMeetings[0]?.sessionId).toBe(session.id);
			expect(dbMeetings[0]?.meetingUrl).toBe(result.meetingUrl);
		},
		{ timeout: 30_000, retry: 2 }
	);
});
