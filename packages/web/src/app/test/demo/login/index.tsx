import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import DemoShell from "../:components/demo-shell";

export const Route = createFileRoute("/test/demo/login/")({
	component: DemoLoginPage,
});

function DemoLoginPage() {
	return (
		<DemoShell
			currentPath="/demo/login"
			description="Wallet connect + account bootstrap mock for the first step."
			nextPath="/demo/onboarding"
			persona="Shared"
			prevPath="/demo"
			title="Login / Connect Wallet"
		>
			<div className="grid gap-3 xl:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Connect Wallet</CardTitle>
						<CardDescription>Use existing wallet auth flow</CardDescription>
					</CardHeader>
					<CardContent className="space-y-2">
						<Button className="w-full">Connect MetaMask</Button>
						<Button className="w-full" variant="outline">
							Connect WalletConnect
						</Button>
						<p className="text-muted-foreground text-xs">
							Demo mode only - buttons are visual placeholders.
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Session Bootstrap</CardTitle>
						<CardDescription>Captured after first login</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3 text-sm">
						<div className="space-y-1">
							<Label htmlFor="wallet">Wallet Address</Label>
							<Input defaultValue="0x61B9...A3f2" id="wallet" readOnly />
						</div>
						<div className="space-y-1">
							<Label htmlFor="network">Network</Label>
							<Input defaultValue="Base Sepolia" id="network" readOnly />
						</div>
						<div className="flex flex-wrap gap-2">
							<Badge variant="secondary">Privy Auth</Badge>
							<Badge variant="secondary">Wallet Linked</Badge>
							<Badge variant="secondary">Ready for Onboarding</Badge>
						</div>
					</CardContent>
				</Card>
			</div>
		</DemoShell>
	);
}
