import { useWallets } from "@privy-io/react-auth";
import { useState } from "react";

export function useSwitchNetwork() {
	const { wallets } = useWallets();
	const [isSwitching, setIsSwitching] = useState(false);

	async function switchChain(walletAddress: string, chainId: number) {
		setIsSwitching(true);
		const wallet = wallets.find((wallet) => wallet.address === walletAddress);
		if (!wallet) throw new Error("Wallet not found");

		await wallet.switchChain(chainId);
		setIsSwitching(false);
	}

	return { switchChain, isSwitching };
}
