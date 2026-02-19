import {
	afterAll,
	afterEach,
	beforeEach,
	describe,
	expect,
	test,
} from "bun:test";
import { createSession } from "../handlers/sessions";
import { createUser } from "../handlers/users";
import { db } from "../lib/db";
import { schema } from "../lib/db/schema";

const { sessions, users } = schema;
const RUN_INTEGRATION = process.env.INTEGRATION === "true";

describe("createSession Integration", () => {
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
		await db.delete(sessions);
	});

	afterAll(async () => {
		if (!RUN_INTEGRATION) return;
		await db.delete(users);
	});

	test(
		"create a new session",
		async () => {
			if (!RUN_INTEGRATION) {
				expect(true).toBe(true);
				return;
			}

			const startDate = new Date(Date.now() + 120000);

			const result = await createSession(userId, {
				summary: "Integration Test Session",
				startDate,
				duration: 5,
			});

			console.log(result.session);
			console.log(result.event);
			console.log(result.bot);
			console.log(result.bot.recordings[0]?.media_shortcuts.transcript.data);

			const meetingUrl = result.event.hangoutLink;
			const botId = result.bot.id;
			const session = result.session;
			expect(session).toBeDefined();
			expect(botId).toBeDefined();
			expect(meetingUrl).toBeDefined();

			if (!session || !botId || !meetingUrl)
				throw new Error("expected session, bot, and event");

			createdBots.push(botId);

			expect(result.event.summary).toBe("Integration Test Session");
			expect(session.userId).toBe(userId);
			expect(session.meetingUrl).toBe(meetingUrl);
			expect(session.botId).toBe(botId);
			expect(session.transcriptUrl).toBeNull();
			expect(session.deletedAt).toBeNull();
			expect(new Date(session.createdAt)).toBeInstanceOf(Date);

			expect(result.event.start?.dateTime).toBeDefined();
			expect(result.event.end?.dateTime).toBeDefined();

			const dbSessions = await db.select().from(sessions);
			expect(dbSessions).toHaveLength(1);
			expect(dbSessions[0]?.id).toBe(session.id);
		},
		{ timeout: 30000, retry: 2 },
	);
});
