import {
	createConfig,
	WagmiProvider as WagmiProviderBase,
} from "@privy-io/wagmi";
import { hardhat } from "viem/chains";
import { http } from "wagmi";

declare module "wagmi" {
	interface Register {
		config: ReturnType<typeof createConfig>;
	}
}

export function WagmiProvider({ children }: { children: React.ReactNode }) {
	const runtimeChain = hardhat;
	const config = createConfig({
		chains: [runtimeChain],
		transports: {
			[runtimeChain.id]: http(),
		},
	});
	return <WagmiProviderBase config={config}>{children}</WagmiProviderBase>;
}
