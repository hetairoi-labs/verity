import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { timestamps } from "../utils";

export const users = sqliteTable("users", {
	id: text().primaryKey(),
	name: text().default(""),
	...timestamps,
});
