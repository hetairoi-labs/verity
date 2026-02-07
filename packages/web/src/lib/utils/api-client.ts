import { hc } from "hono/client";
import type { MeetType } from "@/api/routes/meet.route";
import type { WsType } from "@/api/routes/ws.routes";

const baseUrl = process.env.PUBLIC_SERVER_URL;

const client = {
	meet: hc<MeetType>(`${baseUrl}/meet`),
	ws: hc<WsType>(`${baseUrl}/ws`),
};

export default client;
