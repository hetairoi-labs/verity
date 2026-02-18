import { useLinkAccount, useLogin, useLogout } from "@privy-io/react-auth";
import { useApi } from "../api/use-api";

export const useAuth = () => {
	const registerUser = useApi().registerUser;
	const { login } = useLogin({
		onComplete(params) {
			const address = params.user.wallet?.address;
			const name = params.user.google?.name || undefined;
			if (!address) return;
			params.isNewUser && registerUser.mutate({ address, name });
		},
	});
	const { logout } = useLogout();
	return {
		login,
		logout,
		linkAccount: useLinkAccount(),
	};
};
