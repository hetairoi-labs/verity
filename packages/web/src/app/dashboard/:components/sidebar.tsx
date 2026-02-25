import logo from "@assets/logo.svg";
import { MoonIcon } from "@phosphor-icons/react";
import { Separator } from "@/src/components/ui/separator";
import { cn } from "@/src/lib/utils";
import { sidebarNav } from "./mock";

export default function Sidebar() {
	return (
		<aside className="sticky top-0 flex h-dvh w-60 shrink-0 flex-col bg-card">
			<div className="flex items-center gap-3 px-8 pt-9 pb-7">
				<img src={logo} alt="Verity Logo" className="size-9" />
				<span className="text-3xl tracking-wider text-foreground">Verity</span>
			</div>

			<Separator className="bg-border/60" />
			<div className="px-8"></div>

			<nav className="flex flex-1 flex-col gap-0.5 px-4 pt-6">
				{sidebarNav.map((item) => (
					<a
						key={item.label}
						href={item.href}
						className={cn(
							"group relative flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
							item.active
								? "text-foreground"
								: "text-muted-foreground hover:text-foreground",
						)}
					>
						{item.active && (
							<span className="absolute left-0 top-1/2 h-9 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
						)}
						<item.icon size={20} weight={item.active ? "fill" : "regular"} />
						{item.label}
					</a>
				))}
			</nav>

			<div className="mt-auto px-5 pb-6">
				<div className="relative rounded-2xl bg-linear-to-br from-primary via-primary/90 to-primary/80 px-4 pt-8 pb-5">
					<div className="absolute -top-5 left-1/2 -translate-x-1/2 flex size-16 items-center justify-center rounded-full z-10 bg-primary ring-[0.3rem] ring-card">
						<MoonIcon
							size={40}
							weight="fill"
							className="text-white -rotate-230"
						/>
					</div>
					<div className="mt-8 text-center text-white">
						<p className="text-sm font-medium">Upgrade to PRO</p>
						<p className="mt-1 text-xs">to get access to all features!</p>
						<p className="mt-0.5 text-xs">Connect with Venus World!</p>
					</div>
				</div>
			</div>
		</aside>
	);
}
