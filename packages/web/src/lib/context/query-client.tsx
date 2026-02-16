import {
	QueryClient,
	QueryClientProvider as QueryClientProviderBase,
} from "@tanstack/react-query";
import { getApiError } from "../utils/client-error";

// Tanstack Query
const queryClient = new QueryClient({
	defaultOptions: {
		mutations: {
			onError: (error) =>
				console.error(JSON.stringify(getApiError(error), null, 2)),
		},
	},
});

export function QueryClientProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<QueryClientProviderBase client={queryClient}>
			{children}
		</QueryClientProviderBase>
	);
}
