import { isNull } from "drizzle-orm";
import {
	index,
	integer,
	numeric,
	sqliteTable,
	sqliteView,
	text,
} from "drizzle-orm/sqlite-core";
import { timestamps, uniqueIndexSoft } from "../utils";
import { users } from "./users";

export const courses = sqliteTable(
	"courses",
	{
		id: integer().primaryKey({
			autoIncrement: true,
		}),
		title: text().notNull(),
		desc: text().default(""),
		authorId: text()
			.references(() => users.id)
			.notNull(),
		...timestamps,
	},
	(table) => [
		index("courses_author_id_idx").on(table.authorId),
		uniqueIndexSoft("courses_author_title_unique", table).on(
			table.authorId,
			table.title,
		),
	],
);

export const activeCourses = sqliteView("active_courses").as((qb) =>
	qb.select().from(courses).where(isNull(courses.deletedAt)),
);

export const sessions = sqliteTable(
	"sessions",
	{
		id: integer().primaryKey({
			autoIncrement: true,
		}),
		meetingUrl: text(),
		botId: text(),
		transcriptUrl: text(),
		courseId: integer()
			.references(() => courses.id)
			.notNull(),
		...timestamps,
	},
	(table) => [
		index("sessions_course_id_idx").on(table.courseId),
		index("sessions_bot_id_idx").on(table.botId),
		uniqueIndexSoft("sessions_meeting_url_unique", table).on(table.meetingUrl),
	],
);

export const activeSessions = sqliteView("active_sessions").as((qb) =>
	qb.select().from(sessions).where(isNull(sessions.deletedAt)),
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
		sessionId: integer()
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

export const activeGoals = sqliteView("active_goals").as((qb) =>
	qb.select().from(goals).where(isNull(goals.deletedAt)),
);
