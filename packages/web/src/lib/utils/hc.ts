import { hc } from "hono/client";
import type { ApiRoutesType } from "@/api/routes/router";

const baseUrl = `${process.env.PUBLIC_APP_URL}/api/v1`;
const client = hc<ApiRoutesType>(baseUrl);

const getAuthHeaders = (token: string) => ({
	headers: {
		Authorization: `Bearer ${token}`,
	},
});

export { client, getAuthHeaders };
