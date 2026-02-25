import { SpinnerBallIcon } from "@phosphor-icons/react";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { RootErrorComponent } from "@/src/components/custom/error";
import NotFoundPage from "@/src/components/custom/not-found";

function RootLayout() {
	return (
		<div className="bg-background">
			<div className="@container/main">
				<Outlet />
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
