import { Hono } from "hono";
import ai from "./ai.route";
import goals from "./goals.route";
import meetings from "./meetings.route";
import recall from "./recall.route";
import sessions from "./sessions.route";
import users from "./users.route";
import ws from "./ws.routes";

const routes = new Hono()
	.route("/ws", ws)
	.route("/sessions", sessions)
	.route("/sessions/meetings", meetings)
	.route("/sessions/goals", goals)
	.route("/ai", ai)
	.route("/recall", recall)
	.route("/users", users);

export default routes;
export type ApiRoutesType = typeof routes;
