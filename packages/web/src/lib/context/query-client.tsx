import {
	QueryClient,
	QueryClientProvider as QueryClientProviderBase,
} from "@tanstack/react-query";
import { ErrorHandler } from "../errors/handler";

const createQueryClient = () =>
	new QueryClient({
		defaultOptions: {
			mutations: {
				onError: (error) => {
					ErrorHandler.getInstance().handleError(error);
				},
			},
		},
	});

let queryClient: QueryClient;
if (import.meta.hot) {
	if (!import.meta.hot.data.queryClient) {
		import.meta.hot.data.queryClient = createQueryClient();
	}
	queryClient = import.meta.hot.data.queryClient;
} else {
	queryClient = createQueryClient();
}

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
