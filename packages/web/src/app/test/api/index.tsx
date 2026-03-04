import { createFileRoute } from "@tanstack/react-router";
import { GetToken } from "./:components/get-token";
import { WebSocketTest } from "./:components/websocket";

function TestPage() {
	return (
		<div className="flex min-h-screen flex-col items-center p-8">
			<h1 className="mb-8 text-center">API</h1>

			<div className="flex min-w-full flex-col items-center gap-8">
				<GetToken />
				<WebSocketTest />
			</div>
		</div>
	);
}

export const Route = createFileRoute("/test/api/")({
	component: TestPage,
});
