import { Hono } from "hono";
import { requireAuth } from "../lib/middleware/auth";
import { respond } from "../lib/utils/hono/respond";

const goalsRoute = new Hono().use(requireAuth).get("/", (c) => {
	return respond.ok(c, 200, "Goals fetched successfully", {});
});

export default goalsRoute;
export type GoalsType = typeof goalsRoute;
