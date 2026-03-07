import { SpinnerBallIcon } from "@phosphor-icons/react";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { RootErrorComponent } from "@/src/components/custom/error";
import NotFoundPage from "@/src/components/custom/not-found";
import type { AuthContextType } from "@/src/lib/context/auth-context";

function RootLayout() {
	return (
		<div className="bg-background">
			<div className="@container/main">
				<Outlet />
			</div>
		</div>
	);
}

interface RouterContext {
	auth: AuthContextType;
}

export const Route = createRootRouteWithContext<RouterContext>()({
	component: RootLayout,
	notFoundComponent: NotFoundPage,
	errorComponent: RootErrorComponent,
	pendingComponent: () => (
		<div className="flex min-h-screen items-center justify-center">
			<SpinnerBallIcon className="animate-spin" size={32} />
		</div>
	),
});
