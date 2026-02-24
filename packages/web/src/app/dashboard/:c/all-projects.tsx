import { PencilSimpleIcon } from "@phosphor-icons/react";
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
				<CardTitle className="text-lg font-bold">All Projects</CardTitle>
				<CardDescription>
					Here you can find more details about your projects. Keep you user
					engaged by providing meaningful information.
				</CardDescription>
			</CardHeader>

			<CardContent className="space-y-4">
				{projects.map((project) => (
					<div
						key={project.id}
						className="flex items-center gap-3 rounded-2xl bg-secondary/50 p-3"
					>
						<div className="size-12 shrink-0 rounded-lg bg-muted" />

						<div className="flex-1 min-w-0">
							<p className="text-sm font-bold text-foreground truncate">
								{project.title}
							</p>
							<p className="text-xs text-muted-foreground">
								{project.number} •{" "}
								<span className="text-primary cursor-pointer hover:underline">
									{project.link}
								</span>
							</p>
						</div>

						<button
							type="button"
							className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
						>
							<PencilSimpleIcon size={16} />
						</button>
					</div>
				))}
			</CardContent>
		</Card>
	);
}
