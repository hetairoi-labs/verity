import { getAccessToken } from "@privy-io/react-auth";
import { hc } from "hono/client";
import type { MeetType } from "@/api/routes/meet.route";
import type { UsersType } from "@/api/routes/users.route";
import type { WsType } from "@/api/routes/ws.routes";

const baseUrl = `${process.env.PUBLIC_APP_URL}/api/v1`;

const token = await getAccessToken();
const client = {
	meet: hc<MeetType>(`${baseUrl}/meet`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	}),
	ws: hc<WsType>(`${baseUrl}/ws`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	}),
	users: hc<UsersType>(`${baseUrl}/users`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	}),
};

export default client;
