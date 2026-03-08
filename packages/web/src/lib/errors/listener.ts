import { toast } from "sonner";
import { ErrorHandler } from "./handler";
import { parseError } from "./parse";

export function setupErrorListener() {
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
		showToast(parsed.message);
	});
}

const showToast = (message: string) => {
	let processedMsg: string;
	if (message.includes("User rejected the request")) {
		processedMsg = "Wallet connection rejected";
	} else {
		processedMsg = message;
	}
	toast.error(processedMsg);
};
