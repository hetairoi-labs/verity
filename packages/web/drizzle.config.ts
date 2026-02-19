import { defineConfig } from "drizzle-kit";

export default defineConfig({
	dialect: "sqlite",
	schema: "./api/lib/db/schema",
	casing: "snake_case",
	dbCredentials: {
		url: process.env.DATABASE_URL,
	},
});
