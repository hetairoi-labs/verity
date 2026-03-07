import { SpinnerBallIcon } from "@phosphor-icons/react";
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/src/lib/context/auth-context";

export const Route = createFileRoute("/_authenticated")({
	component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
	const auth = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (auth.ready && !auth.authenticated) {
			navigate({ to: "/" });
		}
	}, [auth.ready, auth.authenticated, navigate]);

	if (!auth.ready) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<SpinnerBallIcon className="animate-spin" size={32} />
			</div>
		);
	}

	if (!auth.authenticated) {
		return null;
	}

	return <Outlet />;
}
