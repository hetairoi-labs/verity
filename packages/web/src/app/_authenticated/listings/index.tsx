import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { DashboardShell } from "@/src/app/_authenticated/dashboard/:components/dashboard-shell";
import { Panel } from "@/src/app/_authenticated/dashboard/:components/panel";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { useGetAllSessionsQuery } from "@/src/lib/hooks/api/use-sessions-api";
import { formatUSDC } from "@/src/lib/utils/usdc";

const LISTINGS_PAGE_LIMIT = 10;

export const Route = createFileRoute("/_authenticated/listings/")({
	component: ListingsPage,
});

function ListingsPage() {
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState("");
	const { data, isLoading } = useGetAllSessionsQuery({
		page: String(page),
		limit: String(LISTINGS_PAGE_LIMIT),
	});

	const filteredListings = useMemo(() => {
		const searchQuery = search.trim().toLowerCase();
		if (!searchQuery) {
			return data ?? [];
		}
		return (data ?? []).filter((listing) => {
			return (
				listing.title.toLowerCase().includes(searchQuery) ||
				listing.topic.toLowerCase().includes(searchQuery)
			);
		});
	}, [data, search]);

	return (
		<DashboardShell
			description="Browse all live listings with API pagination and client-side search."
			title="Browse Listings"
		>
			<Panel className="space-y-4">
				<div className="flex flex-col gap-2 md:flex-row">
					<Input
						onChange={(event) => setSearch(event.target.value)}
						placeholder="Search by title or topic"
						value={search}
					/>
					<Link to="/listings/create">
						<Button className="w-full md:w-fit">Create Listing</Button>
					</Link>
				</div>

				{isLoading ? (
					<p className="text-muted-foreground">Loading listings...</p>
				) : null}

				<div className="space-y-3">
					{filteredListings.map((listing) => (
						<div
							className="rounded-xl border border-border/70 bg-card/40 p-4"
							key={listing.id}
						>
							<div className="flex flex-wrap items-start justify-between gap-3">
								<div>
									<p className="text-lg">{listing.title}</p>
									<p className="text-muted-foreground text-sm">
										{listing.topic}
									</p>
									<p className="mt-1 text-muted-foreground text-xs">
										Price: {formatUSDC(BigInt(listing.price))} USDC
									</p>
								</div>
								<Link
									params={{ id: String(listing.id) }}
									to="/dashboard/session/$id"
								>
									<Button size="sm" variant="outline">
										Open
									</Button>
								</Link>
							</div>
						</div>
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
						Previous
					</Button>
					<p className="text-muted-foreground text-sm">Page {page}</p>
					<Button
						disabled={(data?.length ?? 0) < LISTINGS_PAGE_LIMIT}
						onClick={() => setPage((current) => current + 1)}
						variant="outline"
					>
						Next
					</Button>
				</div>
			</Panel>
		</DashboardShell>
	);
}
