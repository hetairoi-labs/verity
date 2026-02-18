import { isNotNull, isNull, sql } from "drizzle-orm";
import {
	index,
	integer,
	numeric,
	sqliteTable,
	sqliteView,
	text,
	uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { timestamps } from "../timestamps";
import { users } from "./users";

export const courses = sqliteTable(
	"courses",
	{
		id: integer().primaryKey({
			autoIncrement: true,
		}),
		title: text().notNull(),
		desc: text().notNull(),
		numberOfSessions: integer().notNull(),
		authorId: integer()
			.references(() => users.id)
			.notNull(),
		...timestamps,
	},
	(table) => [
		index("courses_author_id_idx").on(table.authorId),
		uniqueIndex("courses_author_title_unique")
			.on(table.authorId, table.title)
			.where(sql`${table.deletedAt} IS NULL`),
	],
);

export const activeCourses = sqliteView("active_courses").as((qb) =>
	qb.select().from(courses).where(isNull(courses.deletedAt)),
);

export const deletedCourses = sqliteView("deleted_courses").as((qb) =>
	qb.select().from(courses).where(isNotNull(courses.deletedAt)),
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
		uniqueIndex("sessions_meeting_url_unique")
			.on(table.meetingUrl)
			.where(sql`${table.deletedAt} IS NULL`),
	],
);

export const activeSessions = sqliteView("active_sessions").as((qb) =>
	qb.select().from(sessions).where(isNull(sessions.deletedAt)),
);

export const deletedSessions = sqliteView("deleted_sessions").as((qb) =>
	qb.select().from(sessions).where(isNotNull(sessions.deletedAt)),
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
		index("goals_weightage_idx").on(table.weightage),
		uniqueIndex("goals_session_name_unique")
			.on(table.sessionId, table.key)
			.where(sql`${table.deletedAt} IS NULL`),
	],
);

export const activeGoals = sqliteView("active_goals").as((qb) =>
	qb.select().from(goals).where(isNull(goals.deletedAt)),
);

export const deletedGoals = sqliteView("deleted_goals").as((qb) =>
	qb.select().from(goals).where(isNotNull(goals.deletedAt)),
);
