import { Hono } from "hono";
import evm from "./evm.route";
import meetings from "./meetings.route";
import sessions from "./sessions.route";
import uploads from "./uploads.route";
import users from "./users.route";

const routes = new Hono()
	.route("/sessions", sessions)
	.route("/sessions/meetings", meetings)
	.route("/uploads", uploads)
	.route("/users", users)
	.route("/evm", evm);

export default routes;
export type ApiRoutesType = typeof routes;
