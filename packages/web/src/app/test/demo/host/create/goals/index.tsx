import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/src/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/src/components/ui/card";
import DemoShell from "../../../:components/demo-shell";
import { successGoals } from "../../../:components/mock";

export const Route = createFileRoute("/test/demo/host/create/goals/")({
	component: HostCreateGoalsPage,
});

function HostCreateGoalsPage() {
	return (
		<DemoShell
			currentPath="/demo/host/create/goals"
			description="Host defines weighted success criteria used for AI merit settlement."
			nextPath="/demo/host/create/share"
			persona="Host"
			prevPath="/demo/host/create/details"
			title="Create Session - Goals"
		>
			<Card>
				<CardHeader>
					<CardTitle>Goal Definition</CardTitle>
					<CardDescription>Step 2 of host setup</CardDescription>
				</CardHeader>
				<CardContent className="space-y-2 text-sm">
					{successGoals.map((goal) => (
						<div
							className="flex items-center justify-between rounded-lg border border-border p-3"
							key={goal.id}
						>
							<div>
								<p>{goal.description}</p>
								<p className="text-muted-foreground text-xs">
									Importance in settlement model
								</p>
							</div>
							<p className="font-medium">{goal.weight} / 5</p>
						</div>
					))}
					<Button className="w-full">Generate Session Code</Button>
				</CardContent>
			</Card>
		</DemoShell>
	);
}
