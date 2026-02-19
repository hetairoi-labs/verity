import { eq, inArray } from "drizzle-orm";
import type { AnySQLiteColumn, SQLiteTable } from "drizzle-orm/sqlite-core";
import type { DrizzleDb } from "../index";

type Tx = Parameters<Parameters<DrizzleDb["transaction"]>[0]>[0];
type SoftDeletableTable = SQLiteTable & {
	id: AnySQLiteColumn;
	deletedAt: AnySQLiteColumn;
};

interface ChildConfig<TId, TChildId = number> {
	table: SoftDeletableTable;
	foreignKeyField: AnySQLiteColumn & { _: { data: TId } };
	children?: ChildConfig<TChildId>[];
}

const setDeleted =
	(now: Date) =>
	<T extends SoftDeletableTable>(
		tx: Tx,
		table: T,
		where: ReturnType<typeof eq>,
	) =>
		tx
			.update(table)
			.set({ deletedAt: now } as { deletedAt: Date })
			.where(where);

async function deleteChildren<TId>(
	tx: Tx,
	now: Date,
	parentId: TId,
	children: ChildConfig<TId, number>[],
) {
	const del = setDeleted(now);
	for (const child of children) {
		if (child.children?.length) {
			const rows = await tx
				.select({ id: child.table.id })
				.from(child.table)
				.where(eq(child.foreignKeyField, parentId));
			const ids = rows.map((r) => r.id) as number[];
			if (ids.length) {
				for (const id of ids) await deleteChildren(tx, now, id, child.children);
				await del(tx, child.table, inArray(child.table.id, ids));
			}
			continue;
		}
		await del(tx, child.table, eq(child.foreignKeyField, parentId));
	}
}

export const softCascade = async <
	TTable extends SoftDeletableTable,
	TId = TTable["id"]["_"]["data"],
>(
	db: DrizzleDb,
	parentTable: TTable,
	parentId: TId,
	children: ChildConfig<TId, number>[] = [],
) =>
	db.transaction(async (tx) => {
		const now = new Date();
		await deleteChildren(tx, now, parentId, children);
		await setDeleted(now)(tx, parentTable, eq(parentTable.id, parentId));
		return { success: true, deletedAt: now };
	});
