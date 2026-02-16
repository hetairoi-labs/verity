import { sql } from "drizzle-orm";
import { integer } from "drizzle-orm/sqlite-core";

export const timestamps = {
	updatedAt: integer("updated_at", { mode: "timestamp" }),
	createdAt: integer("created_at", { mode: "timestamp" })
		.default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`)
		.notNull(),
	deletedAt: integer("deleted_at", { mode: "timestamp" }),
};
