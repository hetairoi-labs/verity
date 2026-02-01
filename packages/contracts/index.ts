import CounterArtifact from "./artifacts/contracts/Counter.sol/Counter.json";

export const artifacts = { Counter: CounterArtifact } as const;
export const abi = { Counter: CounterArtifact.abi } as const;
