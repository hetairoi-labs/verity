import { useAnalytics } from "@hooks/use-analytics";
import { SpinnerBallIcon } from "@phosphor-icons/react";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { RootErrorComponent } from "@/src/components/custom/error";
import NotFoundPage from "@/src/components/custom/not-found";
import ThemeSwitch from "@/src/components/custom/theme-switch";

function RootLayout() {
	useAnalytics();
	return (
		<div className="bg-background">
			<div className="@container/main">
				<Outlet />
			</div>

			<div className="fixed right-4 bottom-4">
				<ThemeSwitch />
			</div>
		</div>
	);
}

export const Route = createRootRoute({
	component: RootLayout,
	notFoundComponent: NotFoundPage,
	errorComponent: RootErrorComponent,
	pendingComponent: () => (
		<div className="min-h-screen flex items-center justify-center">
			<SpinnerBallIcon size={32} className="animate-spin" />
		</div>
	),
});
