import { CoinIcon } from "@phosphor-icons/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useConnection } from "wagmi";
import { DashboardShell } from "@/src/app/_authenticated/dashboard/:components/dashboard-shell";
import { Panel } from "@/src/app/_authenticated/dashboard/:components/panel";
import { Button } from "@/src/components/ui/button";
import { useFaucetMutation } from "@/src/lib/hooks/api/use-evm-api";
import {
	useGetDashboardMetricsQuery,
	useGetHostSessionsQuery,
} from "@/src/lib/hooks/api/use-sessions-api";
import { useUsdtBalance } from "@/src/lib/hooks/web3/use-usdt-balance";
import { formatUSDC } from "@/src/lib/utils/usdc";
import { CreateListingModal } from "../listings/:components/create-listing-modal";
import { ListingCard } from "../listings/:components/listing-card";

export const Route = createFileRoute("/_authenticated/dashboard/")({
	component: DashboardPage,
});

function DashboardPage() {
	const { data: metrics, isLoading: isMetricsLoading } =
		useGetDashboardMetricsQuery();
	const { data: sessions, isLoading: isSessionsLoading } =
		useGetHostSessionsQuery({
			page: "1",
			limit: "20",
		});

	return (
		<DashboardShell
			description="Manage hosted listings and sessions with live API metrics."
			title="Dashboard"
		>
			<section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<MetricCard label="Total Listings" value={metrics?.totalListings} />
				<MetricCard label="Meetings Scheduled" value={metrics?.totalMeetings} />
				<MetricCard
					label="Earnings Potential"
					value={
						metrics?.totalEarningsUSDC != null
							? formatUSDC(BigInt(Math.round(metrics.totalEarningsUSDC)))
							: undefined
					}
				/>
				<MetricCard
					label="Average Listing Price"
					value={
						metrics?.averagePriceUSDC != null
							? formatUSDC(BigInt(Math.round(metrics.averagePriceUSDC)))
							: undefined
					}
				/>
			</section>

			<FaucetPanel />

			<Panel className="space-y-3">
				<div className="flex items-center justify-between">
					<h2 className="text-lg">Your Listings</h2>
					<CreateListingModal />
				</div>
				{isMetricsLoading || isSessionsLoading ? (
					<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
						<ListingCard listingId={0} />
						<ListingCard listingId={0} />
						<ListingCard listingId={0} />
					</div>
				) : null}
				<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
					{(sessions ?? []).map((session) => (
						<Link
							key={session.id}
							params={{ id: String(session.id) }}
							to="/listings/$id"
						>
							<ListingCard listingId={session.id} />
						</Link>
					))}
				</div>

				{!isSessionsLoading && (sessions?.length ?? 0) === 0 ? (
					<div className="flex min-h-72 flex-col items-center justify-center gap-2">
						<h1 className="text-2xl">No listings yet</h1>
						<p className="mb-2 text-muted-foreground text-sm">
							You don't have any listings yet. Create one to get started.
						</p>
						<CreateListingModal />
					</div>
				) : null}
			</Panel>
		</DashboardShell>
	);
}

function MetricCard({
	label,
	value,
}: {
	label: string;
	value?: number | string;
}) {
	return (
		<Panel className="py-8">
			<p className="text-muted-foreground text-sm">{label}</p>
			<p className="mt-2 text-3xl">{value ?? "-"}</p>
		</Panel>
	);
}

function FaucetPanel() {
	const { address } = useConnection();
	const faucet = useFaucetMutation();
	const { balance, isLoading: isBalanceLoading } = useUsdtBalance();
	const [claimed, setClaimed] = useState(false);

	async function handleClaimFaucet() {
		if (!address || balance === undefined || balance >= 1_000_000n) {
			return;
		}

		await faucet.mutateAsync(
			{ address },
			{
				onSuccess: () => {
					setClaimed(true);
				},
			}
		);

		toast.success("USDC added to your wallet");
	}

	const hasEnoughBalance = balance !== undefined && balance >= 1_000_000n;
	const isDisabled =
		faucet.isPending ||
		claimed ||
		!address ||
		isBalanceLoading ||
		hasEnoughBalance;

	const getButtonLabel = () => {
		if (faucet.isPending) {
			return "Claiming...";
		}
		if (faucet.isSuccess) {
			return "Claimed";
		}
		return "Claim USDC";
	};

	return (
		<Panel className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div className="flex items-center gap-4">
				<div className="grid size-14 place-items-center rounded-lg bg-primary">
					<CoinIcon className="size-full -rotate-45 p-3 text-primary-foreground" />
				</div>
				<div className="">
					<h2 className="font-medium text-xl">Claim test USDC</h2>
					<p className="text-muted-foreground text-sm">
						Top up your wallet with test USDC for trying out bookings and
						payouts.
					</p>
				</div>
			</div>
			<div className="flex flex-col items-center gap-4">
				<Button
					className="w-full sm:w-auto"
					disabled={isDisabled}
					onClick={handleClaimFaucet}
				>
					{getButtonLabel()}
				</Button>
			</div>
		</Panel>
	);
}
