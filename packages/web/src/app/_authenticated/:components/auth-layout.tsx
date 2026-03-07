import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Loader } from "@/src/components/custom/loading";
import { useAuth } from "@/src/lib/context/auth-context";

export function AuthenticatedLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const auth = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (auth.ready && !auth.authenticated) {
			navigate({ to: "/" });
		}
	}, [auth.ready, auth.authenticated, navigate]);

	if (!auth.ready) {
		return <Loader />;
	}

	if (!auth.authenticated) {
		return null;
	}

	return <>{children}</>;
}
