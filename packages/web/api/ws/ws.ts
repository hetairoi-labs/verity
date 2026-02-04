import { Hono } from "hono";
import live from "./live.ws";

const ws = new Hono().route("/live", live);

export default ws;
