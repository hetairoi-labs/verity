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
	learnerDashboardCards,
	learnerProfile,
} from "../../:components/mock";

export const Route = createFileRoute("/test/demo/learner/dashboard/")({
	component: LearnerDashboardPage,
});

function LearnerDashboardPage() {
	return (
		<DemoShell
			currentPath="/demo/learner/dashboard"
			description="Learner workspace for active sessions, refunds, and outcomes."
			nextPath="/demo/session/live"
			persona="Learner"
			prevPath="/demo/learner/join"
			title="Learner Dashboard"
		>
			<div className="grid gap-3 sm:grid-cols-3">
				{learnerDashboardCards.map((card) => (
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
						<CardTitle>{learnerProfile.name}</CardTitle>
						<CardDescription>{learnerProfile.target}</CardDescription>
					</CardHeader>
					<CardContent className="space-y-2 text-sm">
						<p>Wallet: {learnerProfile.wallet}</p>
						<p>Current session: {activeSession.topic}</p>
						<Badge variant="outline">Ready to join live room</Badge>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>My Session</CardTitle>
						<CardDescription>Escrow funded</CardDescription>
					</CardHeader>
					<CardContent className="space-y-2 text-sm">
						<p>Code: {activeSession.code}</p>
						<p>Platform: {activeSession.platform}</p>
						<p>Fee Locked: {activeSession.amountUsdc} USDC</p>
						<Badge variant="secondary">Status: funded</Badge>
					</CardContent>
				</Card>
			</div>
		</DemoShell>
	);
}
