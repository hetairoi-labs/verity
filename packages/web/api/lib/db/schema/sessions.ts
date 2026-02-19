import {
	index,
	integer,
	numeric,
	sqliteTable,
	text,
} from "drizzle-orm/sqlite-core";
import { timestamps, uniqueIndexSoft } from "../utils";
import { users } from "./users";

export const sessions = sqliteTable(
	"sessions",
	{
		id: integer().primaryKey({
			autoIncrement: true,
		}),
		meetingUrl: text("meeting_url"),
		botId: text("bot_id"),
		transcriptUrl: text("transcript_url"),
		summary: text("summary"),
		userId: text("user_id")
			.references(() => users.id)
			.notNull(),
		...timestamps,
	},
	(table) => [
		index("sessions_user_id_idx").on(table.userId),
		index("sessions_bot_id_idx").on(table.botId),
		uniqueIndexSoft("sessions_meeting_url_unique", table).on(table.meetingUrl),
	],
);

export const goals = sqliteTable(
	"goals",
	{
		id: integer().primaryKey({
			autoIncrement: true,
		}),
		title: text(),
		desc: text(),
		key: text().notNull(),
		result: numeric().notNull(),
		unit: text().notNull(),
		weightage: integer().default(0),
		sessionId: integer("session_id")
			.references(() => sessions.id)
			.notNull(),
		...timestamps,
	},
	(table) => [
		index("goals_session_id_idx").on(table.sessionId),
		uniqueIndexSoft("goals_session_name_unique", table).on(
			table.sessionId,
			table.key,
		),
	],
);
