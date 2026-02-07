import { Hono } from "hono";
import meet from "./meet.route";
import ws from "./ws.routes";

const routes = new Hono().route("/ws", ws).route("/meet", meet);

export default routes;
