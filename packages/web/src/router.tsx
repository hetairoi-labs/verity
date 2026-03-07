import { createRouter } from "@tanstack/react-router";
import { routeTree } from "@/routeTree.gen";
import type { AuthContextType } from "@/src/lib/context/auth-context";

export const router = createRouter({
	context: {
		auth: undefined as unknown as AuthContextType,
	},
	routeTree,
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}
