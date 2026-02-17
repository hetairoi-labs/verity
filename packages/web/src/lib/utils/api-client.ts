import { hc } from "hono/client";
import type { MeetType } from "@/api/routes/meet.route";
import type { UsersType } from "@/api/routes/users.route";
import type { WsType } from "@/api/routes/ws.routes";

const baseUrl = `${process.env.PUBLIC_APP_URL}/api/v1`;

const client = {
	meet: hc<MeetType>(`${baseUrl}/meet`),
	ws: hc<WsType>(`${baseUrl}/ws`),
	users: hc<UsersType>(`${baseUrl}/users`),
};

export default client;
