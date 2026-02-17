import { Hono } from "hono";
import { upgradeWebSocket } from "hono/bun";
import { respond } from "../lib/utils/hono/respond";
import { safe } from "../lib/utils/safe";

const wsRouter = new Hono()
	.get("/", (c) => {
		return respond.ok(c, 200, "WebSocket is running", {});
	})
	.get(
		"/time",
		upgradeWebSocket(() => {
			let intervalId: NodeJS.Timeout;
			return {
				onOpen(_event, ws) {
					console.log("Server: WebSocket opened");
					intervalId = setInterval(() => {
						safe(() => ws.send(new Date().toString()));
					}, 200);
				},
				onMessage(event, ws) {
					console.log("Server: Received message:", event.data);
					safe(() => ws.send(`Echo: ${event.data}`));
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
