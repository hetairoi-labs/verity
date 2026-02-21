import {
	afterAll,
	afterEach,
	beforeEach,
	describe,
	expect,
	test,
} from "bun:test";
import { createMeeting } from "../handlers/meetings";
import { createSession } from "../handlers/sessions";
import { createUser } from "../handlers/users";
import { db } from "../lib/db";
import { schema } from "../lib/db/schema";
import { removeBotFromCall } from "../lib/utils/bot";
import { isIntegrationEnv } from "../lib/utils/tests";

const { meetings, sessions, users } = schema;
const RUN_INTEGRATION = process.env.INTEGRATION === "true";

describe("createMeeting Integration", () => {
	let userId: string;
	const createdBots: string[] = [];

	beforeEach(async () => {
		if (!RUN_INTEGRATION) return;

		userId = (
			await createUser(`user-int-${Date.now()}`, {
				name: "Integration Test User",
			})
		).id;
	});

	afterEach(async () => {
		if (!RUN_INTEGRATION) return;
		await db.delete(meetings);
		await db.delete(sessions);
	});

	afterAll(async () => {
		if (!RUN_INTEGRATION) return;
		for (const botId of createdBots) {
			await removeBotFromCall(botId);
		}
		await db.delete(users);
		console.log("Cleaned up users and bots");
	});

	test(
		"create a new meeting",
		async () => {
			if (!isIntegrationEnv()) return;

			const session = await createSession(userId, {
				title: "Integration Test Session",
				description: "Test",
				price: 0,
			});
			const input = {
				sessionId: session.id,
				summary: "Integration Test Meeting 5599",
				startDate: new Date(Date.now() + 120000),
				duration: 0.1,
			};
			const result = await createMeeting(userId, input);

			const meetingUrl = result.event.hangoutLink;
			const botId = result.bot.id;
			const meeting = result.meeting;
			expect(meeting).toBeDefined();
			expect(botId).toBeDefined();
			expect(meetingUrl).toBeDefined();

			if (!meeting || !botId || !meetingUrl)
				throw new Error("expected meeting, bot, and event");

			createdBots.push(botId);

			expect(result.event.summary).toBe(input.summary);
			expect(meeting.sessionId).toBe(session.id);
			expect(meeting.meetingUrl).toBe(meetingUrl);
			expect(meeting.botId).toBe(botId);
			expect(meeting.transcriptUrl).toBeNull();
			expect(meeting.deletedAt).toBeNull();
			expect(new Date(meeting.createdAt)).toBeInstanceOf(Date);

			expect(result.event.start?.dateTime).toBeDefined();
			expect(result.event.end?.dateTime).toBeDefined();

			const dbMeetings = await db.select().from(meetings);
			expect(dbMeetings).toHaveLength(1);
			expect(dbMeetings[0]?.id).toBe(meeting.id);
		},
		{ timeout: 30000, retry: 2 },
	);
});
