import { getContracts } from "@verity/contracts";
import { useEffect, useState } from "react";
import { useWalletClient } from "wagmi";

export function useContracts() {
	const { data: walletClient } = useWalletClient();
	const [contracts, setContracts] = useState<ReturnType<typeof getContracts>>();

	useEffect(() => {
		if (!walletClient) {
			return;
		}
		const contractInstances = getContracts("test", walletClient);
		setContracts(contractInstances);
	}, [walletClient]);

	return {
		contracts,
		isLoading: !contracts,
	};
}
