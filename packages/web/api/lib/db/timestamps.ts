import { sql } from "drizzle-orm";
import { text } from "drizzle-orm/sqlite-core";

export const timestamps = {
	updatedAt: text("updated_at"),
	createdAt: text("created_at")
		.default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now', 'utc'))`)
		.notNull(),
	deletedAt: text("deleted_at"),
};
