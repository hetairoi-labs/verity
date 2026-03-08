import {
	CheckIcon,
	CopyIcon,
	SignOutIcon,
	UserIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import { toast } from "sonner";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/src/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { useAuth } from "@/src/lib/context/auth-context";
import { truncateAddress } from "@/src/lib/utils";

interface UserDropdownProps {
	userImage?: string;
}

export function UserDropdown({ userImage }: UserDropdownProps) {
	const { user, logout } = useAuth();
	const [copied, setCopied] = useState(false);
	const [open, setOpen] = useState(false);

	const walletAddress = user?.wallet?.address;
	const email = user?.email?.toString();
	const initials = email?.split("@")[0]?.charAt(0).toUpperCase() ?? "U";

	const handleCopy = async (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (walletAddress) {
			await navigator.clipboard.writeText(walletAddress);
			setCopied(true);
			toast.success("Copied to clipboard", {
				position: "top-center",
			});
		}
	};

	return (
		<DropdownMenu onOpenChange={setOpen} open={open}>
			<DropdownMenuTrigger
				className="outline-none"
				nativeButton={true}
				render={
					<Avatar className="ml-2 cursor-pointer transition-opacity hover:opacity-80" />
				}
			>
				<AvatarImage src={userImage} />
				<AvatarFallback>{initials}</AvatarFallback>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="mt-2 w-56" sideOffset={4}>
				<DropdownMenuGroup>
					<DropdownMenuLabel className="flex flex-col gap-1 py-2">
						<span className="font-medium text-foreground text-sm">Account</span>
						<span className="truncate font-normal text-muted-foreground text-xs">
							{email}
						</span>
					</DropdownMenuLabel>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem
						className="flex items-center justify-between py-2"
						onClick={handleCopy}
					>
						<div className="flex items-center gap-2">
							<UserIcon className="text-muted-foreground" size={18} />
							<span className="max-w-32 truncate">
								{walletAddress ? truncateAddress(walletAddress) : "No wallet"}
							</span>
						</div>
						{walletAddress && (
							<div className="flex size-7 items-center justify-center rounded-md transition-colors">
								{copied ? (
									<CheckIcon size={14} />
								) : (
									<CopyIcon className="text-muted-foreground" size={14} />
								)}
							</div>
						)}
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					className="flex items-center gap-2 py-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
					onClick={() => logout()}
				>
					<SignOutIcon size={18} />
					<span>Sign Out</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
