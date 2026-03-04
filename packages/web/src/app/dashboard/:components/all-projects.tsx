import { PencilSimpleIcon } from "@phosphor-icons/react";
import { Button } from "@/src/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/src/components/ui/card";
import { projects } from "./mock";

export default function AllProjects() {
	return (
		<Card className="h-full">
			<CardHeader>
				<CardTitle className="text-lg">All Projects</CardTitle>
				<CardDescription>
					Here you can find more details about your projects. Keep you user
					engaged by providing meaningful information.
				</CardDescription>
			</CardHeader>

			<CardContent className="space-y-4">
				{projects.map((project) => (
					<div
						className="flex items-center gap-3 rounded-2xl bg-secondary/50 p-3"
						key={project.id}
					>
						<div className="size-12 shrink-0 rounded-lg bg-muted" />

						<div className="min-w-0 flex-1">
							<p className="truncate font-medium text-foreground text-sm">
								{project.title}
							</p>
							<p className="text-muted-foreground text-xs">
								{project.number} •{" "}
								<span className="cursor-pointer text-primary hover:underline">
									{project.link}
								</span>
							</p>
						</div>

						<Button className="shrink-0" size="icon" variant="ghost">
							<PencilSimpleIcon size={16} />
						</Button>
					</div>
				))}
			</CardContent>
		</Card>
	);
}
