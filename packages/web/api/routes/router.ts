import { Hono } from "hono";
import gemini from "./gemini.route";
import recall from "./recall.route";
import sessions from "./sessions.route";
import users from "./users.route";
import ws from "./ws.routes";

const routes = new Hono()
	.route("/ws", ws)
	.route("/sessions", sessions)
	.route("/gemini", gemini)
	.route("/recall", recall)
	.route("/users", users);

export default routes;
export type ApiRoutesType = typeof routes;
