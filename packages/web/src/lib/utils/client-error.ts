import { DetailedError } from "hono/client";
import type { ErrorResponse } from "@/api/lib/utils/hono/respond";
import type { ZodErrorDetails } from "@/api/lib/utils/zod";

export type ApiClientErrorResponse = ErrorResponse & {
	zod?: { summary: string; details: Record<string, string[] | undefined> };
};

export function getApiError(err: unknown): ApiClientErrorResponse {
	if (!(err instanceof DetailedError)) {
		return { message: err instanceof Error ? err.message : "" };
	}

	const { message, error } = err.detail.data as ErrorResponse;

	if (message === "Zod") {
		const zod = error as ZodErrorDetails | undefined;
		return {
			message,
			zod: {
				summary: zod?.summary ?? "",
				details: zod?.details ?? {},
			},
		};
	}

	return { message, error };
}
