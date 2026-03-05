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
import DemoShell from "../../:components/demo-shell";
import { activeSession } from "../../:components/mock";

export const Route = createFileRoute("/demo/session/live/")({
	component: SessionLivePage,
});

function SessionLivePage() {
	return (
		<DemoShell
			currentPath="/demo/session/live"
			description="Shared in-call view with live timer, witness status, and controls."
			nextPath="/demo/session/evaluating"
			persona="Shared"
			prevPath="/demo/learner/dashboard"
			title="Session Active"
		>
			<div className="grid gap-3 xl:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>{activeSession.topic}</CardTitle>
						<CardDescription>Live session state</CardDescription>
					</CardHeader>
					<CardContent className="space-y-2 text-sm">
						<p>Timer: 00:32:14</p>
						<p>Participants: 2 + witness bot</p>
						<div className="flex flex-wrap gap-2">
							<Badge variant="secondary">Bot Connected</Badge>
							<Badge variant="secondary">Transcript Live</Badge>
							<Badge variant="outline">Escrow Locked</Badge>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Quick Actions</CardTitle>
						<CardDescription>Host and learner controls</CardDescription>
					</CardHeader>
					<CardContent className="space-y-2">
						<Button className="w-full" variant="outline">
							Mark Milestone
						</Button>
						<Button className="w-full" variant="outline">
							Open Goal Checklist
						</Button>
						<Button className="w-full">End Session</Button>
					</CardContent>
				</Card>
			</div>
		</DemoShell>
	);
}
