import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell } from "@/src/app/_authenticated/dashboard/:components/dashboard-shell";
import { SessionActionPanel } from "@/src/app/_authenticated/dashboard/:components/session-action-panel";
import { ListingForm } from "@/src/app/_authenticated/listings/:components/listing-form";
import { useAddListing } from "@/src/lib/hooks/actions/use-session-actions";

export const Route = createFileRoute("/_authenticated/listings/create/")({
	component: CreateListingPage,
});

function CreateListingPage() {
	const addListing = useAddListing();

	return (
		<DashboardShell
			description="Publish a listing by uploading metadata, writing contract state, and syncing API."
			title="Create Listing"
		>
			<SessionActionPanel
				description="This runs upload -> contract createListing -> API createSession with one lifecycle toast."
				title="New Listing"
			>
				<ListingForm
					isPending={addListing.isPending}
					onSubmit={addListing.execute}
					submitLabel={addListing.isPending ? "Creating..." : "Create listing"}
				/>
			</SessionActionPanel>
		</DashboardShell>
	);
}
