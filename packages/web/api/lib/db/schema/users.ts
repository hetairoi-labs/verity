import { isNotNull, isNull, sql } from "drizzle-orm";
import {
	integer,
	sqliteTable,
	sqliteView,
	text,
	uniqueIndex,
} from "drizzle-orm/sqlite-core";
import type { ZHexAddress } from "../../utils/zod";
import { timestamps } from "../timestamps";

export const users = sqliteTable(
	"users",
	{
		id: integer().primaryKey({
			autoIncrement: true,
		}),
		address: text().$type<ZHexAddress>(),
		name: text(),
		...timestamps,
	},
	(table) => [
		uniqueIndex("unique_active_address")
			.on(table.address)
			.where(sql`${table.deletedAt} IS NULL`),
	],
);

export const activeUsers = sqliteView("active_users").as((qb) =>
	qb.select().from(users).where(isNull(users.deletedAt)),
);

export const deletedUsers = sqliteView("deleted_users").as((qb) =>
	qb.select().from(users).where(isNotNull(users.deletedAt)),
);
