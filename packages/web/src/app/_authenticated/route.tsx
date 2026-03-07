import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AuthenticatedLayout } from "./:components/auth-layout";

export const Route = createFileRoute("/_authenticated")({
	component: () => (
		<AuthenticatedLayout>
			<Outlet />
		</AuthenticatedLayout>
	),
});
