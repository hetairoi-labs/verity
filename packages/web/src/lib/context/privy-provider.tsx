import { PrivyProvider as PrivyProviderBase } from "@privy-io/react-auth";
import { defaultChain, privyChains } from "@/src/constants";
import { useTheme } from "./theme-provider";

export function PrivyProvider({ children }: { children: React.ReactNode }) {
	const { theme } = useTheme();
	return (
		<PrivyProviderBase
			appId={process.env.PUBLIC_PRIVY_APP_ID}
			config={{
				defaultChain,
				supportedChains: privyChains,
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
