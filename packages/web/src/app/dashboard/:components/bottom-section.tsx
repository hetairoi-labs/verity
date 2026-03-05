import { CaretRightIcon, StarFourIcon } from "@phosphor-icons/react";
import { insightHeaderActions, insights, quickActions } from "./mock";
import { Panel } from "./panel";

export function BottomSection() {
	return (
		<section className="grid gap-4 lg:grid-cols-[1fr_2fr]">
			<Panel>
				<h4 className="text-xl">Quick actions</h4>
				<div className="mt-3 space-y-2">
					{quickActions.map((action) => (
						<button
							className="flex items-center gap-2 text-left text-muted-foreground text-sm transition-colors hover:text-foreground"
							key={action}
							type="button"
						>
							<CaretRightIcon size={16} />
							{action}
						</button>
					))}
				</div>
			</Panel>

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
		</section>
	);
}
