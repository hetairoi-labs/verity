import { createRouter } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { routeTree } from "@/routeTree.gen";
import AppProviders from "@/src/lib/context";
import { setupErrorListener } from "./lib/errors/listener";
import "@/src/globals.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
	throw new Error("Failed to find the root element");
}
const router = createRouter({ routeTree });

setupErrorListener();

const app = (
	<StrictMode>
		<AppProviders router={router} />
	</StrictMode>
);

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
