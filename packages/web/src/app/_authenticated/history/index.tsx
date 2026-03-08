import { CaretRightIcon } from "@phosphor-icons/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardShell } from "@/src/app/_authenticated/dashboard/:components/dashboard-shell";
import { Panel } from "@/src/app/_authenticated/dashboard/:components/panel";
import cardImage from "@/src/assets/card.webp";
import { Pagination } from "@/src/components/ui/pagination";
import { useGetSessionHistoryQuery } from "@/src/lib/hooks/api/use-sessions-api";

const HISTORY_PAGE_LIMIT = 10;

export const Route = createFileRoute("/_authenticated/history/")({
	component: HistoryPage,
});

function HistoryPage() {
	const [page, setPage] = useState(1);
	const { data: sessions, isLoading } = useGetSessionHistoryQuery({
		page: String(page),
		limit: String(HISTORY_PAGE_LIMIT),
	});

	const list = sessions ?? [];

	return (
		<DashboardShell
			description="Sessions where you are enrolled as a learner/participant."
			title="History"
		>
			<Panel className="space-y-4">
				<div className="flex items-center justify-between">
					<p className="text-muted-foreground text-sm">
						Sessions you’re enrolled in.
					</p>
				</div>

				{isLoading ? (
					<p className="text-muted-foreground">Loading history...</p>
				) : null}

				<div className="grid gap-3">
					{list.map((session) => (
						<Link
							key={session.id}
							params={{ id: String(session.id) }}
							to="/listings/$id"
						>
							<div className="flex items-center justify-between gap-4 rounded-xl border border-border/60 p-4 transition-colors hover:bg-secondary/30">
								<div className="relative size-16 shrink-0 overflow-hidden rounded-lg">
									<img
										alt={session.title ?? ""}
										className="size-full object-cover"
										height={64}
										src={cardImage}
										width={64}
									/>
								</div>
								<div className="min-w-0 flex-1 space-y-0.5">
									<p className="truncate font-medium">{session.title}</p>
									<p className="truncate text-muted-foreground text-sm">
										{session.topic}
									</p>
								</div>
								<span className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-border/70 bg-background/60 px-2.5 py-1.5 text-muted-foreground text-sm">
									Open
									<CaretRightIcon size={16} />
								</span>
							</div>
						</Link>
					))}
				</div>

				{!isLoading && list.length === 0 ? (
					<p className="text-muted-foreground text-sm">
						No enrolled sessions yet.
					</p>
				) : null}

				<Pagination
					currentPage={page}
					hasNext={list.length >= HISTORY_PAGE_LIMIT}
					hasPrev={page > 1}
					onPageChange={setPage}
				/>
			</Panel>
		</DashboardShell>
	);
}
