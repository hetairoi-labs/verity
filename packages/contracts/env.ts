const envKeys = [
	"TESTNET_PRIVATE_KEY",
	"TESTNET_RPC_URL",
	"TESTNET_FORWARDER_ADDRESS",
] as const;

type ENV = Record<(typeof envKeys)[number], string>;

let env: ENV = {} as ENV;

export function ensureEnv() {
	for (const key of envKeys) {
		if (!Bun.env[key]) {
			throw new Error(`Environment variable ${key} is not set`);
		}
	}

	env = Object.fromEntries(envKeys.map((key) => [key, Bun.env[key]])) as ENV;
}
// const isProd =
// 	process.env.NODE_ENV === "production" || process.env.NODE_ENV === "prod";
// if (!isProd) ensureEnv();

const isProd =
	process.env.NODE_ENV === "production" || process.env.NODE_ENV === "prod";
if (!isProd) ensureEnv();

export default env;
