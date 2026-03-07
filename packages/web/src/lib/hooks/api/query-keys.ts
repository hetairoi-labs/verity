export interface PaginationParams {
	limit?: number | string | string[];
	page?: number | string | string[];
}

const toKeyValue = (value: number | string | string[]) =>
	Array.isArray(value) ? (value[0] ?? "") : String(value);

export const qk = {
	sessions: {
		root: () => ["sessions"] as const,
		all: (params?: PaginationParams) => ["sessions", "all", params] as const,
		host: (params?: PaginationParams) => ["sessions", "host", params] as const,
		byId: (id: number | string | string[]) =>
			["sessions", "by-id", toKeyValue(id)] as const,
		history: (params?: PaginationParams) =>
			["sessions", "history", params] as const,
		metrics: () => ["sessions", "metrics"] as const,
	},
	meetings: {
		root: () => ["meetings"] as const,
		bySession: (
			sessionId: number | string | string[],
			params?: PaginationParams
		) => ["meetings", "session", toKeyValue(sessionId), params] as const,
		byId: (meetingId: number | string | string[]) =>
			["meetings", "by-id", toKeyValue(meetingId)] as const,
	},
	web3: {
		usdtBalance: (address?: string) =>
			["evm", "usdt-balance", address] as const,
	},
} as const;
