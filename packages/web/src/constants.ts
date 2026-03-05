import { sepolia } from "viem/chains";

const chains = [sepolia] as const;
export const privyChains = [...chains];
export const wagmiChains = chains;
export const defaultChain = sepolia;
