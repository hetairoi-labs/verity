import { Hono } from "hono";
import { upgradeWebSocket } from "hono/bun";
import { processAudioChunk } from "../lib/utils/bot";
import { respond } from "../lib/utils/hono/respond";

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
				onMessage(event, ws) {
					console.log("Server: Received message:", event.data);
					ws.send(`Echo: ${event.data}`);
				},
				onClose() {
					console.log("Server: WebSocket closed");
					clearInterval(intervalId);
				},
			};
		}),
	)
	.get(
		"/stream",
		upgradeWebSocket(() => {
			return {
				onOpen(_event) {
					console.log("Recall: Bot connected to stream");
				},
				onMessage(event) {
					if (typeof event.data === "string") {
						try {
							const metadata = JSON.parse(event.data);
							console.log("Recall Metadata:", metadata);
						} catch (_) {
							console.log("Received non-JSON string:", event.data);
						}
						return;
					}

					if (event.data instanceof Uint8Array) {
						const audioBuffer = event.data;
						processAudioChunk(audioBuffer);
					}
				},
				onClose() {
					console.log("Recall: Bot disconnected from stream");
				},
				onError(err) {
					console.error("Recall Error:", err);
				},
			};
		}),
	);

export default wsRouter;
export type WsType = typeof wsRouter;
