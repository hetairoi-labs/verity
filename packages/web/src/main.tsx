import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";
import { QueryClientProvider } from "@/src/lib/context/query-client";
import { ThemeProvider } from "@/src/lib/context/theme-provider";
import { routeTree } from "./routeTree.gen";

const router = createRouter({ routeTree });
import "@/src/globals.css";

// Root element
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

// App
const app = (
	<StrictMode>
		<QueryClientProvider>
			<ThemeProvider defaultTheme="dark" storageKey="theme">
				<RouterProvider router={router} />
				<Toaster position="top-right" theme={"dark"} />
			</ThemeProvider>
		</QueryClientProvider>
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
