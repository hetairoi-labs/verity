import { TestCard } from "@/src/components/custom/test-card";
import { Button } from "@/src/components/ui/button";
import { useGetToken } from "@/src/lib/hooks/api/use-api";

export function GetToken() {
	const { data, isPending, error, refetch } = useGetToken();
	return (
		<TestCard
			title="Get Token"
			description="Fetch Gemini ephemeral token"
			data={error ? (error as Error).message : (data ?? null)}
		>
			<Button className="w-full" onClick={() => refetch()} disabled={isPending}>
				{isPending ? "Fetching..." : "Fetch Token"}
			</Button>
		</TestCard>
	);
}
