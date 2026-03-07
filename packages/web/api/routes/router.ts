import { Hono } from "hono";
import ai from "./ai.route";
import evm from "./evm.route";
import goals from "./goals.route";
import meetings from "./meetings.route";
import recall from "./recall.route";
import sessions from "./sessions.route";
import uploads from "./uploads.route";
import users from "./users.route";
import ws from "./ws.routes";

const routes = new Hono()
	.route("/ws", ws)
	.route("/ai", ai)
	.route("/sessions", sessions)
	.route("/sessions/meetings", meetings)
	.route("/sessions/goals", goals)
	.route("/recall", recall)
	.route("/uploads", uploads)
	.route("/users", users)
	.route("/evm", evm);

export default routes;
export type ApiRoutesType = typeof routes;
