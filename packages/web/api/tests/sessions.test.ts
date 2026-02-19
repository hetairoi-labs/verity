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
import { removeBotFromCall } from "../lib/utils/bot";
import { isIntegrationEnv } from "../lib/utils/test";

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
		for (const botId of createdBots) {
			await removeBotFromCall(botId);
		}
		await db.delete(users);
		console.log("Cleaned up users and bots");
	});

	test(
		"create a new session",
		async () => {
			if (!isIntegrationEnv()) return;

			const input = {
				summary: "Integration Test Session 5599",
				startDate: new Date(Date.now() + 120000),
				duration: 0.1,
			};
			const result = await createSession(userId, input);

			console.log(result.session);
			console.log(result.event);
			console.log(result.bot);

			const meetingUrl = result.event.hangoutLink;
			const botId = result.bot.id;
			const session = result.session;
			expect(session).toBeDefined();
			expect(botId).toBeDefined();
			expect(meetingUrl).toBeDefined();

			if (!session || !botId || !meetingUrl)
				throw new Error("expected session, bot, and event");

			createdBots.push(botId);

			expect(result.event.summary).toBe(input.summary);
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
