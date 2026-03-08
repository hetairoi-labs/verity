import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { DashboardShell } from "@/src/app/_authenticated/dashboard/:components/dashboard-shell";
import { Panel } from "@/src/app/_authenticated/dashboard/:components/panel";
import { Pagination } from "@/src/components/ui/pagination";
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
							to="/listings/$id"
						>
							<ListingCard listingId={listing.id} />
						</Link>
					))}
					{!isLoading && filteredListings.length === 0 ? (
						<p className="text-muted-foreground text-sm">No listings found.</p>
					) : null}
				</div>

				<Pagination
					currentPage={page}
					hasNext={(data?.length ?? 0) >= LISTINGS_PAGE_LIMIT}
					hasPrev={page > 1}
					onPageChange={setPage}
				/>
			</Panel>
		</DashboardShell>
	);
}
