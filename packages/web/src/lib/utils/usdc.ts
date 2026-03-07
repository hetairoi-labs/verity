import { formatUnits, parseUnits } from "viem";

const USDC_DECIMALS = 6;

export function parseUSDC(value: string): bigint {
	return parseUnits(value, USDC_DECIMALS);
}

export function formatUSDC(value: bigint): string {
	return formatUnits(value, USDC_DECIMALS);
}
