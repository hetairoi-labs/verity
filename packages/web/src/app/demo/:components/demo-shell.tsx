import type { ReactNode } from "react";
import { Badge } from "@/src/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/src/components/ui/card";
import { demoSteps } from "./mock";

interface DemoShellProps {
	children: ReactNode;
	currentPath: string;
	description: string;
	nextPath?: string;
	persona: "Shared" | "Host" | "Learner";
	prevPath?: string;
	title: string;
}

export default function DemoShell({
	children,
	currentPath,
	description,
	nextPath,
	persona,
	prevPath,
	title,
}: DemoShellProps) {
	return (
		<div className="min-h-dvh bg-background">
			<div className="mx-auto flex w-full max-w-7xl flex-col gap-4 p-6 pb-10">
				<header className="space-y-3">
					<div className="flex flex-wrap items-center gap-2">
						<Badge>Verity Demo Flow</Badge>
						<Badge variant="outline">{currentPath}</Badge>
						<Badge variant="secondary">{persona}</Badge>
					</div>
					<div className="space-y-1">
						<h1 className="font-medium text-2xl">{title}</h1>
						<p className="text-muted-foreground text-sm">{description}</p>
					</div>
				</header>

				<Card>
					<CardHeader>
						<CardTitle>Route Map</CardTitle>
						<CardDescription>
							Click any screen to jump in the demo journey.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex flex-wrap gap-2">
							{demoSteps.map((step) => {
								const isActive = step.path === currentPath;
								return (
									<a
										className={`rounded-lg border px-2 py-1 text-xs transition-colors ${
											isActive
												? "border-primary bg-primary/10 text-foreground"
												: "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
										}`}
										href={step.path}
										key={step.id}
									>
										{step.group}: {step.label}
									</a>
								);
							})}
						</div>
					</CardContent>
				</Card>

				{children}

				<footer className="flex flex-wrap items-center justify-between gap-2 border-border border-t pt-4">
					<div className="flex gap-2">
						{prevPath ? (
							<a
								className="inline-flex h-8 items-center justify-center rounded-lg border border-border px-2.5 text-sm transition-colors hover:bg-muted"
								href={prevPath}
							>
								Previous
							</a>
						) : null}
						{nextPath ? (
							<a
								className="inline-flex h-8 items-center justify-center rounded-lg bg-primary px-2.5 text-primary-foreground text-sm transition-colors hover:bg-primary/90"
								href={nextPath}
							>
								Next
							</a>
						) : null}
					</div>
					<a
						className="text-muted-foreground text-sm hover:text-foreground"
						href="/mockup"
					>
						Back to /mockup board
					</a>
				</footer>
			</div>
		</div>
	);
}
