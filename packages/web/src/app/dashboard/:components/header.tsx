import {
	BellIcon,
	InfoIcon,
	MagnifyingGlassIcon,
	MoonStarsIcon,
	SunIcon,
} from "@phosphor-icons/react";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { useTheme } from "@/src/lib/context/theme-provider";
import ThemeSwitch from "@/src/components/custom/theme-switch";

export default function Header() {
	const { theme, setTheme } = useTheme();

	return (
		<header className="flex items-center justify-between pb-6">
			<div>
				<p className="text-xs text-muted-foreground">Pages / Profile</p>
				<h1 className="text-2xl font-medium text-foreground">Profile</h1>
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

				<Button variant="ghost" size="icon">
					<BellIcon size={18} />
				</Button>
				<ThemeSwitch />
				<Button variant="ghost" size="icon">
					<InfoIcon size={18} />
				</Button>

				<Avatar className="size-9">
					<AvatarFallback className="bg-secondary text-sm">AP</AvatarFallback>
				</Avatar>
			</div>
		</header>
	);
}
