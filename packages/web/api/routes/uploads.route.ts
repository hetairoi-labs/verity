import { Hono } from "hono";
import {
	createJsonPresignedUrl,
	createJsonPresignedUrlInputSchema,
} from "../handlers/uploads";
import { requireAuth } from "../lib/middleware/auth";
import { respond } from "../lib/utils/hono/respond";
import { validator } from "../lib/utils/zod";

const uploadsRoute = new Hono()
	.use(requireAuth)
	.post(
		"/presigned-json",
		validator("json", createJsonPresignedUrlInputSchema),
		async (c) => {
			const upload = await createJsonPresignedUrl(c.req.valid("json"));
			return respond.ok(c, 200, "Presigned URL created successfully", upload);
		}
	);

export default uploadsRoute;
export type UploadsType = typeof uploadsRoute;
