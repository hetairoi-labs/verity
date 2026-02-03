import { Hono } from "hono";
import google from "./google.route";

const routes = new Hono().route("/google", google);

export default routes;
