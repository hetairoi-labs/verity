import { usePrivy } from "@privy-io/react-auth";
import { useQuery } from "@tanstack/react-query";

export function usePrivyToken() {
	const { authenticated, getAccessToken, ready } = usePrivy();

	const { data } = useQuery({
		queryKey: ["auth", "privy-token"],
		queryFn: async () => (await getAccessToken()) ?? null,
		enabled: ready && authenticated,
		staleTime: 60_000,
	});

	return data ?? null;
}
