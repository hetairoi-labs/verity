import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "../../components/ui/button";

function RouteComponent() {
	return (
		<div className="flex flex-col items-center justify-center h-screen p-8">
			<h1 className="text-7xl lg:text-9xl uppercase">Tests</h1>

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
			</div>
		</div>
	);
}

export const Route = createFileRoute("/test/")({
	component: RouteComponent,
});
