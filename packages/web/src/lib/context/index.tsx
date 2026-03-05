import { type AnyRouter, RouterProvider } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { AuthProvider } from "./auth-context";
import { EvmProvider } from "./evmContext";
import { PrivyProvider } from "./privy-provider";
import { QueryClientProvider } from "./query-client";
import { ThemeProvider } from "./theme-provider";
import { WagmiProvider } from "./wagmi-provider";

export default function AppProviders({ router }: { router: AnyRouter }) {
	return (
		<ThemeProvider defaultTheme="dark" storageKey="theme">
			<QueryClientProvider>
				<PrivyProvider>
					<WagmiProvider>
						<AuthProvider>
							<EvmProvider>
								<RouterProvider router={router} />
								<Toaster position="top-right" theme={"dark"} />
							</EvmProvider>
						</AuthProvider>
					</WagmiProvider>
				</PrivyProvider>
			</QueryClientProvider>
		</ThemeProvider>
	);
}
