import { Hono } from "hono";
import gemini from "./gemini.route";
import meet from "./meet.route";
import recall from "./recall.route";
import sessions from "./session.route";
import users from "./users.route";
import ws from "./ws.routes";

const routes = new Hono()
	.route("/ws", ws)
	.route("/meet", meet)
	.route("/gemini", gemini)
	.route("/recall", recall)
	.route("/users", users)
	.route("/sessions", sessions);

export default routes;
export type ApiRoutesType = typeof routes;
