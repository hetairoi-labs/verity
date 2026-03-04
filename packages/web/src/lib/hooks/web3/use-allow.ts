import { useWriteContract } from "wagmi";

export function useApprove() {
	const { mutateAsync: approve, data: allowance } = useWriteContract();
	return { approve, allowance };
}
