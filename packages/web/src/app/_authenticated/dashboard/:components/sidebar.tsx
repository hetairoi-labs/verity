import { GearSixIcon, StarFourIcon } from "@phosphor-icons/react";
import { Separator } from "@/src/components/ui/separator";
import { sideNavItems } from "./mock";

export function Sidebar() {
	return (
		<aside className="hidden flex-col rounded-2xl border border-border/70 bg-card/70 p-4 md:p-5 lg:sticky lg:top-4 lg:flex lg:h-[calc(100dvh-2rem)]">
			<div className="flex items-center gap-2.5">
				<span className="grid size-8 place-items-center rounded-full bg-secondary">
					<StarFourIcon size={16} weight="fill" />
				</span>
				<h2 className="text-xl">Verity</h2>
			</div>

			<nav className="mt-7 flex flex-col gap-1">
				{sideNavItems.map((item) => (
					<button
						className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-muted-foreground text-sm transition-colors hover:bg-secondary/70 hover:text-foreground"
						key={item.label}
						type="button"
					>
						<item.icon size={18} />
						<span>{item.label}</span>
					</button>
				))}
			</nav>

			<div className="mt-auto pt-3">
				<Separator className="mb-2 opacity-50" />
				<button
					className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-muted-foreground text-sm transition-colors hover:bg-secondary/70 hover:text-foreground"
					type="button"
				>
					<GearSixIcon size={18} />
					<span>Settings</span>
				</button>
			</div>
		</aside>
	);
}
