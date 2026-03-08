import { useState } from "react";
import { TestCard } from "@/src/components/custom/test-card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { useRequestSessionRegistrationAndEnroll } from "@/src/lib/hooks/actions/use-session-actions";

const SAMPLE_MEETING_DATA = {
	summary: "Verity Session",
	attendees: ["ishtails@gmail.com"],
};

export function RequestMeeting() {
	const [index, setIndex] = useState<number | undefined>(undefined);
	const requestMeeting = useRequestSessionRegistrationAndEnroll();

	const handleSubmit = () => {
		if (!index) {
			return;
		}

		requestMeeting.execute({
			sessionId: index,
			summary: SAMPLE_MEETING_DATA.summary,
			attendees: SAMPLE_MEETING_DATA.attendees,
		});
	};

	return (
		<TestCard
			data={JSON.stringify(
				{
					sessionId: index,
				},
				null,
				2
			)}
			description="Request a meeting"
			title="Request Meeting"
		>
			<Input
				onChange={(e) => setIndex(Number(e.target.value))}
				placeholder="Session Id"
			/>
			<Button
				className="w-full"
				disabled={requestMeeting.isPending}
				onClick={handleSubmit}
			>
				{requestMeeting.isPending ? "Requesting..." : "Request Meeting"}
			</Button>
		</TestCard>
	);
}
