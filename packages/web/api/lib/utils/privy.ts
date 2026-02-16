import { PrivyClient } from "@privy-io/node";
import { env } from "@/lib/utils/env";

export const privy = new PrivyClient({
	appId: env.PUBLIC_PRIVY_APP_ID,
	appSecret: env.PRIVY_APP_SECRET,
});
