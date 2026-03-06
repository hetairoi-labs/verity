import { Hono } from "hono";
import { respond } from "@/api/lib/utils/hono/respond";
import { env } from "@/lib/utils/env";
import { safeAsync } from "@/lib/utils/safe";
import {
	handleTranscriptDone,
	handleTranscriptFailed,
} from "../handlers/webhooks";
import { recallWebhookSchema } from "../lib/types/webhook.types";
import { logger } from "../lib/utils/pino";
import { verifyRecallWebhook } from "../lib/utils/recall/verify";

const recallRoute = new Hono().post("/webhooks", async (c) => {
	const rawBody = await c.req.text();
	const secret = env.RECALL_WEBHOOK_SECRET;

	verifyRecallWebhook({
		secret,
		headers: c.req.raw.headers,
		payload: rawBody,
	});

	const payload = recallWebhookSchema.parse(JSON.parse(rawBody));
	const { event } = payload;

	safeAsync(async () => {
		logger.info(
			{ event: payload.event, data: payload.data },
			"webhook.recall.received"
		);

		if (event === "transcript.done") {
			await handleTranscriptDone(payload);
		} else if (event === "transcript.failed") {
			await handleTranscriptFailed(payload);
		}
	}).then(([, error]) => {
		if (error) {
			logger.error(error, "webhook.processing.error");
		}
	});

	return respond.ok(c, 200, "Webhook processed successfully");
});

export default recallRoute;
export type RecallType = typeof recallRoute;
