import UserImage from "@assets/card.png";
import { WalletIcon } from "@phosphor-icons/react";
import { Loader } from "@/src/components/custom/loading";
import ThemeSwitch from "@/src/components/custom/theme-switch";
import { Button } from "@/src/components/ui/button";
import { useUsdtBalance } from "@/src/lib/hooks/web3/use-usdt-balance";
import { formatUSDC } from "@/src/lib/utils/usdc";
import { Panel } from "./panel";
import { UserDropdown } from "./user-dropdown";

export function TopNavbar({ title }: { title: string }) {
	const { balance } = useUsdtBalance();

	return (
		<Panel>
			<div className="flex flex-wrap items-center justify-between gap-3">
				<h1 className="text-2xl">{title}</h1>

				<div className="flex items-center gap-2">
					<ThemeSwitch variant={"outline"} />

					<Button className="cursor-default" variant="outline">
						<WalletIcon /> {balance ? formatUSDC(balance) : <Loader />}{" "}
						<span className="text-xs">USDC</span>
					</Button>

					<UserDropdown userImage={UserImage} />
				</div>
			</div>
		</Panel>
	);
}
