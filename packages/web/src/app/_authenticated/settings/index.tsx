import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { DashboardShell } from "@/src/app/_authenticated/dashboard/:components/dashboard-shell";
import { Panel } from "@/src/app/_authenticated/dashboard/:components/panel";
import { Button } from "@/src/components/ui/button";
import { useAuth } from "@/src/lib/context/auth-context";

export const Route = createFileRoute("/_authenticated/settings/")({
	component: SettingsPage,
});

function SettingsPage() {
	const { user, update } = useAuth();

	return (
		<DashboardShell
			description="Manage your Privy account and linked providers."
			title="Settings"
		>
			<Panel className="space-y-2">
				<h2 className="text-lg">Account</h2>
				<p className="text-muted-foreground text-sm">
					User ID: {user?.id ?? "-"}
				</p>
				<p className="text-muted-foreground text-sm">
					Wallet: {user?.wallet?.address ?? "-"}
				</p>
				<p className="text-muted-foreground text-sm">
					Email: {user?.email?.address ?? "-"}
				</p>
			</Panel>

			<Panel className="space-y-3">
				<h2 className="text-lg">Social Accounts</h2>
				<ProviderActions
					isLinked={Boolean(user?.google)}
					name="Google"
					onLink={update.link.google}
					onUnlink={async () => {
						if (!user?.google?.subject) {
							return;
						}
						await update.unlink.google(user.google.subject);
					}}
				/>
				<ProviderActions
					isLinked={Boolean(user?.twitter)}
					name="Twitter"
					onLink={update.link.twitter}
					onUnlink={async () => {
						if (!user?.twitter?.subject) {
							return;
						}
						await update.unlink.twitter(user.twitter.subject);
					}}
				/>
				<ProviderActions
					isLinked={Boolean(user?.github)}
					name="GitHub"
					onLink={update.link.github}
					onUnlink={async () => {
						if (!user?.github?.subject) {
							return;
						}
						await update.unlink.github(user.github.subject);
					}}
				/>
			</Panel>
		</DashboardShell>
	);
}

function ProviderActions(props: {
	isLinked: boolean;
	name: string;
	onLink: () => void;
	onUnlink: () => Promise<void>;
}) {
	return (
		<div className="flex items-center justify-between rounded-lg border border-border/70 bg-card/40 p-3">
			<p>{props.name}</p>
			{props.isLinked ? (
				<Button
					onClick={() =>
						toast.promise(props.onUnlink(), {
							loading: `Unlinking ${props.name}...`,
							success: `${props.name} unlinked`,
							error: `${props.name} unlink failed`,
						})
					}
					size="sm"
					variant="outline"
				>
					Unlink
				</Button>
			) : (
				<Button onClick={props.onLink} size="sm">
					Link
				</Button>
			)}
		</div>
	);
}
