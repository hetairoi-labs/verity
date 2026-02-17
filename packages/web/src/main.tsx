import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";
import { routeTree } from "@/routeTree.gen";
import { QueryClientProvider } from "@/src/lib/context/query-client";
import { ThemeProvider } from "@/src/lib/context/theme-provider";
import "@/src/globals.css";
import { PrivyProvider } from "./lib/context/privy-provider";
import { WagmiProvider } from "./lib/context/wagmi-provider";
import { setupErrorHandling } from "./lib/errors/setup-errors";

const router = createRouter({ routeTree });
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

setupErrorHandling();

const app = (
	<StrictMode>
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
	</StrictMode>
);

// HMR
if (import.meta.hot) {
	if (!import.meta.hot.data.root) {
		import.meta.hot.data.root = createRoot(rootElement);
	}
	const root = import.meta.hot.data.root;
	root.render(app);
} else {
	const root = createRoot(rootElement);
	root.render(app);
}
