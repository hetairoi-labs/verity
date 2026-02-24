import {
	BellIcon,
	InfoIcon,
	MagnifyingGlassIcon,
	MoonIcon,
} from "@phosphor-icons/react";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import { Input } from "@/src/components/ui/input";

export default function Header() {
	return (
		<header className="flex items-center justify-between pb-6">
			<div>
				<p className="text-xs text-muted-foreground">Pages / Profile</p>
				<h1 className="text-2xl font-bold text-foreground lg:text-2xl">
					Profile
				</h1>
			</div>

			<div className="flex items-center gap-2 rounded-full bg-card px-4 py-2 ring-1 ring-border">
				<div className="relative flex items-center">
					<MagnifyingGlassIcon
						size={16}
						className="absolute left-2.5 text-muted-foreground"
					/>
					<Input
						placeholder="Search"
						className="h-8 w-40 rounded-full border-none bg-secondary pl-8 text-sm placeholder:text-muted-foreground focus-visible:ring-0"
					/>
				</div>

				<button
					type="button"
					className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
				>
					<BellIcon size={18} />
				</button>
				<button
					type="button"
					className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
				>
					<MoonIcon size={18} />
				</button>
				<button
					type="button"
					className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
				>
					<InfoIcon size={18} />
				</button>

				<Avatar className="size-9">
					<AvatarFallback className="bg-secondary text-sm">AP</AvatarFallback>
				</Avatar>
			</div>
		</header>
	);
}
