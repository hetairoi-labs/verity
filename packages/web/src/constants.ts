import { hardhat, mainnet, sepolia } from "viem/chains";

const chains = [hardhat, mainnet, sepolia] as const;
export const privyChains = [...chains];
export const wagmiChains = chains;
export const defaultChain = hardhat;
