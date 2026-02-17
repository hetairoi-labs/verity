import {
	activeCourses,
	activeGoals,
	activeSessions,
	courses,
	deletedCourses,
	deletedGoals,
	deletedSessions,
	goals,
	sessions,
} from "./sessions";
import { activeUsers, deletedUsers, users } from "./users";

export const schema = {
	users,
	courses,
	goals,
	sessions,
};

export type Schema = {
	users: typeof users.$inferSelect;
	courses: typeof courses.$inferSelect;
	sessions: typeof sessions.$inferSelect;
	goals: typeof goals.$inferSelect;
};

export const views = {
	activeUsers: activeUsers,
	deletedUsers: deletedUsers,
	activeCourses: activeCourses,
	deletedCourses: deletedCourses,
	activeSessions: activeSessions,
	deletedSessions: deletedSessions,
	activeGoals: activeGoals,
	deletedGoals: deletedGoals,
};
