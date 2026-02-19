import { TestCard } from "@/src/components/custom/test-card";
import { Button } from "@/src/components/ui/button";
import { useApi } from "@/src/lib/hooks/api/use-api";

export function CreateEvent() {
	const api = useApi();
	const createEvent = api.meet.createEvent();
	return (
		<TestCard
			title="Meeting API"
			description="Create a test meeting"
			data={createEvent.data ? createEvent.data.event.hangoutLink : null}
		>
			<Button
				className="w-full"
				onClick={() => createEvent.mutate({ summary: "Test Meeting" })}
				disabled={createEvent.isPending}
			>
				{createEvent.isPending ? "Creating..." : "Create Meeting"}
			</Button>
		</TestCard>
	);
}
