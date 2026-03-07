import {
	QueryClient,
	QueryClientProvider as QueryClientProviderBase,
} from "@tanstack/react-query";
import { ErrorHandler } from "../errors/handler";
import { createHmrInstance } from "../utils/hmr";

const queryClient = createHmrInstance(
	"queryClient",
	() =>
		new QueryClient({
			defaultOptions: {
				mutations: {
					onError: (error) => {
						ErrorHandler.getInstance().handleError(error);
					},
				},
			},
		})
);

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
