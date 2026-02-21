import { sql } from "drizzle-orm";
import type { AnySQLiteColumn } from "drizzle-orm/sqlite-core";
import { text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const isoNow = () => new Date().toISOString();

export const timestamps = {
	updatedAt: text("updated_at"),
	createdAt: text("created_at").notNull().$defaultFn(isoNow),
	deletedAt: text("deleted_at"),
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
