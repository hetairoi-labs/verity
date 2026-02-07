import { hc } from "hono/client";
import type { MeetType } from "@/api/routes/meet.route";
import type { WsType } from "@/api/routes/ws.routes";

const httpUrl = `http://${process.env.PUBLIC_SERVER_URL}`;
const wsUrl = `http://${process.env.PUBLIC_SERVER_URL}/ws`;

const client = {
	meet: hc<MeetType>(`${httpUrl}/meet`),
	ws: hc<WsType>(`${wsUrl}`),
};

export default client;
