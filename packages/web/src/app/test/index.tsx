import { createFileRoute } from "@tanstack/react-router";
import { CreateBot } from "./:components/create-bot";
import { CreateMeet } from "./:components/create-meet";
import { GetBot } from "./:components/get-bot";
import { GetToken } from "./:components/get-token";
import { GetTranscript } from "./:components/get-transcript";
import { WebSocketTest } from "./:components/websocket";

function TestPage() {
	return (
		<div className="flex flex-col items-center min-h-screen p-8">
			<h1 className="text-2xl lg:text-4xl mb-8 text-center">API Tests</h1>

			<div className="flex flex-col items-center gap-8 min-w-full">
				<CreateMeet />
				<CreateBot />
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
