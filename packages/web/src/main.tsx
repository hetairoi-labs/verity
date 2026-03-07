import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AppProviders from "@/src/lib/context";
import { setupErrorListener } from "./lib/errors/listener";
import { createHmrInstance } from "./lib/utils/hmr";
import "@/src/globals.css";
import { router } from "./router";

const rootElement = document.getElementById("root");
if (!rootElement) {
	throw new Error("Failed to find the root element");
}

setupErrorListener();
const root = createHmrInstance("root", () => createRoot(rootElement));

root.render(
	<StrictMode>
		<AppProviders router={router} />
	</StrictMode>
);
