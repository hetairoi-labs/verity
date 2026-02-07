import { Hono } from "hono";
import { upgradeWebSocket } from "hono/bun";
import { respond } from "../lib/utils/respond";

const wsRouter = new Hono()
	.get("/", (c) => {
		return respond.ok(c, {}, "WebSocket is running", 200);
	})
	.get(
		"/time",
		upgradeWebSocket(() => {
			let intervalId: NodeJS.Timeout;
			return {
				onOpen(_event, ws) {
					console.log("Server: WebSocket opened");
					intervalId = setInterval(() => {
						ws.send(new Date().toString());
					}, 200);
				},
				onClose() {
					console.log("Server: WebSocket closed");
					clearInterval(intervalId);
				},
			};
		}),
	);

export default wsRouter;
export type WsType = typeof wsRouter;
