import Layout from "../layout";
import { CreateBot } from "./_components/create-bot";
import { CreateMeet } from "./_components/create-meet";
import { GetBot } from "./_components/get-bot";
import { GetToken } from "./_components/get-token";
import { GetTranscript } from "./_components/get-transcript";
import { WebSocketTest } from "./_components/websocket";

export function TestPage() {
	return (
		<Layout className="flex flex-col items-center min-h-screen p-8">
			<h1 className="text-2xl lg:text-4xl mb-8 text-center">API Tests</h1>

			<div className="flex flex-col items-center gap-8 min-w-full">
				<CreateMeet />
				<CreateBot />
				<GetToken />
				<GetBot />
				<GetTranscript />
				<WebSocketTest />
			</div>
		</Layout>
	);
}
