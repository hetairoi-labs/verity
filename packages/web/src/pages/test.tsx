import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { useApi } from "@/src/lib/hooks/use-api";
import { useTimeWs } from "@/src/lib/hooks/use-ws";
import Layout from "./layout";

export function TestPage() {
	const { meet, createBot } = useApi();
	const { data, send, isConnected } = useTimeWs();

	return (
		<Layout className="flex flex-col items-center justify-center h-screen p-8">
			<h1 className="text-4xl lg:text-6xl mb-8">API Tests</h1>

			{/* Meeting API Test */}
			<div className="w-full max-w-md mb-8">
				<h2 className="text-xl font-semibold mb-4">Meeting API</h2>
				<Button
					className="w-full"
					onClick={() => meet.mutate({ summary: "Test Meeting" })}
					disabled={meet.isPending}
				>
					{meet.isPending ? "Creating..." : "Create Meeting"}
				</Button>
				{meet?.data?.event && (
					<p className="mt-2 text-sm">
						<a
							href={meet.data.event.hangoutLink ?? ""}
							target="_blank"
							rel="noopener noreferrer"
							className="text-cyan-500 underline"
						>
							{meet.data.event.hangoutLink}
						</a>
					</p>
				)}
			</div>

			{/* Create Bot API Test */}
			<div className="w-full max-w-md mb-8">
				<h2 className="text-xl font-semibold mb-4">Create Bot API</h2>
				<form
					className="flex gap-2 mb-4"
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
				{createBot.isSuccess && (
					<p className="text-sm text-green-600">Bot created successfully!</p>
				)}
				{createBot.isError && (
					<p className="text-sm text-red-600">
						Error: {(createBot.error as Error)?.message}
					</p>
				)}
			</div>

			{/* WebSocket Test */}
			<div className="w-full max-w-md">
				<h2 className="text-xl font-semibold mb-4">
					WebSocket Test {!isConnected && "(Connecting...)"}
				</h2>
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

				<div className="mt-4">
					<h3 className="text-sm font-medium mb-2">Messages:</h3>
					<div className="text-xs space-y-1 max-h-32 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-2 rounded">
						{data.length === 0 ? (
							<p className="text-muted-foreground">No messages yet</p>
						) : (
							data.map((msg, i) => (
								<p key={`${i}-${msg}`} className="font-mono">
									{msg}
								</p>
							))
						)}
					</div>
				</div>
			</div>
		</Layout>
	);
}
