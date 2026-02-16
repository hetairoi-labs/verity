import { PrivyProvider as PrivyProviderBase } from "@privy-io/react-auth";
import { hardhat } from "viem/chains";
import { useTheme } from "./theme-provider";

export function PrivyProvider({ children }: { children: React.ReactNode }) {
	const { theme } = useTheme();
	const runtimeChain = hardhat;

	return (
		<PrivyProviderBase
			appId={process.env.PUBLIC_PRIVY_APP_ID}
			config={{
				defaultChain: runtimeChain,
				supportedChains: [runtimeChain],
				loginMethods: ["wallet", "google"],
				appearance: {
					theme: theme === "dark" ? "dark" : "light",
				},
				embeddedWallets: {
					ethereum: {
						createOnLogin: "users-without-wallets",
					},
				},
			}}
		>
			{children}
		</PrivyProviderBase>
	);
}
