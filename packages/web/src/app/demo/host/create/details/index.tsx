import { createFileRoute } from "@tanstack/react-router";
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

export const Route = createFileRoute("/demo/host/create/details/")({
	component: HostCreateDetailsPage,
});

function HostCreateDetailsPage() {
	return (
		<DemoShell
			currentPath="/demo/host/create/details"
			description="Host creates the session pact with topic, duration, price, and platform."
			nextPath="/demo/host/create/goals"
			persona="Host"
			prevPath="/demo/host/dashboard"
			title="Create Session - Details"
		>
			<Card>
				<CardHeader>
					<CardTitle>Session Details Form</CardTitle>
					<CardDescription>Step 1 of host setup</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-3 md:grid-cols-2">
					<div className="space-y-1">
						<Label htmlFor="topic">Topic</Label>
						<Input defaultValue={activeSession.topic} id="topic" />
					</div>
					<div className="space-y-1">
						<Label htmlFor="duration">Duration (minutes)</Label>
						<Input
							defaultValue={String(activeSession.durationMinutes)}
							id="duration"
						/>
					</div>
					<div className="space-y-1">
						<Label htmlFor="price">Price (USDC)</Label>
						<Input defaultValue={String(activeSession.amountUsdc)} id="price" />
					</div>
					<div className="space-y-1">
						<Label htmlFor="platform">Platform</Label>
						<Input defaultValue={activeSession.platform} id="platform" />
					</div>
					<Button className="md:col-span-2">Save Session Details</Button>
				</CardContent>
			</Card>
		</DemoShell>
	);
}
