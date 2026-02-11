import { TestCard } from "@/src/components/custom/test-card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { useApi } from "@/src/lib/hooks/api/use-api";

export function CreateBot() {
	const { createBot } = useApi();
	return (
		<TestCard
			title="Bot API"
			description="Create a test meeting"
			data={createBot.data ? createBot.data.bot.id : null}
		>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					const meetingUrl = e.target.meetingUrl.value;
					meetingUrl && createBot.mutate({ meetingUrl });
				}}
				className="flex flex-col gap-4"
			>
				<Input type="url" placeholder="Enter meeting URL" name="meetingUrl" />
				<Button className="w-full" type="submit" disabled={createBot.isPending}>
					{createBot.isPending ? "Creating..." : "Create Bot"}
				</Button>
			</form>
		</TestCard>
	);
}
