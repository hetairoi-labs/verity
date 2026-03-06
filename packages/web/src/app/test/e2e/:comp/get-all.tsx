import { TestCard } from "@/src/components/custom/test-card";
import { useGetAllSessionsQuery } from "@/src/lib/hooks/api/use-sessions-api";

export function GetAllListings() {
	const allSessions = useGetAllSessionsQuery();

	return (
		<TestCard
			data={JSON.stringify(allSessions.data, null, 2)}
			description="Get all listings"
			title="Get All Listings"
		/>
	);
}
