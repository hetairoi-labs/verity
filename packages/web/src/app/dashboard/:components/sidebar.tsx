import { MoonIcon } from "@phosphor-icons/react";
import Logo from "@/src/components/custom/logo";
import { Separator } from "@/src/components/ui/separator";
import { cn } from "@/src/lib/utils";
import { sidebarNav } from "./mock";

export default function Sidebar() {
	return (
		<aside className="sticky top-0 flex h-dvh w-60 shrink-0 flex-col bg-card">
			<div className="flex items-center gap-3 px-8 pt-9 pb-7">
				<Logo className="size-12" />
				<span className="text-3xl text-foreground tracking-wider">Verity</span>
			</div>

			<Separator className="bg-border/60" />
			<div className="px-8" />

			<nav className="flex flex-1 flex-col gap-0.5 px-4 pt-6">
				{sidebarNav.map((item) => (
					<a
						className={cn(
							"group relative flex items-center gap-3 rounded-lg px-4 py-2.5 font-medium text-sm transition-colors",
							item.active
								? "text-foreground"
								: "text-muted-foreground hover:text-foreground"
						)}
						href={item.href}
						key={item.label}
					>
						{item.active && (
							<span className="absolute top-1/2 left-0 h-9 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
						)}
						<item.icon size={20} weight={item.active ? "fill" : "regular"} />
						{item.label}
					</a>
				))}
			</nav>

			<div className="mt-auto px-5 pb-6">
				<div className="relative rounded-2xl bg-linear-to-br from-primary via-primary/90 to-primary/80 px-4 pt-8 pb-5">
					<div className="absolute -top-5 left-1/2 z-10 flex size-16 -translate-x-1/2 items-center justify-center rounded-full bg-primary ring-[0.3rem] ring-card">
						<MoonIcon
							className="-rotate-230 text-white"
							size={40}
							weight="fill"
						/>
					</div>
					<div className="mt-8 text-center text-white">
						<p className="font-medium text-sm">Upgrade to PRO</p>
						<p className="mt-1 text-xs">to get access to all features!</p>
						<p className="mt-0.5 text-xs">Connect with Venus World!</p>
					</div>
				</div>
			</div>
		</aside>
	);
}
