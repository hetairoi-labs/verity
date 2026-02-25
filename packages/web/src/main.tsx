import { createRouter } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { routeTree } from "@/routeTree.gen";
import AppProviders from "@/src/lib/context";
import "@/src/globals.css";
import { errorRootOptions, setupErrorListener } from "./lib/errors/listener";

const router = createRouter({ routeTree });
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

setupErrorListener({
	router,
});

const app = (
	<StrictMode>
		<AppProviders router={router} />
	</StrictMode>
);

if (import.meta.hot) {
	if (!import.meta.hot.data.root) {
		import.meta.hot.data.root = createRoot(rootElement, errorRootOptions);
	}
	const root = import.meta.hot.data.root;
	root.render(app);
} else {
	const root = createRoot(rootElement, errorRootOptions);
	root.render(app);
}
