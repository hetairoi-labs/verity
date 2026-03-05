import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "../../components/ui/button";

function RouteComponent() {
	return (
		<div className="flex h-screen flex-col items-center justify-center p-8">
			<h1 className="text-7xl uppercase lg:text-9xl">Tests</h1>

			<div className="mt-10 flex gap-4">
				<Link to="/test">
					<Button>API Tests</Button>
				</Link>
				<Link to="/test/auth">
					<Button>Auth</Button>
				</Link>
				<Link to="/test/live">
					<Button>Live</Button>
				</Link>
				<Link to="/test/chat">
					<Button>Chat</Button>
				</Link>
				<Link to="test/form">
					<Button>Form</Button>
				</Link>
				<Link to="/test/demo">
					<Button>Demo</Button>
				</Link>
			</div>
		</div>
	);
}

export const Route = createFileRoute("/test/")({
	component: RouteComponent,
});
