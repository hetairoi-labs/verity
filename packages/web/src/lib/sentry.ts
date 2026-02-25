import * as Sentry from "@sentry/react";
import type { AnyRouter } from "@tanstack/react-router";

const DSN = process.env.PUBLIC_SENTRY_DSN;

export function initSentry(router: AnyRouter) {
	if (!DSN) return;
	Sentry.init({
		dsn: DSN,
		release: process.env.PUBLIC_RELEASE,
		sendDefaultPii: true,
		environment: process.env.NODE_ENV || "development",
		integrations: [Sentry.tanstackRouterBrowserTracingIntegration(router)],
		tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
	});
}

export const rootOptions = {
	onUncaughtError: Sentry.reactErrorHandler(),
	onCaughtError: Sentry.reactErrorHandler(),
	onRecoverableError: Sentry.reactErrorHandler(),
};
