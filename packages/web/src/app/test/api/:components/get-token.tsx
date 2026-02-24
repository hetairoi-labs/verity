import { useState } from "react";
import { TestCard } from "@/src/components/custom/test-card";
import { Button } from "@/src/components/ui/button";
import { useGetLiveTokenQuery } from "@/src/lib/hooks/api/use-ai-api";

export function GetToken() {
	const [enabled, setEnabled] = useState(false);
	const { data, isFetching, refetch } = useGetLiveTokenQuery(enabled);

	return (
		<TestCard
			title="Get Token"
			description="Fetch Gemini ephemeral token"
			data={data}
		>
			<Button
				className="w-full"
				onClick={() => {
					if (enabled) {
						refetch();
					} else {
						setEnabled(true);
					}
				}}
				disabled={isFetching}
			>
				{isFetching ? "Fetching..." : "Fetch Token"}
			</Button>
		</TestCard>
	);
}
