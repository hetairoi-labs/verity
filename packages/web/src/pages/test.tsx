import { TestCard } from "@/src/components/custom/test-card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { useApi } from "@/src/lib/hooks/use-api";
import { useTimeWs } from "@/src/lib/hooks/use-ws";
import Layout from "./layout";

export function TestPage() {
	const { meet, createBot } = useApi();
	const { data: wsTimeData, send: wsSend, isConnected } = useTimeWs();

	return (
		<Layout className="flex flex-col items-center min-h-screen p-8">
			<h1 className="text-2xl lg:text-4xl mb-8 text-center">API Tests</h1>

			<div className="flex flex-col items-center gap-8 min-w-full">
				{/* Meeting API Test */}
				<TestCard
					title="Meeting API"
					description="Create a test meeting"
					data={meet.data?.event.hangoutLink}
				>
					<Button
						className="w-full"
						onClick={() => meet.mutate({ summary: "Test Meeting" })}
						disabled={meet.isPending}
					>
						{meet.isPending ? "Creating..." : "Create Meeting"}
					</Button>
				</TestCard>

				{/* Create Bot API Test */}
				<TestCard
					title="Create Bot API"
					description="Create a bot for a meeting"
					data={createBot.data}
				>
					<form
						className="flex gap-2"
						onSubmit={(e) => {
							e.preventDefault();
							const meetingUrl = e.target.meetingUrl.value.trim();
							if (meetingUrl) {
								createBot.mutate({ meetingUrl });
								e.target.reset();
							}
						}}
					>
						<Input
							name="meetingUrl"
							type="url"
							placeholder="Enter meeting URL"
							required
						/>
						<Button
							className="w-fit"
							type="submit"
							disabled={createBot.isPending}
						>
							{createBot.isPending ? "Creating..." : "Create Bot"}
						</Button>
					</form>
				</TestCard>

				{/* WebSocket Test */}
				<TestCard
					title={`WebSocket Test ${!isConnected ? "(Connecting...)" : ""}`}
					description="Test WebSocket connection and messaging"
					data={wsTimeData}
				>
					<form
						className="flex gap-2"
						onSubmit={(e) => {
							e.preventDefault();
							const msg = e.target.message.value.trim();
							if (msg) {
								wsSend(msg);
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
			</div>
		</Layout>
	);
}
