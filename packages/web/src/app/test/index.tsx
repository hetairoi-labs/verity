import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "../../components/ui/button";

function RouteComponent() {
	return (
		<div className="flex h-screen flex-col items-center justify-center p-8">
			<h1 className="text-7xl uppercase lg:text-9xl">Tests</h1>

			<div className="mt-10 flex gap-4">
				<Link to="/test/e2e">
					<Button>E2E Tests</Button>
				</Link>
				<Link to="/test/auth">
					<Button>Auth</Button>
				</Link>
				<Link to="/test/form">
					<Button>Form</Button>
				</Link>
			</div>
		</div>
	);
}

export const Route = createFileRoute("/test/")({
	component: RouteComponent,
});
