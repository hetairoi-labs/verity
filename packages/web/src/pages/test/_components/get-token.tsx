import { TestCard } from "@/src/components/custom/test-card";
import { Button } from "@/src/components/ui/button";
import { useApi } from "@/src/lib/hooks/api/use-api";

export function GetToken() {
	const { data, isPending, refetch } = useApi().getToken;
	return (
		<TestCard
			title="Get Token"
			description="Fetch Gemini ephemeral token"
			data={data}
		>
			<Button className="w-full" onClick={() => refetch()} disabled={isPending}>
				{isPending ? "Fetching..." : "Fetch Token"}
			</Button>
		</TestCard>
	);
}
