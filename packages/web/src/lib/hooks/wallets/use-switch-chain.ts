import { useWallets } from "@privy-io/react-auth";
import { useState } from "react";
import { safeAsync } from "../../errors/safe";

export function useSwitchNetwork() {
	const { wallets } = useWallets();
	const [isSwitching, setIsSwitching] = useState(false);

	const switchChain = async (walletAddress: string, chainId: number) => {
		return await safeAsync(async () => {
			setIsSwitching(true);
			const wallet = wallets.find((wallet) => wallet.address === walletAddress);
			if (!wallet) throw new Error("Wallet not found");

			await wallet.switchChain(chainId);
			setIsSwitching(false);
			return true;
		});
	};

	return { switchChain, isSwitching };
}
