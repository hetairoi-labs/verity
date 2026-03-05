import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/src/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/src/components/ui/card";
import { Progress, ProgressLabel } from "@/src/components/ui/progress";
import DemoShell from "../../:components/demo-shell";

export const Route = createFileRoute("/demo/session/evaluating/")({
	component: SessionEvaluatingPage,
});

function SessionEvaluatingPage() {
	return (
		<DemoShell
			currentPath="/demo/session/evaluating"
			description="Post-call autonomous judging phase with processing status."
			nextPath="/demo/session/results"
			persona="Shared"
			prevPath="/demo/session/live"
			title="Evaluation In Progress"
		>
			<div className="grid gap-3 xl:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>AI Processing</CardTitle>
						<CardDescription>
							Estimated completion under 5 minutes
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4 text-sm">
						<Progress value={72}>
							<ProgressLabel>Judging pipeline</ProgressLabel>
							<p className="ml-auto text-muted-foreground text-sm">72%</p>
						</Progress>
						<div className="flex flex-wrap gap-2">
							<Badge variant="secondary">Transcript parsed</Badge>
							<Badge variant="secondary">Goal matching</Badge>
							<Badge variant="outline">Settlement pending</Badge>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Pipeline Steps</CardTitle>
						<CardDescription>Visibility for both parties</CardDescription>
					</CardHeader>
					<CardContent className="space-y-2 text-sm">
						<p>1. Pull transcript + metadata</p>
						<p>2. Score by weighted goals</p>
						<p>3. Compute confidence + learning</p>
						<p>4. Prepare teacher payout + learner refund</p>
						<p>5. Publish report on-chain</p>
					</CardContent>
				</Card>
			</div>
		</DemoShell>
	);
}
