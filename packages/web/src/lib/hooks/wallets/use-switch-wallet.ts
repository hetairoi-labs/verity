import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useSetActiveWallet } from "@privy-io/wagmi";
import { safeAsync } from "../../errors/safe";

export function useSwitchWallet() {
	const { user } = usePrivy();
	const { wallets } = useWallets();
	const { setActiveWallet } = useSetActiveWallet();

	const activeWallet = user?.wallet?.address;

	const switchWallet = async (walletAddress: string) => {
		return await safeAsync(async () => {
			const wallet = wallets.find((wallet) => wallet.address === walletAddress);
			if (!wallet) throw new Error("Wallet not found");
			await setActiveWallet(wallet);
			return true;
		});
	};

	return { wallets, activeWallet, switchWallet };
}
