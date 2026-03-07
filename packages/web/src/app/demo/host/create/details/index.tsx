import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useReadContract } from "wagmi";
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
import { useEvmContext } from "@/src/lib/context/evm-context";
import DemoShell from "../../../:components/demo-shell";
import { activeSession } from "../../../:components/mock";

export const Route = createFileRoute("/demo/host/create/details/")({
	component: HostCreateDetailsPage,
});

function HostCreateDetailsPage() {
	const { contracts } = useEvmContext();
	const [listingIndexInput, setListingIndexInput] = useState("0");
	const [sessionIdInput, setSessionIdInput] = useState("0");

	const listingIndex = BigInt(Number(listingIndexInput) || 0);
	const sessionId = BigInt(Number(sessionIdInput) || 0);

	const listingsCount = useReadContract({
		address: contracts?.Manager.address,
		abi: contracts?.Manager.abi,
		functionName: "getListingsCount",
		query: { enabled: !!contracts },
	});
	const listing = useReadContract({
		address: contracts?.Manager.address,
		abi: contracts?.Manager.abi,
		functionName: "getListing",
		args: [listingIndex],
		query: { enabled: !!contracts },
	});
	const listings = useReadContract({
		address: contracts?.Manager.address,
		abi: contracts?.Manager.abi,
		functionName: "getListings",
		args: [0n, 10n],
		query: { enabled: !!contracts },
	});
	const sessionIdsByListing = useReadContract({
		address: contracts?.Manager.address,
		abi: contracts?.Manager.abi,
		functionName: "getSessionIdsByListing",
		args: [listingIndex, 0n, 10n],
		query: { enabled: !!contracts },
	});
	const sessionRegistryAddress = useReadContract({
		address: contracts?.Manager.address,
		abi: contracts?.Manager.abi,
		functionName: "sessionRegistry",
		query: { enabled: !!contracts },
	});
	const sessionCount = useReadContract({
		address: contracts?.SessionRegistry.address,
		abi: contracts?.SessionRegistry.abi,
		functionName: "getSessionCount",
		query: { enabled: !!contracts },
	});
	const session = useReadContract({
		address: contracts?.SessionRegistry.address,
		abi: contracts?.SessionRegistry.abi,
		functionName: "getSession",
		args: [sessionId],
		query: { enabled: !!contracts },
	});
	const disputeDeadline = useReadContract({
		address: contracts?.SessionRegistry.address,
		abi: contracts?.SessionRegistry.abi,
		functionName: "getDisputeDeadline",
		args: [sessionId],
		query: { enabled: !!contracts },
	});
	const isDisputeWindowOpen = useReadContract({
		address: contracts?.SessionRegistry.address,
		abi: contracts?.SessionRegistry.abi,
		functionName: "isDisputeWindowOpen",
		args: [sessionId],
		query: { enabled: !!contracts },
	});

	return (
		<DemoShell
			currentPath="/demo/host/create/details"
			description="Host creates the session pact with topic, duration, price, and platform."
			nextPath="/demo/host/create/goals"
			persona="Host"
			prevPath="/demo/host/dashboard"
			title="Create Session - Details"
		>
			<Card>
				<CardHeader>
					<CardTitle>Session Details Form</CardTitle>
					<CardDescription>Step 1 of host setup</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-3 md:grid-cols-2">
					<div className="space-y-1">
						<Label htmlFor="topic">Topic</Label>
						<Input defaultValue={activeSession.topic} id="topic" />
					</div>
					<div className="space-y-1">
						<Label htmlFor="duration">Duration (minutes)</Label>
						<Input
							defaultValue={String(activeSession.durationMinutes)}
							id="duration"
						/>
					</div>
					<div className="space-y-1">
						<Label htmlFor="price">Price (USDC)</Label>
						<Input defaultValue={String(activeSession.amountUsdc)} id="price" />
					</div>
					<div className="space-y-1">
						<Label htmlFor="platform">Platform</Label>
						<Input defaultValue={activeSession.platform} id="platform" />
					</div>
					<Button className="md:col-span-2">Save Session Details</Button>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Contract Reads (MVP)</CardTitle>
					<CardDescription>
						Expected getter usage with new ABI surface
					</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-3">
					<div className="grid gap-3 md:grid-cols-2">
						<div className="space-y-1">
							<Label htmlFor="listing-index">Listing Index</Label>
							<Input
								id="listing-index"
								onChange={(event) => setListingIndexInput(event.target.value)}
								value={listingIndexInput}
							/>
						</div>
						<div className="space-y-1">
							<Label htmlFor="session-id">Session ID</Label>
							<Input
								id="session-id"
								onChange={(event) => setSessionIdInput(event.target.value)}
								value={sessionIdInput}
							/>
						</div>
					</div>
					<pre className="overflow-auto rounded bg-background p-4 text-xs">
						{JSON.stringify(
							{
								manager: contracts?.Manager.address,
								sessionRegistry: {
									fromManager: sessionRegistryAddress.data,
									fromContracts: contracts?.SessionRegistry.address,
								},
								listings: {
									count: listingsCount.data,
									byIndex: listing.data,
									page0Limit10: listings.data,
									sessionIdsByListing: sessionIdsByListing.data,
								},
								sessions: {
									count: sessionCount.data,
									byId: session.data,
									disputeDeadline: disputeDeadline.data,
									isDisputeWindowOpen: isDisputeWindowOpen.data,
								},
								errors: {
									listingsCount: listingsCount.error?.message,
									listing: listing.error?.message,
									listings: listings.error?.message,
									sessionIdsByListing: sessionIdsByListing.error?.message,
									sessionRegistryAddress: sessionRegistryAddress.error?.message,
									sessionCount: sessionCount.error?.message,
									session: session.error?.message,
									disputeDeadline: disputeDeadline.error?.message,
									isDisputeWindowOpen: isDisputeWindowOpen.error?.message,
								},
							},
							(_, value) =>
								typeof value === "bigint" ? value.toString() : value,
							2
						)}
					</pre>
				</CardContent>
			</Card>
		</DemoShell>
	);
}
