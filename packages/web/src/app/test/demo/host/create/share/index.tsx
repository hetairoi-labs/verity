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
import DemoShell from "../../../:components/demo-shell";
import { activeSession } from "../../../:components/mock";

export const Route = createFileRoute("/test/demo/host/create/share/")({
	component: HostCreateSharePage,
});

function HostCreateSharePage() {
	return (
		<DemoShell
			currentPath="/demo/host/create/share"
			description="Host gets session code + meeting link to share with learner."
			nextPath="/demo/learner/join"
			persona="Host"
			prevPath="/demo/host/create/goals"
			title="Create Session - Share"
		>
			<div className="grid gap-3 xl:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Share Pack</CardTitle>
						<CardDescription>Step 3 of host setup</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3 text-sm">
						<div className="space-y-1">
							<Label htmlFor="session-code">Session Code</Label>
							<Input
								defaultValue={activeSession.code}
								id="session-code"
								readOnly
							/>
						</div>
						<div className="space-y-1">
							<Label htmlFor="meeting-url">Meeting URL</Label>
							<Input
								defaultValue={activeSession.meetingUrl}
								id="meeting-url"
								readOnly
							/>
						</div>
						<Button className="w-full">Copy Invite</Button>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Expected Learner Flow</CardTitle>
						<CardDescription>What happens after sharing</CardDescription>
					</CardHeader>
					<CardContent className="space-y-2 text-sm">
						<p>1. Learner enters session code</p>
						<p>2. Learner reviews goals + amount</p>
						<p>3. Learner approves + funds escrow</p>
						<p>4. Session moves to funded state</p>
						<Badge variant="outline">Escrow Ready</Badge>
					</CardContent>
				</Card>
			</div>
		</DemoShell>
	);
}
