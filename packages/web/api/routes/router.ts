import { Hono } from "hono";
import meet from "./meet.route";
import webhook from "./webhook.route";
import ws from "./ws.routes";

const routes = new Hono()
	.route("/ws", ws)
	.route("/meet", meet)
	.route("/webhook", webhook);

export default routes;
export type RoutesType = typeof routes;
