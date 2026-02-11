import { useState } from "react";
import { TestCard } from "@/src/components/custom/test-card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { useGetTranscript } from "@/src/lib/hooks/api/use-api";

export function GetTranscript() {
	const [transcriptUrl, setTranscriptUrl] = useState("");
	const { data, isPending, error } = useGetTranscript(transcriptUrl);

	return (
		<TestCard
			title="Get Transcript"
			description="Download transcript by URL"
			data={error ? (error as Error).message : (data ?? null)}
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
					type="url"
					placeholder="Enter transcript URL"
					name="transcriptUrl"
				/>
				<Button className="w-full" type="submit" disabled={isPending}>
					{isPending ? "Fetching..." : "Fetch Transcript"}
				</Button>
			</form>
		</TestCard>
	);
}
