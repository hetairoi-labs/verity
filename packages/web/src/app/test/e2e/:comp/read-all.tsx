import { useState } from "react";
import { useReadContract } from "wagmi";
import type { ListingWithMetadata } from "@/api/handlers/sessions";
import { TestCard } from "@/src/components/custom/test-card";
import { Input } from "@/src/components/ui/input";
import type { KXContracts } from "@/src/lib/context/evm-context";
import { serializeWithBigInt } from "@/src/lib/utils";
import { ReadDiv, useFetchFromCid } from "./utils";

export function ReadAll({ contracts }: { contracts: KXContracts }) {
	const [listingIndexInput, setListingIndexInput] = useState("0");
	const [sessionIdInput, setSessionIdInput] = useState("0");

	const listingIndex = BigInt(Number(listingIndexInput) || 0);
	const sessionId = BigInt(Number(sessionIdInput) || 0);

	const { data: listingsCount, error: listingsCountError } = useReadContract({
		address: contracts.Manager.address,
		abi: contracts.Manager.abi,
		functionName: "getListingsCount",
	});
	const { data: listing, error: listingError } = useReadContract({
		address: contracts.Manager.address,
		abi: contracts.Manager.abi,
		functionName: "getListing",
		args: [listingIndex],
	});
	const { data: listingPage, error: listingPageError } = useReadContract({
		address: contracts.Manager.address,
		abi: contracts.Manager.abi,
		functionName: "getListings",
		args: [0n, 10n],
	});
	const { data: sessionIdsByListing, error: sessionIdsByListingError } =
		useReadContract({
			address: contracts.Manager.address,
			abi: contracts.Manager.abi,
			functionName: "getSessionIdsByListing",
			args: [listingIndex, 0n, 10n],
		});
	const { data: sessionRegistryAddress, error: sessionRegistryAddressError } =
		useReadContract({
			address: contracts.Manager.address,
			abi: contracts.Manager.abi,
			functionName: "sessionRegistry",
		});

	const { data: sessionCount, error: sessionCountError } = useReadContract({
		address: contracts.SessionRegistry.address,
		abi: contracts.SessionRegistry.abi,
		functionName: "getSessionCount",
	});
	const { data: session, error: sessionError } = useReadContract({
		address: contracts.SessionRegistry.address,
		abi: contracts.SessionRegistry.abi,
		functionName: "getSession",
		args: [sessionId],
	});
	const { data: disputeDeadline, error: disputeDeadlineError } =
		useReadContract({
			address: contracts.SessionRegistry.address,
			abi: contracts.SessionRegistry.abi,
			functionName: "getDisputeDeadline",
			args: [sessionId],
		});
	const { data: isDisputeWindowOpen, error: isDisputeWindowOpenError } =
		useReadContract({
			address: contracts.SessionRegistry.address,
			abi: contracts.SessionRegistry.abi,
			functionName: "isDisputeWindowOpen",
			args: [sessionId],
		});

	const { data: metadata } = useFetchFromCid<ListingWithMetadata>(
		listing?.dataCID?.toString()
	);

	const disputeWindowOpenLabel =
		isDisputeWindowOpen === undefined ? "-" : isDisputeWindowOpen.toString();

	return (
		<TestCard description="Read all" title="Read all contract data">
			<div className="grid gap-2 md:grid-cols-2">
				<Input
					onChange={(event) => setListingIndexInput(event.target.value)}
					placeholder="Listing index"
					value={listingIndexInput}
				/>
				<Input
					onChange={(event) => setSessionIdInput(event.target.value)}
					placeholder="Session id"
					value={sessionIdInput}
				/>
			</div>

			<ReadDiv title="manager.getListingsCount">
				<p>{listingsCount?.toString() ?? "-"}</p>
				{listingsCountError?.message && <p>{listingsCountError.message}</p>}
			</ReadDiv>

			<ReadDiv title="manager.getListing(index)">
				<pre>{serializeWithBigInt(listing)}</pre>
				<pre>Metadata: {serializeWithBigInt(metadata)}</pre>
				{listingError?.message && <p>{listingError.message}</p>}
			</ReadDiv>

			<ReadDiv title="manager.getListings(0, 10)">
				<pre>{serializeWithBigInt(listingPage)}</pre>
				{listingPageError?.message && <p>{listingPageError.message}</p>}
			</ReadDiv>

			<ReadDiv title="manager.getSessionIdsByListing(index, 0, 10)">
				<pre>{serializeWithBigInt(sessionIdsByListing)}</pre>
				{sessionIdsByListingError?.message && (
					<p>{sessionIdsByListingError.message}</p>
				)}
			</ReadDiv>

			<ReadDiv title="manager.sessionRegistry">
				<p>{sessionRegistryAddress?.toString() ?? "-"}</p>
				{sessionRegistryAddressError?.message && (
					<p>{sessionRegistryAddressError.message}</p>
				)}
			</ReadDiv>

			<ReadDiv title="sessionRegistry.getSessionCount">
				<p>{sessionCount?.toString() ?? "-"}</p>
				{sessionCountError?.message && <p>{sessionCountError.message}</p>}
			</ReadDiv>

			<ReadDiv title="sessionRegistry.getSession(id)">
				<pre>{serializeWithBigInt(session)}</pre>
				{sessionError?.message && <p>{sessionError.message}</p>}
			</ReadDiv>

			<ReadDiv title="sessionRegistry.getDisputeDeadline(id)">
				<p>{disputeDeadline?.toString() ?? "-"}</p>
				{disputeDeadlineError?.message && <p>{disputeDeadlineError.message}</p>}
			</ReadDiv>

			<ReadDiv title="sessionRegistry.isDisputeWindowOpen(id)">
				<p>{disputeWindowOpenLabel}</p>
				{isDisputeWindowOpenError?.message && (
					<p>{isDisputeWindowOpenError.message}</p>
				)}
			</ReadDiv>
		</TestCard>
	);
}
