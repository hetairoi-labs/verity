import { DetailedError } from "hono/client";
import type { ErrorResponse } from "@/api/lib/utils/hono/respond";
import type { ZodErrorDetails } from "@/api/lib/utils/zod";

export type ParsedError = ErrorResponse & {
	zod?: { summary: string; details: Record<string, string[] | undefined> };
};

export function parseError(err: unknown): ParsedError {
	if (!(err instanceof DetailedError)) {
		const msg = err instanceof Error ? err.message : String(err ?? "");
		return { message: msg };
	}

	const { message, error } = err.detail.data as ErrorResponse;

	if (message === "Zod") {
		const zod = error as ZodErrorDetails | undefined;
		const summary = zod?.summary ?? "";
		return {
			message: summary || message,
			zod: {
				summary,
				details: zod?.details ?? {},
			},
		};
	}

	return {
		message: message || (err instanceof Error ? err.message : ""),
		error,
	};
}
