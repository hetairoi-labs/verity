import type { AnyRouter } from "@tanstack/react-router";
import { RouterProvider } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { AuthProvider } from "./auth-context";
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
							<RouterProvider router={router} />
							<Toaster position="top-right" theme={"dark"} />
						</AuthProvider>
					</WagmiProvider>
				</PrivyProvider>
			</QueryClientProvider>
		</ThemeProvider>
	);
}
