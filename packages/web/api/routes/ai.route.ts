import { Hono } from "hono";
import { streamText } from "hono/streaming";
import { respond } from "@/api/lib/utils/hono/respond";
import {
	fastChat,
	fastChatParamsSchema,
	fastText,
	fastTextInputSchema,
} from "../handlers/ai";
import { getGeminiEphemeralToken } from "../lib/utils/gemini";
import { validator } from "../lib/utils/zod";

const aiRoute = new Hono()
	.get("/live/token", async (c) => {
		const token = await getGeminiEphemeralToken();
		return respond.ok(c, 200, "Ephemeral token for KEX Live", {
			token: token.name,
		});
	})
	.post("/text/fast", validator("json", fastTextInputSchema), async (c) => {
		const json = c.req.valid("json");
		const stream = await fastText(json);

		return streamText(c, async (s) => {
			for await (const chunk of stream) {
				s.write(chunk);
			}
		});
	})
	.post("/chat/fast", validator("json", fastChatParamsSchema), async (c) => {
		const json = c.req.valid("json");
		const stream = await fastChat(json);

		return streamText(c, async (s) => {
			for await (const chunk of stream) {
				s.write(chunk);
			}
		});
	});

export default aiRoute;
export type AiType = typeof aiRoute;
