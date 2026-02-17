import { Hono } from "hono";
import { respond } from "@/api/lib/utils/hono/respond";
import { recallWebhookSchema } from "../lib/types/webhook.types";
import { logger } from "../lib/utils/pino";
import { validator } from "../lib/utils/zod";

const webhookRoute = new Hono().post(
	"/recall",
	validator("json", recallWebhookSchema),
	async (c) => {
		const payload = c.req.valid("json");

		logger.info(
			{
				event: payload.event,
				data: payload.data,
			},
			"webhook.recall.received",
		);

		return respond.ok(c, 200, "Webhook processed successfully", {});
	},
);

export default webhookRoute;
export type WebhookType = typeof webhookRoute;
