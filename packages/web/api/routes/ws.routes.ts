import { Hono } from "hono";
import { upgradeWebSocket } from "hono/bun";
import { respond } from "../lib/utils/hono/respond";

const wsRouter = new Hono()
	.get("/", (c) => {
		return respond.ok(c, 200, "WebSocket is running", {});
	})
	.get(
		"/time",
		upgradeWebSocket((c) => {
			const logger = c.get("logger");

			return {
				onOpen(_event, ws) {
					logger.info("websocket.time.opened");
					ws.send(new Date().toString());
				},
				onMessage(event, ws) {
					ws.send(`Echo: ${event.data}`);
				},
				onClose() {
					logger.info("websocket.time.closed");
				},
			};
		}),
	);

export default wsRouter;
export type WsType = typeof wsRouter;
