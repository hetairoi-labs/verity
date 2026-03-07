import { useQuery } from "@tanstack/react-query";
import { useReadContract } from "wagmi";
import type { ListingWithMetadata } from "@/api/handlers/sessions";
import { TestCard } from "@/src/components/custom/test-card";
import type { KXContracts } from "@/src/lib/context/evm-context";
import { toGatewayUrl } from "@/src/lib/utils/pinata";

export function ReadAll({ contracts }: { contracts: KXContracts }) {
	const index = 3;
	const { data: listings } = useReadContract({
		address: contracts.Manager.address,
		abi: contracts.Manager.abi,
		functionName: "listings",
		args: [BigInt(index)],
	});
	const { data: metadata } = useFetchFromCid<ListingWithMetadata>(
		listings?.[2]?.toString()
	);

	return (
		<TestCard description="Read all" title="Read all contract data">
			{listings && (
				<ReadDiv title="listings">
					<p>Index: {index}</p>
					<p>Host: {listings[0]?.toString()}</p>
					<p>Price: {listings[1]?.toString()}</p>
					<p>Data CID: {listings[2]?.toString()}</p>
					<pre>Metadata: {JSON.stringify(metadata, null, 2)}</pre>
				</ReadDiv>
			)}
		</TestCard>
	);
}

function ReadDiv({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	return (
		<>
			<p className="font-mono text-sm uppercase">{title}:</p>
			<div className="flex flex-col gap-2 overflow-scroll rounded bg-background p-4">
				{children}
			</div>
		</>
	);
}

function useFetchFromCid<T>(cid: string | undefined) {
	return useQuery({
		queryKey: ["fetchFromCid", cid],
		queryFn: async () => {
			if (!cid) {
				return undefined;
			}
			console.log("fetching from cid", cid);
			const response = await fetch(toGatewayUrl(cid));
			return response.json() as Promise<T>;
		},
		enabled: !!cid,
	});
}
