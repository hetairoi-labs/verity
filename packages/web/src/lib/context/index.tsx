import { type AnyRouter, RouterProvider } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { AuthProvider, useAuth } from "./auth-context";
import { EvmProvider } from "./evm-context";
import { PrivyProvider } from "./privy-provider";
import { QueryClientProvider } from "./query-client";
import { ThemeProvider } from "./theme-provider";
import { WagmiProvider } from "./wagmi-provider";

function RouterWithAuth({ router }: { router: AnyRouter }) {
	const auth = useAuth();
	return <RouterProvider context={{ auth }} router={router} />;
}

export default function AppProviders({ router }: { router: AnyRouter }) {
	return (
		<ThemeProvider defaultTheme="dark" storageKey="theme">
			<QueryClientProvider>
				<PrivyProvider>
					<WagmiProvider>
						<AuthProvider>
							<EvmProvider>
								<RouterWithAuth router={router} />
								<Toaster position="top-right" theme={"dark"} />
							</EvmProvider>
						</AuthProvider>
					</WagmiProvider>
				</PrivyProvider>
			</QueryClientProvider>
		</ThemeProvider>
	);
}
