import {
	createRootRoute,
	createRoute,
	createRouter,
	Outlet,
} from "@tanstack/react-router";
import { useAnalytics } from "@/src/lib/hooks/use-analytics";
import { FormPage } from "@/src/pages/form";
import _404 from "./404";
import { HomePage } from "./home";

const rootRoute = createRootRoute({
	component: () => {
		useAnalytics();
		return <Outlet />;
	},
	notFoundComponent: () => <_404 />,
});

const indexRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/",
	component: function Index() {
		return <HomePage />;
	},
});

const formRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/form",
	component: function Form() {
		return <FormPage />;
	},
});

const routeTree = rootRoute.addChildren([indexRoute, formRoute]);
const router = createRouter({
	routeTree,
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

export default router;
