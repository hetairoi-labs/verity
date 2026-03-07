import { useQuery } from "@tanstack/react-query";
import { toGatewayUrl } from "@/src/lib/utils/pinata";

export function ReadDiv({
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

export function useFetchFromCid<T>(cid: string | undefined) {
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
