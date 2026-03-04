import { useState } from "react";
import { TestCard } from "@/src/components/custom/test-card";
import { Button } from "@/src/components/ui/button";
import { useGetLiveTokenQuery } from "@/src/lib/hooks/api/use-ai-api";

export function GetToken() {
	const [enabled, setEnabled] = useState(false);
	const { data, isFetching, refetch } = useGetLiveTokenQuery(enabled);

	return (
		<TestCard
			data={data}
			description="Fetch Gemini ephemeral token"
			title="Get Token"
		>
			<Button
				className="w-full"
				disabled={isFetching}
				onClick={() => {
					if (enabled) {
						refetch();
					} else {
						setEnabled(true);
					}
				}}
			>
				{isFetching ? "Fetching..." : "Fetch Token"}
			</Button>
		</TestCard>
	);
}
