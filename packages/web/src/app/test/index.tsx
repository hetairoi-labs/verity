import { createFileRoute } from "@tanstack/react-router";
import { CreateEvent } from "./:components/create-event";
import { GetBot } from "./:components/get-bot";
import { GetToken } from "./:components/get-token";
import { GetTranscript } from "./:components/get-transcript";
import { WebSocketTest } from "./:components/websocket";

function TestPage() {
	return (
		<div className="flex flex-col items-center min-h-screen p-8">
			<h1 className="mb-8 text-center">API</h1>

			<div className="flex flex-col items-center gap-8 min-w-full">
				<CreateEvent />
				<GetToken />
				<GetBot />
				<GetTranscript />
				<WebSocketTest />
			</div>
		</div>
	);
}

export const Route = createFileRoute("/test/")({
	component: TestPage,
});
