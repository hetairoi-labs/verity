import type { AnySQLiteColumn, SQLiteTable } from "drizzle-orm/sqlite-core";
import {
	index,
	integer,
	numeric,
	sqliteTable,
	text,
} from "drizzle-orm/sqlite-core";
import { timestamps, uniqueIndexSoft } from "../utils";

export type SchemaTable = SQLiteTable & {
	createdAt: AnySQLiteColumn;
	updatedAt: AnySQLiteColumn;
	deletedAt: AnySQLiteColumn;
};

export const users = sqliteTable("users", {
	id: text().primaryKey(),
	name: text().default(""),
	...timestamps,
});

export const sessions = sqliteTable(
	"sessions",
	{
		id: integer().primaryKey({
			autoIncrement: true,
		}),
		title: text().notNull(),
		description: text(),
		price: numeric().notNull(),
		hostId: text("host_id")
			.references(() => users.id)
			.notNull(),
		...timestamps,
	},
	(table) => [index("sessions_host_id_idx").on(table.hostId)],
);

export const meetings = sqliteTable(
	"meetings",
	{
		id: integer().primaryKey({
			autoIncrement: true,
		}),
		eventId: text("event_id").notNull(),
		botId: text("bot_id").notNull(),
		summary: text(),
		meetingUrl: text("meeting_url").notNull(),
		calendarLink: text("calendar_link"),
		transcriptUrl: text("transcript_url"),
		startDate: text("start_date").notNull(),
		duration: integer().notNull(),
		sessionId: integer("session_id")
			.references(() => sessions.id)
			.notNull(),
		...timestamps,
	},
	(table) => [
		index("meetings_session_id_idx").on(table.sessionId),
		index("meetings_bot_id_idx").on(table.botId),
		uniqueIndexSoft("meetings_meeting_url_unique", table).on(table.meetingUrl),
	],
);

export const goals = sqliteTable(
	"goals",
	{
		id: integer().primaryKey({
			autoIncrement: true,
		}),
		key: text().notNull(),
		result: numeric().notNull(),
		unit: text().notNull(),
		description: text(),
		weightage: integer().default(0),
		progress: integer().default(0),
		meetingId: integer("meeting_id")
			.references(() => meetings.id)
			.notNull(),
		...timestamps,
	},
	(table) => [
		index("goals_meeting_id_idx").on(table.meetingId),
		uniqueIndexSoft("goals_meeting_key_unique", table).on(
			table.meetingId,
			table.key,
		),
	],
);

export const schema = {
	users,
	sessions,
	meetings,
	goals,
};

export type Schema = typeof schema;
