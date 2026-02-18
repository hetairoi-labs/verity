import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";

export function usePrivyToken() {
	const { ready, authenticated, getAccessToken } = usePrivy();
	const [token, setToken] = useState<string | null>(null);

	useEffect(() => {
		if (!ready || !authenticated) return setToken(null);
		let cancelled = false;
		getAccessToken().then((t) => !cancelled && setToken(t));
		return () => {
			cancelled = true;
		};
	}, [ready, authenticated, getAccessToken]);

	return token;
}
