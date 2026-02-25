import type { AnyRouter } from "@tanstack/react-router";
import { RouterProvider } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { PrivyProvider } from "./privy-provider";
import { QueryClientProvider } from "./query-client";
import { ThemeProvider } from "./theme-provider";
import { WagmiProvider } from "./wagmi-provider";

export default function AppProviders({ router }: { router: AnyRouter }) {
	return (
		<ThemeProvider defaultTheme="dark" storageKey="theme">
			<PrivyProvider>
				<QueryClientProvider>
					<WagmiProvider>
						<RouterProvider router={router} />
						<Toaster position="top-right" theme={"dark"} />
					</WagmiProvider>
				</QueryClientProvider>
			</PrivyProvider>
		</ThemeProvider>
	);
}
