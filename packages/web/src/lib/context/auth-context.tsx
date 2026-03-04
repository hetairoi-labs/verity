import {
	type LinkedAccountWithMetadata,
	type LoginModalOptions,
	type User,
	useLogin,
	usePrivy,
} from "@privy-io/react-auth";
import { createContext, use, useState } from "react";
import { useRegisterUserMutation } from "../hooks/api/use-user-api";

type LoginResult = {
	isNewUser: boolean;
	wasAlreadyAuthenticated: boolean;
	loginMethod: string | null;
	loginAccount: LinkedAccountWithMetadata | null;
};

type AuthContextType = {
	state: {
		ready: boolean;
		authenticated: boolean;
		user: User | null;
		isModalOpen: boolean;
	};
	login: {
		mutate: (options?: LoginModalOptions) => void;
		result: LoginResult | undefined;
	};
	update: {
		email: (email: string) => void;
		phone: (phone: string) => void;
		link: {
			google: () => void;
			twitter: () => void;
			github: () => void;
		};
		unlink: {
			google: (subject: string) => Promise<User>;
			twitter: (subject: string) => Promise<User>;
			github: (subject: string) => Promise<User>;
		};
	};
	logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);
export function AuthProvider({ children }: { children: React.ReactNode }) {
	const privy = usePrivy();
	const registerUser = useRegisterUserMutation();
	const [loginResult, setLoginResult] = useState<LoginResult | undefined>(
		undefined,
	);

	const { login: loginMutation } = useLogin({
		onComplete(params) {
			const address = params.user.wallet?.address;
			const name = params.user.google?.name || undefined;
			if (!address) return;
			!params.wasAlreadyAuthenticated &&
				registerUser.mutate({
					name,
				});

			setLoginResult({
				isNewUser: params.isNewUser,
				wasAlreadyAuthenticated: params.wasAlreadyAuthenticated,
				loginMethod: params.loginMethod,
				loginAccount: params.loginAccount,
			});
		},
	});

	const value = {
		state: {
			ready: privy.ready,
			authenticated: privy.authenticated,
			user: privy.user,
			isModalOpen: privy.isModalOpen,
		},
		login: {
			mutate: loginMutation,
			result: loginResult,
		},
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
		logout: privy.logout,
	};

	return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth() {
	const context = use(AuthContext);

	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}

	return context;
}
