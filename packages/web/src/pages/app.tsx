import {
	createRootRoute,
	createRoute,
	createRouter,
	Outlet,
} from "@tanstack/react-router";
import { useAnalytics } from "@/src/lib/hooks/use-analytics";
import { FormPage } from "@/src/pages/form";
import { TestPage } from "@/src/pages/test/test";
import _404 from "./404";
import { HomePage } from "./home";
import { LivePage } from "./live";

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

const testRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/test",
	component: function Test() {
		return <TestPage />;
	},
});

const liveRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/live",
	component: function Live() {
		return <LivePage />;
	},
});

const routeTree = rootRoute.addChildren([
	indexRoute,
	formRoute,
	testRoute,
	liveRoute,
]);

const router = createRouter({
	routeTree,
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

export default router;
