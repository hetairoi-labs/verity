import {
	type LinkedAccountWithMetadata,
	useLogin,
	useLogout,
	usePrivy,
} from "@privy-io/react-auth";
import { useState } from "react";
import { useApi } from "../api/use-api";

export const useAuth = () => {
	const privy = usePrivy();
	const { logout } = useLogout();

	return {
		state: {
			ready: privy.ready,
			authenticated: privy.authenticated,
			user: privy.user,
			isModalOpen: privy.isModalOpen,
		},
		login: useLoginMutation(),
		update: {
			email: privy.updateEmail,
			phone: privy.updatePhone,
			link: {
				google: privy.linkGoogle,
				twitter: privy.linkTwitter,
				github: privy.linkGithub,
			},
			unlink: {
				google: privy.unlinkGoogle,
				twitter: privy.unlinkTwitter,
				github: privy.unlinkGithub,
			},
		},
		logout,
	};
};

type LoginResult = {
	isNewUser: boolean;
	wasAlreadyAuthenticated: boolean;
	loginMethod: string | null;
	loginAccount: LinkedAccountWithMetadata | null;
};

function useLoginMutation() {
	const [result, setResult] = useState<LoginResult | undefined>(undefined);
	const api = useApi();
	const registerUser = api.users.registerUser();

	const { login: mutate } = useLogin({
		onComplete(params) {
			const address = params.user.wallet?.address;
			const name = params.user.google?.name || undefined;
			if (!address) return;
			!params.wasAlreadyAuthenticated &&
				registerUser.mutate({
					address,
					name,
					method: String(params.loginMethod),
				});

			setResult({
				isNewUser: params.isNewUser,
				wasAlreadyAuthenticated: params.wasAlreadyAuthenticated,
				loginMethod: params.loginMethod,
				loginAccount: params.loginAccount,
			});
		},
	});

	return {
		mutate,
		result,
	};
}
