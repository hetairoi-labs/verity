import { useQuery } from "@tanstack/react-query";
import { useConnection } from "wagmi";
import { useEvmContext } from "@/src/lib/context/evm-context";
import { qk } from "../api/query-keys";

export function useUsdtBalance() {
	const { address } = useConnection();
	const { contracts, ready } = useEvmContext();

	const { data, isLoading, isFetching, refetch } = useQuery({
		queryKey: qk.web3.usdtBalance(address),
		enabled: ready && Boolean(address && contracts),
		queryFn: async () => {
			if (!(address && contracts)) {
				return undefined;
			}

			const result = await contracts.USDC.read.balanceOf([address]);
			return result;
		},
		staleTime: 30_000,
	});

	return {
		balance: data,
		isLoading: isLoading || isFetching,
		refetch,
	};
}
