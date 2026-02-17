import {
	QueryClient,
	QueryClientProvider as QueryClientProviderBase,
} from "@tanstack/react-query";
import { ErrorHandler } from "../errors/handler";

// Tanstack Query – mutations route to global handler (queries.onError removed in v5)
const queryClient = new QueryClient({
	defaultOptions: {
		mutations: {
			onError: (error) => {
				ErrorHandler.getInstance().handleError(error);
			},
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
