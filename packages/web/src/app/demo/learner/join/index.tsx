import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import DemoShell from "../../:components/demo-shell";
import {
	activeSession,
	hostProfile,
	successGoals,
} from "../../:components/mock";

export const Route = createFileRoute("/demo/learner/join/")({
	component: LearnerJoinPage,
});

function LearnerJoinPage() {
	return (
		<DemoShell
			currentPath="/demo/learner/join"
			description="Learner enters session code, reviews terms, and funds escrow."
			nextPath="/demo/learner/dashboard"
			persona="Learner"
			prevPath="/demo/host/create/share"
			title="Join Session"
		>
			<div className="grid gap-3 xl:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Join by Session Code</CardTitle>
						<CardDescription>Learner entry point</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3">
						<div className="space-y-1">
							<Label htmlFor="join-code">Session Code</Label>
							<Input defaultValue={activeSession.code} id="join-code" />
						</div>
						<Button className="w-full" variant="outline">
							Review Session Terms
						</Button>
						<Button className="w-full">Approve and Fund Escrow</Button>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>{activeSession.topic}</CardTitle>
						<CardDescription>
							Host: {hostProfile.name} ({hostProfile.meritScore} merit)
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-2 text-sm">
						<p>Price: {activeSession.amountUsdc} USDC</p>
						<p>Duration: {activeSession.durationMinutes} minutes</p>
						<div className="space-y-1">
							{successGoals.map((goal) => (
								<p key={goal.id}>• {goal.description}</p>
							))}
						</div>
						<Badge variant="secondary">Escrow required before join</Badge>
					</CardContent>
				</Card>
			</div>
		</DemoShell>
	);
}
