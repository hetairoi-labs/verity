import type { AnyRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { initSentry, rootOptions } from "@/src/lib/sentry";
import { ErrorHandler } from "./handler";
import { parseError } from "./parse";

export function setupErrorListener({ router }: { router: AnyRouter }) {
	initSentry(router);
	const handler = ErrorHandler.getInstance();

	window.addEventListener("unhandledrejection", (e) => {
		console.log("[ERROR] Caught unhandled rejection:", e.reason);
		e.preventDefault();
		handler.handleError(e.reason);
	});

	window.addEventListener("error", (e) => {
		console.log("[ERROR] Caught runtime error:", e.error);
		handler.handleError(e.error || e.message);
	});

	handler.onError((err) => {
		const parsed = parseError(err);
		console.error("[ERROR] Processing error:", parsed);
		toast.error(parsed.message);
	});
}

export const errorRootOptions = {
	...rootOptions,
};
