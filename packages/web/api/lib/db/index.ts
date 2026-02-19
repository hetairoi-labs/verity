import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";

const sqlite = new Database(process.env.DATABASE_URL || "sqlite.db");
const db = drizzle({
	client: sqlite,
	casing: "snake_case",
});
export { db };
