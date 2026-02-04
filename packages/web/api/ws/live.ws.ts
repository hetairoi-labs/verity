import { Hono } from "hono";
import { upgradeWebSocket } from "hono/bun";

const liveRouter = new Hono().get(
	"/ws",
	upgradeWebSocket(() => {
		let intervalId: NodeJS.Timeout;
		return {
			onOpen(_event, ws) {
				intervalId = setInterval(() => {
					ws.send(new Date().toString());
				}, 200);
			},
			onClose() {
				clearInterval(intervalId);
			},
		};
	}),
);

export default liveRouter;
export type LiveRouterType = typeof liveRouter;
