import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { DashboardShell } from "@/src/app/_authenticated/dashboard/:components/dashboard-shell";
import { Panel } from "@/src/app/_authenticated/dashboard/:components/panel";
import { Button } from "@/src/components/ui/button";
import { useGetAllSessionsQuery } from "@/src/lib/hooks/api/use-sessions-api";
import { CreateListingModal } from "./:components/create-listing-modal";
import { ListingCard } from "./:components/listing-card";

const LISTINGS_PAGE_LIMIT = 10;

export const Route = createFileRoute("/_authenticated/listings/")({
	component: ListingsPage,
});

function ListingsPage() {
	const [page, setPage] = useState(1);

	const { data, isLoading } = useGetAllSessionsQuery({
		page: String(page),
		limit: String(LISTINGS_PAGE_LIMIT),
	});

	const filteredListings = useMemo(() => {
		return data ?? [];
	}, [data]);

	return (
		<DashboardShell
			description="Browse all live listings with API pagination and client-side search."
			title="Browse Listings"
		>
			<Panel className="space-y-4">
				<div className="flex items-center justify-between">
					<p className="text-muted-foreground text-sm">
						Here are some popular listings for you!
					</p>
					<CreateListingModal />
				</div>

				{isLoading ? (
					<p className="text-muted-foreground">Loading listings...</p>
				) : null}

				<div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
					{filteredListings.map((listing) => (
						<Link
							key={listing.id}
							params={{ id: String(listing.id) }}
							to="/dashboard/session/$id"
						>
							<ListingCard listingId={listing.id} />
						</Link>
					))}
					{!isLoading && filteredListings.length === 0 ? (
						<p className="text-muted-foreground text-sm">No listings found.</p>
					) : null}
				</div>

				<div className="flex items-center justify-end gap-2">
					<Button
						disabled={page <= 1}
						onClick={() => setPage((current) => Math.max(1, current - 1))}
						variant="outline"
					>
						<CaretLeftIcon />
					</Button>
					<p className="p-2 text-muted-foreground text-sm">{page}</p>
					<Button
						disabled={(data?.length ?? 0) < LISTINGS_PAGE_LIMIT}
						onClick={() => setPage((current) => current + 1)}
						variant="outline"
					>
						<CaretRightIcon />
					</Button>
				</div>
			</Panel>
		</DashboardShell>
	);
}
