import { createFileRoute, Link } from "@tanstack/react-router";
import { DashboardShell } from "@/src/app/dashboard/:components/dashboard-shell";
import { Panel } from "@/src/app/dashboard/:components/panel";
import { Button } from "@/src/components/ui/button";
import {
	useGetDashboardMetricsQuery,
	useGetHostSessionsQuery,
} from "@/src/lib/hooks/api/use-sessions-api";

export const Route = createFileRoute("/dashboard/")({
	component: DashboardPage,
});

function DashboardPage() {
	const { data: metrics, isLoading: isMetricsLoading } =
		useGetDashboardMetricsQuery();
	const { data: sessions, isLoading: isSessionsLoading } =
		useGetHostSessionsQuery({
			page: 1,
			limit: 20,
		});

	return (
		<DashboardShell
			description="Manage hosted listings and sessions with live API metrics."
			title="Host Dashboard"
		>
			<section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<MetricCard label="Total Listings" value={metrics?.totalListings} />
				<MetricCard label="Meetings Scheduled" value={metrics?.totalMeetings} />
				<MetricCard
					label="Earnings Potential"
					value={metrics?.totalEarningsUSDC?.toFixed(2)}
				/>
				<MetricCard
					label="Average Listing Price"
					value={metrics?.averagePriceUSDC?.toFixed(2)}
				/>
			</section>

			<Panel className="space-y-3">
				<div className="flex items-center justify-between">
					<h2 className="text-lg">Hosted Listings</h2>
					<Link to="/listings/create">
						<Button size="sm">Create</Button>
					</Link>
				</div>
				{isMetricsLoading || isSessionsLoading ? (
					<p className="text-muted-foreground">Loading dashboard...</p>
				) : null}
				{(sessions ?? []).map((session) => (
					<div
						className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/70 bg-card/40 p-3"
						key={session.id}
					>
						<div>
							<p>{session.title}</p>
							<p className="text-muted-foreground text-sm">{session.topic}</p>
						</div>
						<Link
							params={{ id: String(session.id) }}
							to="/dashboard/session/$id"
						>
							<Button size="sm" variant="outline">
								Manage
							</Button>
						</Link>
					</div>
				))}
				{!isSessionsLoading && (sessions?.length ?? 0) === 0 ? (
					<p className="text-muted-foreground text-sm">
						No hosted listings yet.
					</p>
				) : null}
			</Panel>
		</DashboardShell>
	);
}

function MetricCard({
	label,
	value,
}: {
	label: string;
	value?: number | string;
}) {
	return (
		<Panel className="py-8">
			<p className="text-muted-foreground text-sm">{label}</p>
			<p className="mt-2 text-3xl">{value ?? "-"}</p>
		</Panel>
	);
}
