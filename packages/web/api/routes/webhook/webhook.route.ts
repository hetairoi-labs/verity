import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { respond } from "@/api/lib/utils/respond";
import { recallWebhookSchema } from "./webhook.schema";

const webhookRoute = new Hono().post(
	"/recall",
	zValidator("json", recallWebhookSchema),
	async (c) => {
		try {
			const payload = c.req.valid("json");
			console.log("Webhook payload:", payload);
			return respond.ok(c, {}, "Webhook processed successfully", 200);
		} catch (error) {
			console.error(error);
			return respond.err(
				c,
				"Internal Server Error: Failed to process webhook",
				500,
			);
		}
	},
);

export default webhookRoute;
export type WebhookType = typeof webhookRoute;
