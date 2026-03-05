import { StarFourIcon } from "@phosphor-icons/react";
import { insightHeaderActions, insights, quickActions } from "./mock";
import { Panel } from "./panel";

export function BottomSection() {
	return (
		<section className="grid gap-4 lg:grid-cols-[2fr_1fr]">
			<Panel>
				<div className="flex items-center justify-between">
					<h4 className="text-xl">AI Insights</h4>
					{insightHeaderActions.map((item) => (
						<item.icon
							className="text-muted-foreground"
							key={item.label}
							size={20}
						/>
					))}
				</div>
				<div className="mt-3 space-y-2.5">
					{insights.map((insight) => (
						<p
							className="flex items-start gap-2 text-muted-foreground text-sm"
							key={insight}
						>
							<StarFourIcon className="mt-0.5 text-primary" size={14} />
							<span>{insight}</span>
						</p>
					))}
				</div>
			</Panel>

			<Panel>
				<h4 className="text-xl">Quick actions</h4>
				<div className="mt-3 space-y-2">
					{quickActions.map((action) => (
						<button
							className="block text-left text-muted-foreground text-sm transition-colors hover:text-foreground"
							key={action}
							type="button"
						>
							{action}
						</button>
					))}
				</div>
			</Panel>
		</section>
	);
}
