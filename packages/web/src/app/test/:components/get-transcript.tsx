import { useState } from "react";
import { TestCard } from "@/src/components/custom/test-card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { useApi } from "@/src/lib/hooks/api/use-api";

export function GetTranscript() {
	const [transcriptUrl, setTranscriptUrl] = useState<string | undefined>();
	const api = useApi();
	const { data, error } = api.meet.getTranscript({
		transcriptUrl: transcriptUrl ? transcriptUrl : "",
	});

	return (
		<TestCard
			title="Get Transcript"
			description="Get transcript by URL"
			data={data ? JSON.stringify(data, null, 2) : null}
			error={error ? JSON.stringify(error, null, 2) : null}
		>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					const url = (e.target as HTMLFormElement).transcriptUrl.value.trim();
					url && setTranscriptUrl(url);
				}}
				className="flex flex-col gap-4"
			>
				<Input
					type="text"
					placeholder="Enter transcript URL"
					name="transcriptUrl"
					required
				/>
				<Button className="w-full" type="submit">
					Fetch Transcript
				</Button>
			</form>
		</TestCard>
	);
}
