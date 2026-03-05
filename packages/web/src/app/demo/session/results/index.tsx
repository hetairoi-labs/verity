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
import { Progress, ProgressLabel } from "@/src/components/ui/progress";
import DemoShell from "../../:components/demo-shell";
import { evaluationBreakdown, settlement } from "../../:components/mock";

export const Route = createFileRoute("/demo/session/results/")({
	component: SessionResultsPage,
});

function SessionResultsPage() {
	return (
		<DemoShell
			currentPath="/demo/session/results"
			description="Final outcome screen with score breakdown, payout split, claim actions, and dispute window."
			persona="Shared"
			prevPath="/demo/session/evaluating"
			title="Session Results + Settlement"
		>
			<div className="grid gap-3 xl:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Evaluation Breakdown</CardTitle>
						<CardDescription>
							Overall Score: {settlement.overallScore}%
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3">
						{evaluationBreakdown.map((item) => (
							<Progress key={item.id} value={item.score}>
								<ProgressLabel>{item.label}</ProgressLabel>
								<p className="ml-auto text-muted-foreground text-sm">
									{item.score}%
								</p>
							</Progress>
						))}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Settlement</CardTitle>
						<CardDescription>{settlement.formula}</CardDescription>
					</CardHeader>
					<CardContent className="space-y-2 text-sm">
						<p>Session Amount: {settlement.sessionAmount} USDC</p>
						<p>Teacher Payout: {settlement.teacherPayout} USDC</p>
						<p>Learner Refund: {settlement.learnerRefund} USDC</p>
						<p>Confidence: {settlement.confidence}%</p>
						<p>Learning: {settlement.learning}%</p>
						<div className="flex flex-wrap gap-2">
							<Badge variant="secondary">Dispute window: 24h</Badge>
							<Badge variant="outline">On-chain report posted</Badge>
						</div>
						<div className="grid gap-2 pt-2 sm:grid-cols-2">
							<Button>Claim as Host</Button>
							<Button variant="outline">Claim as Learner</Button>
							<Button className="sm:col-span-2" variant="ghost">
								Open Dispute
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</DemoShell>
	);
}
