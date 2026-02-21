import { Hono } from "hono";
import { createMeeting, createMeetingInputSchema } from "../handlers/meetings";
import { requireAuth } from "../lib/middleware/auth";
import { respond } from "../lib/utils/hono/respond";
import { validator } from "../lib/utils/zod";

const meetingsRoute = new Hono()
	.use(requireAuth)
	.post("/meeting", validator("json", createMeetingInputSchema), async (c) => {
		const result = await createMeeting(c.var.user.user_id, c.req.valid("json"));
		return respond.ok(c, 201, "Meeting created successfully", { ...result });
	});

export default meetingsRoute;
export type MeetingsType = typeof meetingsRoute;
