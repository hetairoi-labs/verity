import { createFileRoute } from "@tanstack/react-router";
import { Loader } from "@/src/components/custom/loading";
import { useEvmContext } from "@/src/lib/context/evm-context";
import { AddListing } from "./:comp/add-listing";
import { ClaimFaucet } from "./:comp/claim-faucet";
import { GetAllListings } from "./:comp/get-all";
import { ReadAll } from "./:comp/read-all";
import { RequestMeeting } from "./:comp/request-meeting";
import { UpdateListing } from "./:comp/update-listing";

export const Route = createFileRoute("/test/e2e/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { contracts } = useEvmContext();

	if (!contracts) {
		return <Loader />;
	}

	return (
		<div className="flex min-h-screen flex-col items-center p-8">
			<h1 className="mb-8 text-center text-4xl">E2E Tests</h1>

			<div className="flex min-w-full flex-col items-center gap-8">
				<GetAllListings />
				<ReadAll contracts={contracts} />
				<AddListing contracts={contracts} />
				<UpdateListing contracts={contracts} />
				<ClaimFaucet />
				<RequestMeeting />
			</div>
		</div>
	);
}
