import { getContracts } from "@verity/contracts";
import {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { useWalletClient } from "wagmi";

export type KXContracts = ReturnType<typeof getContracts>;

export interface IEvmContext {
	contracts: KXContracts | undefined;
	ready: boolean;
}

const EvmContext = createContext<IEvmContext>({
	contracts: undefined,
	ready: false,
});

export function EvmProvider(props: { children: React.ReactNode }) {
	const { children } = props;

	const [contracts, setContracts] = useState<KXContracts | undefined>(
		undefined
	);
	const [ready, setReady] = useState(false);

	console.log(contracts?.Manager.address);

	const { data: wallet } = useWalletClient();

	const flag = useRef(false);

	useEffect(() => {
		if (!flag.current && wallet) {
			flag.current = true;
			const kxContracts = getContracts("test", wallet);
			setContracts(kxContracts);
			setReady(true);
		} else {
			setReady(true);
		}
	}, [wallet]);

	const value: IEvmContext = useMemo(
		() => ({
			ready,
			contracts,
		}),
		[ready, contracts]
	);

	return <EvmContext.Provider value={value}>{children}</EvmContext.Provider>;
}

export function useEvmContext() {
	return useContext(EvmContext);
}
