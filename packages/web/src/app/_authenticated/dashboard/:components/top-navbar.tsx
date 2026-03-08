import { MagnifyingGlassIcon, WalletIcon } from "@phosphor-icons/react";
import { Loader } from "@/src/components/custom/loading";
import ThemeSwitch from "@/src/components/custom/theme-switch";
import { Button } from "@/src/components/ui/button";
import { useUsdtBalance } from "@/src/lib/hooks/web3/use-usdt-balance";
import { formatUSDC } from "@/src/lib/utils/usdc";
import { Panel } from "./panel";

export function TopNavbar({ title }: { title: string }) {
	const { balance } = useUsdtBalance();

	return (
		<Panel>
			<div className="flex flex-wrap items-center justify-between gap-3">
				<h1 className="text-2xl">{title}</h1>

				<div className="flex items-center gap-2">
					<Button variant="outline">
						<WalletIcon /> {balance ? formatUSDC(balance) : <Loader />}{" "}
						<span className="text-xs">USDC</span>
					</Button>

					<Button size="icon" variant="outline">
						<MagnifyingGlassIcon />
					</Button>

					<ThemeSwitch variant={"outline"} />
				</div>
			</div>
		</Panel>
	);
}
