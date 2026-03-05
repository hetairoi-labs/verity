import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/src/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/src/components/ui/card";
import DemoShell from "./:components/demo-shell";
import { demoSteps, hostProfile, learnerProfile } from "./:components/mock";

export const Route = createFileRoute("/test/demo/")({
	component: DemoFlowStartPage,
});

function DemoFlowStartPage() {
	return (
		<DemoShell
			currentPath="/demo"
			description="End-to-end product-like route flow for login -> onboarding -> host + learner journeys -> settlement."
			nextPath="/demo/login"
			persona="Shared"
			title="Demo Flow Entry"
		>
			<div className="grid gap-3 xl:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Host Persona</CardTitle>
						<CardDescription>Expert session creator</CardDescription>
					</CardHeader>
					<CardContent className="space-y-2 text-sm">
						<p>Name: {hostProfile.name}</p>
						<p>Role: {hostProfile.role}</p>
						<p>Merit Score: {hostProfile.meritScore}</p>
						<p>Completed Sessions: {hostProfile.sessionsCompleted}</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Learner Persona</CardTitle>
						<CardDescription>Knowledge buyer</CardDescription>
					</CardHeader>
					<CardContent className="space-y-2 text-sm">
						<p>Name: {learnerProfile.name}</p>
						<p>Goal: {learnerProfile.target}</p>
						<p>Wallet: {learnerProfile.wallet}</p>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Screen Sequence</CardTitle>
					<CardDescription>
						All pages available in this demo route system.
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-wrap gap-2">
					{demoSteps.map((step) => (
						<Badge key={step.id} variant="outline">
							{step.group} - {step.label}
						</Badge>
					))}
				</CardContent>
			</Card>
		</DemoShell>
	);
}
