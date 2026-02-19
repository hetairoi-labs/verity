import { Hono } from "hono";
import { respond } from "@/api/lib/utils/hono/respond";
import { getGeminiEphemeralToken } from "../handlers/gemini";

const geminiRoute = new Hono().get("/token", async (c) => {
	const token = await getGeminiEphemeralToken();
	return respond.ok(c, 200, "Gemini token retrieved successfully", {
		token: token.name,
	});
});

export default geminiRoute;
export type GeminiType = typeof geminiRoute;
