import { StrictMode } from "react";
import { createRoot, type Root } from "react-dom/client";
import AppProviders from "@/src/lib/context";
import { setupErrorListener } from "./lib/errors/listener";
import "@/src/globals.css";
import { router } from "./router";

const rootElement = document.getElementById("root");
if (!rootElement) {
	throw new Error("Failed to find the root element");
}

setupErrorListener();
let root: Root;

if (import.meta.hot) {
	if (!import.meta.hot.data.root) {
		import.meta.hot.data.root = createRoot(rootElement);
	}
	root = import.meta.hot.data.root;
} else {
	root = createRoot(rootElement);
}

root.render(
	<StrictMode>
		<AppProviders router={router} />
	</StrictMode>
);
