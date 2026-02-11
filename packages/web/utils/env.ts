import { z } from "zod";

// env schema
const envSchema = z.object({
	// client & server
	PUBLIC_APP_URL: z.url(),
	PUBLIC_GA_ID: z.string().optional(),
	PUBLIC_PRIVY_APP_ID: z.string().min(1, "PRIVY_APP_ID is required"),

	// server only
	PORT: z.coerce.number().int().positive("PORT must be a positive integer"),
	PRIVY_APP_SECRET: z.string().min(1, "PRIVY_APP_SECRET is required"),
	DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
	GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID is required"),
	GOOGLE_CLIENT_SECRET: z.string().min(1, "GOOGLE_CLIENT_SECRET is required"),
	PUBLIC_GEMINI_API_KEY: z.string().min(1, "GEMINI_API_KEY is required"),
	RECALL_API_URL: z.url(),
	RECALL_API_KEY: z.string().min(1, "RECALL_API_KEY is required"),
});
type EnvSchema = z.infer<typeof envSchema>;

// declare env for process.env intellisense
declare module "bun" {
	interface Env extends EnvSchema {}
}

// validate env
export function validateEnv() {
	try {
		const parsedEnv = envSchema.parse(Bun.env);
		console.log("🔑 Environment validated successfully");
		return parsedEnv;
	} catch (error) {
		if (error instanceof z.ZodError) {
			const errorMessages = error.issues
				.map((err) => `${err.path.join(".")}: ${err.message}`)
				.join("\n");
			throw new Error(`Environment validation failed:\n${errorMessages}`);
		}
		throw error;
	}
}

export type { EnvSchema };
