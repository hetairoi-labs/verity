import { hardhat, mainnet, sepolia } from "viem/chains";

export const privyChains = [hardhat, mainnet, sepolia];
export const wagmiChains = [hardhat, mainnet, sepolia] as const;
export const defaultChain = hardhat;
