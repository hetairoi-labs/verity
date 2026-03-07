import { Hono } from "hono";
import { faucetInputSchema, requestFaucet } from "../handlers/evm";
import { requireAuth } from "../lib/middleware/auth";
import { respond } from "../lib/utils/hono/respond";
import { validator } from "../lib/utils/zod";

export default new Hono()
	.use(requireAuth)
	.post("/faucet", validator("json", faucetInputSchema), async (c) => {
		const json = c.req.valid("json");
		const faucetResponse = await requestFaucet(json);
		return respond.ok(c, 200, "Faucet successful", faucetResponse);
	});
