import { PlusIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/src/components/ui/dialog";
import { useAddListing } from "@/src/lib/hooks/actions/use-session-actions";
import { useListingDraftStore } from "@/src/lib/store/use-listing-draft-store";
import { ListingForm } from "./listing-form";

export function CreateListingModal() {
	const [open, setOpen] = useState(false);
	const addListing = useAddListing();
	const { resetDraft } = useListingDraftStore();

	async function handleSubmit(value: Parameters<typeof addListing.execute>[0]) {
		await addListing.execute(value);
		resetDraft();
		setOpen(false);
	}

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger>
				<Button size="lg" variant="default">
					<PlusIcon /> Create new listing
				</Button>
			</DialogTrigger>
			<DialogContent
				className="max-h-[90vh] overflow-y-auto sm:max-w-lg"
				showCloseButton
			>
				<DialogHeader>
					<DialogTitle>New Listing</DialogTitle>
					<DialogDescription>
						This runs upload → contract createListing → API createSession with
						one lifecycle toast.
					</DialogDescription>
				</DialogHeader>
				<ListingForm
					isPending={addListing.isPending}
					onSubmit={handleSubmit}
					submitLabel={addListing.isPending ? "Creating..." : "Create listing"}
				/>
			</DialogContent>
		</Dialog>
	);
}
