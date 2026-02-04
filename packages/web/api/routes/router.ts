import { Hono } from "hono";
import meet from "./meet.route";

const routes = new Hono().route("/meet", meet);

export default routes;
