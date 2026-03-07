import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardShell } from "@/src/app/dashboard/:components/dashboard-shell";
import { Panel } from "@/src/app/dashboard/:components/panel";
import { Button } from "@/src/components/ui/button";
import { useGetSessionHistoryQuery } from "@/src/lib/hooks/api/use-sessions-api";

const HISTORY_PAGE_LIMIT = 10;

export const Route = createFileRoute("/history/")({
	component: HistoryPage,
});

function HistoryPage() {
	const [page, setPage] = useState(1);
	const { data: sessions, isLoading } = useGetSessionHistoryQuery({
		page: String(page),
		limit: String(HISTORY_PAGE_LIMIT),
	});

	return (
		<DashboardShell
			description="Sessions where you are enrolled as a learner/participant."
			title="History"
		>
			<Panel className="space-y-3">
				{isLoading ? (
					<p className="text-muted-foreground">Loading history...</p>
				) : null}
				{(sessions ?? []).map((session) => (
					<div
						className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/70 bg-card/40 p-3"
						key={session.id}
					>
						<div>
							<p>{session.title}</p>
							<p className="text-muted-foreground text-sm">{session.topic}</p>
							<p className="text-muted-foreground text-xs">
								Payout/Refund tracked on-chain
							</p>
						</div>
						<Link
							params={{ id: String(session.id) }}
							to="/dashboard/session/$id"
						>
							<Button size="sm" variant="outline">
								Open Session
							</Button>
						</Link>
					</div>
				))}
				{!isLoading && (sessions?.length ?? 0) === 0 ? (
					<p className="text-muted-foreground text-sm">
						No enrolled sessions yet.
					</p>
				) : null}

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
						disabled={(sessions?.length ?? 0) < HISTORY_PAGE_LIMIT}
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
