import { captureException } from "@sentry/react";

export class ErrorHandler {
	private static instance: ErrorHandler;
	private callbacks: Array<(error: Error) => void> = [];

	static getInstance(): ErrorHandler {
		if (!ErrorHandler.instance) {
			ErrorHandler.instance = new ErrorHandler();
		}
		return ErrorHandler.instance;
	}

	onError(callback: (error: Error) => void) {
		this.callbacks.push(callback);
	}

	handleError(error: unknown) {
		const normalizedError =
			error instanceof Error ? error : new Error(String(error));

		captureException(normalizedError);
		this.callbacks.forEach((callback) => {
			try {
				callback(normalizedError);
			} catch (e) {
				console.error("Error in error callback:", e);
			}
		});

		return normalizedError;
	}
}
