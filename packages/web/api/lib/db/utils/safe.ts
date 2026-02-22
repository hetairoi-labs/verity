import { safeAsync } from "@/lib/utils/safe";
import { ApiError } from "../../utils/hono/error";

export async function safeQuery<T>(dbQuery: Promise<T>): Promise<T> {
	const [data, error] = await safeAsync(dbQuery);
	if (error) throw new ApiError(500, error.message, { error });
	return data;
}

export function requireAtLeastOne<T extends Record<string, unknown>>(
	values: T,
	errorMessage = "At least one value must be provided",
): void {
	const hasAtLeastOne = Object.values(values).some((value) => value != null);
	if (!hasAtLeastOne) {
		throw new ApiError(400, errorMessage, { values });
	}
}

export function requireOnlyOne<T extends Record<string, unknown>>(
	values: T,
	errorMessage = "Only one value must be provided",
): void {
	const hasOnlyOne =
		Object.values(values).filter((value) => value != null).length === 1;
	if (!hasOnlyOne) {
		throw new ApiError(400, errorMessage, { values });
	}
}
