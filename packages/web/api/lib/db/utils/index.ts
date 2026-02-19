import { sql } from "drizzle-orm";
import type { AnySQLiteColumn } from "drizzle-orm/sqlite-core";
import { text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const timestamps = {
	updatedAt: text(),
	createdAt: text()
		.default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now', 'utc'))`)
		.notNull(),
	deletedAt: text(),
};

export const uniqueIndexSoft = <T extends { deletedAt: AnySQLiteColumn }>(
	name: string,
	table: T,
) => ({
	on: (...columns: [AnySQLiteColumn, ...AnySQLiteColumn[]]) =>
		uniqueIndex(name)
			.on(...columns)
			.where(sql`${table.deletedAt} IS NULL`),
});
