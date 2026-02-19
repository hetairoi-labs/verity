import {
	activeCourses,
	activeGoals,
	activeSessions,
	courses,
	goals,
	sessions,
} from "./sessions";
import {
	activeLinkedAccounts,
	activeUsers,
	linkedAccounts,
	users,
} from "./users";

export const schema = {
	users,
	linkedAccounts,
	courses,
	goals,
	sessions,
};

export type Schema = {
	users: typeof users.$inferSelect;
	linkedAccounts: typeof linkedAccounts.$inferSelect;
	courses: typeof courses.$inferSelect;
	sessions: typeof sessions.$inferSelect;
	goals: typeof goals.$inferSelect;
};

export const views = {
	activeUsers: activeUsers,
	activeLinkedAccounts: activeLinkedAccounts,
	activeCourses: activeCourses,
	activeSessions: activeSessions,
	activeGoals: activeGoals,
};
