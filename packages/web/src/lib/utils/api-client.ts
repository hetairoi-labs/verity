import { hc } from "hono/client";
import type { MeetType } from "@/api/routes/meet.route";

const baseUrl = process.env.PUBLIC_SERVER_URL;

const client = {
	meet: hc<MeetType>(`${baseUrl}/meet`),
};

export default client;
