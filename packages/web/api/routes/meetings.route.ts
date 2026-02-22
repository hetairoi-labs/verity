import { Hono } from "hono";
import {
	createMeeting,
	createMeetingInputSchema,
	deleteMeeting,
	deleteMeetingInputSchema,
	getMeetingById,
	getMeetingByIdInputSchema,
	getSessionMeetings,
	getSessionMeetingsInputSchema,
} from "../handlers/meetings";
import { requireAuth } from "../lib/middleware/auth";
import { respond } from "../lib/utils/hono/respond";
import { validator } from "../lib/utils/zod";

const meetingsRoute = new Hono()
	.use(requireAuth)

	// create meeting
	.post("/", validator("json", createMeetingInputSchema), async (c) => {
		const result = await createMeeting(c.req.valid("json"), c.var.user.user_id);
		return respond.ok(c, 201, "Meeting created successfully", { ...result });
	})

	// get meetings by session
	.get("/all", validator("query", getSessionMeetingsInputSchema), async (c) => {
		const meetings = await getSessionMeetings(c.req.valid("query"));
		return respond.ok(c, 200, "Meetings fetched successfully", { meetings });
	})

	.get("/meeting", validator("query", getMeetingByIdInputSchema), async (c) => {
		const meeting = await getMeetingById(c.req.valid("query"));
		return respond.ok(c, 200, "Meeting fetched successfully", { meeting });
	})

	.delete("/", validator("json", deleteMeetingInputSchema), async (c) => {
		const meeting = await deleteMeeting(c.req.valid("json"));
		return respond.ok(c, 200, "Meeting deleted successfully", { meeting });
	});

export default meetingsRoute;
export type MeetingsType = typeof meetingsRoute;
