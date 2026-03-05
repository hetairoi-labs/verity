import { useEffect, useRef, useState } from "react";
import { client } from "../utils/hc";

export function useTimeWs() {
	const socketRef = useRef<WebSocket | null>(null);
	const [data, setData] = useState<string[]>([]);
	const [isConnected, setIsConnected] = useState(false);

	useEffect(() => {
		const ws = client.ws.time.$ws(0);
		socketRef.current = ws;

		ws.onopen = () => {
			console.log("WS opened");
			setIsConnected(true);
		};
		ws.onmessage = (e) => setData([e.data]);
		ws.onclose = () => setIsConnected(false);
		ws.onerror = (err) => console.error("WS Error:", err);

		return () => ws.close();
	}, []);

	const send = (message: string) => socketRef.current?.send(message);

	return {
		data,
		send,
		isConnected,
	};
}
