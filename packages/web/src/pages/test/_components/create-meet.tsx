import { TestCard } from "@/src/components/custom/test-card";
import { Button } from "@/src/components/ui/button";
import { useApi } from "@/src/lib/hooks/api/use-api";

export function CreateMeet() {
	const { createMeet } = useApi();
	return (
		<TestCard
			title="Meeting API"
			description="Create a test meeting"
			data={createMeet.data ? createMeet.data.event.hangoutLink : null}
		>
			<Button
				className="w-full"
				onClick={() => createMeet.mutate({ summary: "Test Meeting" })}
				disabled={createMeet.isPending}
			>
				{createMeet.isPending ? "Creating..." : "Create Meeting"}
			</Button>
		</TestCard>
	);
}
