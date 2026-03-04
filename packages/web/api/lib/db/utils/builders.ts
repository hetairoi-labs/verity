import type { SQL } from "drizzle-orm";
import { and, eq, isNull } from "drizzle-orm";
import type { AnySQLiteColumn } from "drizzle-orm/sqlite-core";
import type { SchemaTable } from "../schema";

export interface FilterConfig {
	filters?: Record<string, unknown>;
	table: SchemaTable;
}

export const isActive = (t: SchemaTable) => isNull(t.deletedAt);

export function buildWhere(configs: FilterConfig[], customSQL?: SQL) {
	const conditions: SQL[] = [];
	for (const { table, filters } of configs) {
		for (const [key, val] of Object.entries(filters ?? {})) {
			if (val != null && key in table) {
				const col = (table as unknown as Record<string, AnySQLiteColumn>)[key];
				if (col) {
					conditions.push(eq(col, val));
				}
			}
		}
	}
	if (customSQL) {
		conditions.push(customSQL);
	}
	if (conditions.length === 0) {
		return undefined;
	}
	return conditions.length === 1 ? conditions[0] : and(...conditions);
}

export function buildWhereActive(configs: FilterConfig[], customSQL?: SQL) {
	const base = buildWhere(configs, customSQL);
	const conditions: SQL[] = base ? [base] : [];
	for (const { table } of configs) {
		conditions.push(isActive(table));
	}
	return and(...conditions);
}

export function buildUpdateData<T extends Record<string, unknown>>(
	input: T
): Partial<T> {
	const values: Partial<T> = {};

	for (const [key, value] of Object.entries(input)) {
		if (value != null) {
			values[key as keyof T] = value as T[keyof T];
		}
	}

	return values;
}
