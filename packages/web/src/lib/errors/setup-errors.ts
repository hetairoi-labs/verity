import { DetailedError } from "hono/client";
import { toast } from "sonner";
import type { ErrorResponse } from "@/api/lib/utils/hono/respond";
import type { ZodErrorDetails } from "@/api/lib/utils/zod";
import { ErrorHandler } from "./error-handler";

export type ApiClientErrorResponse = ErrorResponse & {
	zod?: { summary: string; details: Record<string, string[] | undefined> };
};

export function parseApiError(err: unknown): ApiClientErrorResponse {
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

export function parseErrorMessage(error: Error): string {
	const apiError = parseApiError(error);

	if (apiError.zod?.summary) {
		return apiError.zod.summary;
	}

	if (apiError.message && apiError.message !== error.message) {
		return apiError.message;
	}

	return error.message;
}

export function setupErrorHandling() {
	const handler = ErrorHandler.getInstance();

	window.addEventListener("unhandledrejection", (e) => {
		console.log("[Global Handler] Caught unhandled rejection:", e.reason);
		e.preventDefault();
		handler.handleError(e.reason);
	});

	window.addEventListener("error", (e) => {
		console.log("[Global Handler] Caught runtime error:", e.error);
		handler.handleError(e.error || e.message);
	});

	handler.onError((err) => {
		console.error("[Global Handler] Processing error:", err);
		const msg = parseErrorMessage(err);
		toast.error(msg);
	});
}
