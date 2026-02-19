import { goals, sessions } from "./sessions";
import { users } from "./users";

export const schema = {
	users,
	sessions,
	goals,
};

export type Schema = {
	users: typeof users.$inferSelect;
	sessions: typeof sessions.$inferSelect;
	goals: typeof goals.$inferSelect;
};
