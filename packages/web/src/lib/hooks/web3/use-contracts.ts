import { useEvmContext } from "../../context/evmContext";

export function useContracts() {
	const { contracts } = useEvmContext();

	return contracts;
}
