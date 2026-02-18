import { Hono } from "hono";
import courses from "./courses/course.route";
import meet from "./meet.route";
import users from "./users.route";
import webhook from "./webhook.route";
import ws from "./ws.routes";

const routes = new Hono()
	.route("/ws", ws)
	.route("/meet", meet)
	.route("/webhook", webhook)
	.route("/users", users)
	.route("/courses", courses);

export default routes;
export type RoutesType = typeof routes;
