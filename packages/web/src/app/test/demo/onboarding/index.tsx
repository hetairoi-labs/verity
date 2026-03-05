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
import { Switch } from "@/src/components/ui/switch";
import DemoShell from "../:components/demo-shell";
import { onboardingChecklist } from "../:components/mock";

export const Route = createFileRoute("/test/demo/onboarding/")({
	component: DemoOnboardingPage,
});

function DemoOnboardingPage() {
	return (
		<DemoShell
			currentPath="/demo/onboarding"
			description="Role setup and baseline profile completion before entering app dashboards."
			nextPath="/demo/host/dashboard"
			persona="Shared"
			prevPath="/demo/login"
			title="Onboarding"
		>
			<div className="grid gap-3 xl:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Profile Setup</CardTitle>
						<CardDescription>
							Minimum data for session credibility
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3 text-sm">
						<div className="space-y-1">
							<Label htmlFor="display-name">Display Name</Label>
							<Input defaultValue="Alice Chen" id="display-name" />
						</div>
						<div className="space-y-1">
							<Label htmlFor="focus">Teaching / Learning Focus</Label>
							<Input defaultValue="Web3 smart contracts" id="focus" />
						</div>
						<div className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
							<Label htmlFor="host-toggle">Enable Host Mode</Label>
							<Switch defaultChecked id="host-toggle" />
						</div>
						<div className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
							<Label htmlFor="learner-toggle">Enable Learner Mode</Label>
							<Switch defaultChecked id="learner-toggle" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Onboarding Checklist</CardTitle>
						<CardDescription>Completion state for first run</CardDescription>
					</CardHeader>
					<CardContent className="space-y-2 text-sm">
						{onboardingChecklist.map((item) => (
							<div
								className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
								key={item.id}
							>
								<p>{item.label}</p>
								<Badge variant={item.done ? "default" : "outline"}>
									{item.done ? "Done" : "Pending"}
								</Badge>
							</div>
						))}
						<Button className="w-full">Complete and Continue</Button>
					</CardContent>
				</Card>
			</div>
		</DemoShell>
	);
}
