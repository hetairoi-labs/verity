import { TestCard } from "@/src/components/custom/test-card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { useTimeWs } from "@/src/lib/hooks/use-ws";

export function WebSocketTest() {
	const { isConnected, data, send } = useTimeWs();
	return (
		<TestCard
			title={`WebSocket Test ${!isConnected ? "(Connecting...)" : ""}`}
			description="Test WebSocket connection and messaging"
			data={data.length > 0 ? JSON.stringify(data, null, 2) : null}
		>
			<form
				className="flex gap-2"
				onSubmit={(e) => {
					e.preventDefault();
					const msg = e.target.message.value.trim();
					if (msg) {
						send(msg);
						e.target.reset();
					}
				}}
			>
				<Input name="message" type="text" placeholder="Send message" />
				<Button className="w-fit" type="submit" disabled={!isConnected}>
					Send
				</Button>
			</form>
		</TestCard>
	);
}
