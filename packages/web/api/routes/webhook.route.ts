import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { respond } from "@/api/lib/utils/hono/respond";
import { recallWebhookSchema } from "../lib/types/webhook.types";

const webhookRoute = new Hono().post(
	"/recall",
	zValidator("json", recallWebhookSchema),
	async (c) => {
		const payload = c.req.valid("json");
		console.log("[RECALL WEBHOOK]:", payload);
		return respond.ok(c, 200, "Webhook processed successfully", {});
	},
);

export default webhookRoute;
export type WebhookType = typeof webhookRoute;
