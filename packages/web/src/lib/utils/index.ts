import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function truncateText(text: string, length = 20) {
	if (text.length <= length) {
		return text;
	}
	return `${text.slice(0, length)}...`;
}

export function truncateAddress(address: string, length = 6) {
	return `${address.slice(0, length)}...${address.slice(-length)}`;
}

export function serializeWithBigInt(obj: unknown): string {
	return JSON.stringify(
		obj,
		(_key, value) => {
			if (typeof value === "bigint") {
				return value.toString();
			}
			return value;
		},
		2
	);
}
