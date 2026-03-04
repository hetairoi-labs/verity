import {
	safe as baseSafe,
	safeAsync as baseSafeAsync,
	type Result,
} from "@/lib/utils/safe";
import { ErrorHandler } from "./handler";

export const safe = <T>(fn: () => T): Result<T> => {
	const result = baseSafe(fn);
	if (result[1]) {
		ErrorHandler.getInstance().handleError(result[1]);
	}
	return result;
};

export const safeAsync = async <T>(
	fn: (() => Promise<T>) | Promise<T>
): Promise<Result<T>> => {
	const result = await baseSafeAsync(fn);
	if (result[1]) {
		ErrorHandler.getInstance().handleError(result[1]);
	}
	return result;
};
