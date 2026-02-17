import {
	type ConnectedWallet,
	usePrivy,
	useWallets,
} from "@privy-io/react-auth";
import { useSetActiveWallet } from "@privy-io/wagmi";
import { useCallback, useMemo } from "react";
import { defaultChain } from "@/src/constants";
import { safeAsync } from "../../errors/safe";

export const useActiveWallet = () => {
	const { ready, authenticated, user } = usePrivy();
	const { setActiveWallet } = useSetActiveWallet();
	const activeWalletAddress = user?.wallet?.address;

	// get full wallet object
	const { wallets } = useWallets();
	const activeWallet = useMemo(
		() => wallets.find((w) => w.address === activeWalletAddress),
		[wallets, activeWalletAddress],
	);

	// get chain information
	const defaultChainId = defaultChain.id;
	const isWrongChain =
		ready &&
		authenticated &&
		activeWallet &&
		activeWallet.chainId !== `eip155:${defaultChainId}`;

	// switch chain
	const switchNetwork = useCallback(
		async (chainId: number = defaultChainId) => {
			return safeAsync(() => {
				if (!activeWallet) throw new Error("Active wallet not found");
				return activeWallet.switchChain(chainId);
			});
		},
		[activeWallet],
	);

	const switchActiveWallet = useCallback(
		async (wallet: ConnectedWallet) => {
			return safeAsync(() => {
				if (!wallet) throw new Error("Wallet not found");
				if (wallet.address === activeWalletAddress)
					throw new Error("Wallet is already active");
				return setActiveWallet(wallet);
			});
		},
		[setActiveWallet, activeWalletAddress],
	);

	return {
		activeWallet,
		connectedWallets: wallets,
		defaultChain,
		isWalletOnDefaultChain: !isWrongChain,
		switchNetwork,
		switchActiveWallet,
	};
};
