import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/src/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/src/components/ui/card";
import DemoShell from "../../:components/demo-shell";
import {
	activeSession,
	hostDashboardCards,
	hostProfile,
	successGoals,
} from "../../:components/mock";

export const Route = createFileRoute("/demo/host/dashboard/")({
	component: HostDashboardPage,
});

function HostDashboardPage() {
	return (
		<DemoShell
			currentPath="/demo/host/dashboard"
			description="Host control center for creating sessions, tracking active engagements, and monitoring earnings."
			nextPath="/demo/host/create/details"
			persona="Host"
			prevPath="/demo/onboarding"
			title="Host Dashboard"
		>
			<div className="grid gap-3 sm:grid-cols-3">
				{hostDashboardCards.map((card) => (
					<Card key={card.id} size="sm">
						<CardContent className="space-y-1">
							<p className="text-muted-foreground text-xs">{card.label}</p>
							<p className="font-medium text-xl">{card.value}</p>
						</CardContent>
					</Card>
				))}
			</div>

			<div className="grid gap-3 xl:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>{hostProfile.name}</CardTitle>
						<CardDescription>{hostProfile.role}</CardDescription>
					</CardHeader>
					<CardContent className="space-y-2 text-sm">
						<p>Session in focus: {activeSession.topic}</p>
						<p>Session code: {activeSession.code}</p>
						<div className="flex flex-wrap gap-2">
							<Badge variant="secondary">{activeSession.platform}</Badge>
							<Badge variant="secondary">{activeSession.amountUsdc} USDC</Badge>
							<Badge variant="outline">{activeSession.status}</Badge>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Current Session Goals</CardTitle>
						<CardDescription>
							Weighted criteria used for judging
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-2 text-sm">
						{successGoals.map((goal) => (
							<div
								className="rounded-lg border border-border p-2"
								key={goal.id}
							>
								<p>{goal.description}</p>
								<p className="text-muted-foreground text-xs">
									Weight: {goal.weight} / 5
								</p>
							</div>
						))}
					</CardContent>
				</Card>
			</div>
		</DemoShell>
	);
}
