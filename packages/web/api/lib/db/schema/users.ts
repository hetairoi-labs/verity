import { isNull } from "drizzle-orm";
import {
	index,
	integer,
	sqliteTable,
	sqliteView,
	text,
} from "drizzle-orm/sqlite-core";
import type { ZHexAddress } from "../../utils/zod";
import { timestamps, uniqueIndexSoft } from "../utils";

export const users = sqliteTable("users", {
	id: text().primaryKey(),
	name: text().default(""),
	...timestamps,
});

export const linkedAccounts = sqliteTable(
	"linked_accounts",
	{
		address: text().$type<ZHexAddress>().primaryKey(),
		userId: text()
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		method: text().notNull(),
		isPrimary: integer({ mode: "boolean" }).default(false),
		...timestamps,
	},
	(table) => [
		index("linked_accounts_user_id_idx").on(table.userId),
		index("linked_accounts_address_idx").on(table.address),
		uniqueIndexSoft("linked_accounts_address_unique", table).on(table.address),
	],
);

export const activeUsers = sqliteView("active_users").as((qb) =>
	qb.select().from(users).where(isNull(users.deletedAt)),
);

export const activeLinkedAccounts = sqliteView("active_linked_accounts").as(
	(qb) =>
		qb.select().from(linkedAccounts).where(isNull(linkedAccounts.deletedAt)),
);
