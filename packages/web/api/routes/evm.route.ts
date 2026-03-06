import { Hono } from "hono";
import { safeAsync } from "@/lib/utils/safe";
import { upsertListing, upsertListingInputSchema } from "../handlers/evm";
import { requireAuth } from "../lib/middleware/auth";
import { respond } from "../lib/utils/hono/respond";
import { logger } from "../lib/utils/pino";
import { validator } from "../lib/utils/zod";

const evmRoute = new Hono()
	.use(requireAuth)
	.post("/listing/upsert", validator("json", upsertListingInputSchema), (c) => {
		safeAsync(async () => {
			await upsertListing(c.req.valid("json"), c.var.user.user_id);
		}).then(([, error]) => {
			if (error) {
				logger.error(error, "evm.session.upsert.error");
			}
		});
		return respond.ok(c, 200, "Upsert queued successfully");
	});

export default evmRoute;
export type EvmType = typeof evmRoute;
