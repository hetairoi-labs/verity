import { createFileRoute } from "@tanstack/react-router";
import { AddListing } from "./:comp/add-listing";
import { GetAllListings } from "./:comp/get-all";

export const Route = createFileRoute("/test/e2e/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex min-h-screen flex-col items-center p-8">
			<h1 className="mb-8 text-center text-4xl">E2E Tests</h1>

			<div className="flex min-w-full flex-col items-center gap-8">
				<AddListing />
				<GetAllListings />
			</div>
		</div>
	);
}
