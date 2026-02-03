import { hc } from "hono/client";
import type { GoogleType } from "@/api/routes/google.route";

const baseUrl = process.env.PUBLIC_SERVER_URL;

const client = {
	google: hc<GoogleType>(`${baseUrl}/google`),
};

export default client;
