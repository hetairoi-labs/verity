import { safeAsync } from "@/lib/utils/safe";
import { ApiError } from "./hono/error";

export async function safeQuery<T>(dbQuery: Promise<T>): Promise<T> {
	const [data, error] = await safeAsync(dbQuery);
	if (error) throw new ApiError(500, error.message, { error });
	return data;
}
