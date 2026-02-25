import * as Sentry from "@sentry/react";
import type { AnyRouter } from "@tanstack/react-router";

export function initSentry(router: AnyRouter) {
	Sentry.init({
		dsn: process.env.PUBLIC_SENTRY_DSN,
		release: process.env.PUBLIC_RELEASE,
		sendDefaultPii: true,
		environment: process.env.NODE_ENV || "development",
		integrations: [Sentry.tanstackRouterBrowserTracingIntegration(router)],
		tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
		beforeSend(event) {
			return event?.exception?.values?.[0]?.stacktrace?.frames?.some((f) =>
				f.filename?.includes("extension"),
			)
				? null
				: event;
		},
	});
}

export const rootOptions = {
	onUncaughtError: Sentry.reactErrorHandler(),
	onCaughtError: Sentry.reactErrorHandler(),
	onRecoverableError: Sentry.reactErrorHandler(),
};
