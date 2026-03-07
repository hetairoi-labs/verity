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
		<div className="flex min-h-screen items-center justify-center">
			<SpinnerBallIcon className="animate-spin" size={32} />
		</div>
	),
});
