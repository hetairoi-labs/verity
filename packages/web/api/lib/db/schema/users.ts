import * as t from "drizzle-orm/sqlite-core";
import { timestamps } from "@/api/lib/utils/sql";

export const users = t.sqliteTable("users", {
	id: t.text("id").primaryKey(),
	name: t.text("name"),
	...timestamps,
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
