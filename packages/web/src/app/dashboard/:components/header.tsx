import {
	BellIcon,
	MagnifyingGlassIcon,
	SignOutIcon,
} from "@phosphor-icons/react";
import { useNavigate } from "@tanstack/react-router";
import ThemeSwitch from "@/src/components/custom/theme-switch";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { useAuth } from "@/src/lib/context/auth-context";

export default function Header() {
	const { logout } = useAuth();
	const navigate = useNavigate();

	return (
		<header className="flex items-center justify-between pb-6">
			<div>
				<p className="text-muted-foreground text-xs">Pages / Profile</p>
				<h1 className="font-medium text-2xl text-foreground">Profile</h1>
			</div>

			<div className="flex items-center gap-2 rounded-full bg-card px-4 py-2 ring-1 ring-border">
				<div className="relative flex items-center">
					<MagnifyingGlassIcon
						className="absolute left-2.5 text-muted-foreground"
						size={16}
					/>
					<Input
						className="h-8 w-40 rounded-full border-none bg-secondary pl-8 text-sm placeholder:text-muted-foreground focus-visible:ring-0"
						placeholder="Search"
					/>
				</div>

				<Button size="icon" variant="ghost">
					<BellIcon size={18} />
				</Button>
				<ThemeSwitch />
				<Button
					onClick={() => logout().then(() => navigate({ to: "/" }))}
					size="icon"
					variant="ghost"
				>
					<SignOutIcon size={18} />
				</Button>

				<Avatar className="size-9">
					<AvatarFallback className="bg-secondary text-sm">AP</AvatarFallback>
				</Avatar>
			</div>
		</header>
	);
}
