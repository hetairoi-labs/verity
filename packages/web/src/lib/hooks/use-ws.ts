import { useEffect, useState } from "react";
import client from "../utils/api-client";

export function useWs() {
	const [data, setData] = useState<string[]>([]);

	useEffect(() => {
		const socket = client.ws.time.$ws(0);

		socket.onopen = () => {
			console.log("WebSocket opened at", socket.url);
		};

		socket.onmessage = (event) => {
			setData([event.data]);
		};

		socket.onerror = (err: Event) => console.error("WS Error:", err);

		return () => {
			socket.close();
		};
	}, []);

	return {
		time: {
			data,
		},
	};
}
