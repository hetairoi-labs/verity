import { ListingForm } from "@/src/app/_authenticated/listings/:components/listing-form";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/src/components/ui/dialog";
import { useUpdateListing } from "@/src/lib/hooks/actions/use-session-actions";
import type { GetSessionByIdResponse } from "@/src/lib/hooks/api/use-sessions-api";
import { formatUSDC } from "@/src/lib/utils/usdc";

interface UpdateListingModalProps {
	onOpenChange: (open: boolean) => void;
	open: boolean;
	session: GetSessionByIdResponse | undefined;
	sessionId: number;
}

export function UpdateListingModal({
	open,
	onOpenChange,
	session,
	sessionId,
}: UpdateListingModalProps) {
	const updateListing = useUpdateListing();

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Update Listing</DialogTitle>
					<DialogDescription>
						Submit updateListing on-chain, then update API session data.
					</DialogDescription>
				</DialogHeader>
				<ListingForm
					defaultValues={{
						title: session?.title ?? "",
						email: session?.email ?? "",
						topic: session?.topic ?? "",
						description: session?.description ?? "",
						price: session?.price ? formatUSDC(BigInt(session.price)) : "1",
						goals: session?.goals?.map((g) => g.name) ?? [],
					}}
					isPending={updateListing.isPending}
					onSubmit={async (value) => {
						await updateListing.execute(sessionId, value);
						onOpenChange(false);
					}}
					submitLabel={
						updateListing.isPending ? "Updating..." : "Update listing"
					}
				/>
			</DialogContent>
		</Dialog>
	);
}
