import { isNotNull, isNull, sql } from "drizzle-orm";
import {
	index,
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
		id: text("id").primaryKey(),
		address: text("address").$type<ZHexAddress>(),
		name: text("name"),
		...timestamps,
	},
	(table) => [
		index("users_address_idx").on(table.address),
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
