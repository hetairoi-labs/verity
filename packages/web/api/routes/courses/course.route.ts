import { and, eq, sql } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import { db } from "@/api/lib/db";
import { schema, views } from "@/api/lib/db/schema";
import { softCascade } from "@/api/lib/db/utils/cascade";
import { ApiError } from "@/api/lib/utils/hono/error";
import { respond } from "@/api/lib/utils/hono/respond";
import { safeQuery } from "@/api/lib/utils/safe";
import { validator } from "@/api/lib/utils/zod";
import { requireAuth } from "@/api/middleware/auth";

const { courses, goals, sessions } = schema;
const activeCourses = views.activeCourses;

const courseRoute = new Hono()
	.use(requireAuth)
	.get(
		"/",
		validator(
			"query",
			z.object({
				page: z.coerce.number().default(1),
				limit: z.coerce.number().default(5),
			}),
		),
		async (c) => {
			const { page, limit } = c.req.valid("query");
			const userId = c.var.user.user_id;
			const offset = (page - 1) * limit;
			const data = await safeQuery(
				db
					.select()
					.from(activeCourses)
					.where(eq(activeCourses.authorId, userId))
					.limit(limit)
					.offset(offset),
			);
			if (data.length === 0) throw new ApiError(404, "No courses found");
			return respond.ok(c, 200, "Courses fetched successfully", {
				page,
				limit,
				courses: data,
			});
		},
	)
	.get(
		"/:id",
		validator("param", z.object({ id: z.coerce.number() })),
		async (c) => {
			const { id } = c.req.valid("param");
			const userId = c.var.user.user_id;
			const data = await safeQuery(
				db
					.select()
					.from(activeCourses)
					.where(
						and(eq(activeCourses.id, id), eq(activeCourses.authorId, userId)),
					),
			);
			if (data.length === 0) throw new ApiError(404, "Course not found");
			return respond.ok(c, 200, `Course ${id} fetched successfully`, {
				course: data[0],
			});
		},
	)
	.post(
		"/",
		validator(
			"json",
			z.object({
				title: z.string().min(1, "Title is required"),
				desc: z.string().min(1, "Description is required").optional(),
			}),
		),
		async (c) => {
			const { title, desc } = c.req.valid("json");
			const userId = c.var.user.user_id;
			const data = await safeQuery(
				db
					.insert(courses)
					.values({ title, desc, authorId: userId })
					.returning(),
			);
			return respond.ok(c, 201, "Course created successfully", {
				course: data[0],
			});
		},
	)
	.patch(
		"/:id",
		validator("param", z.object({ id: z.coerce.number() })),
		validator(
			"json",
			z
				.object({
					title: z.string().min(1, "Title is required").optional(),
					desc: z.string().min(1, "Description is required").optional(),
				})
				.refine(
					(data) => Object.values(data).some((value) => value !== undefined),
					{
						message: "At least one field must be provided",
					},
				),
		),
		async (c) => {
			const { id } = c.req.valid("param");
			const json = c.req.valid("json");
			const userId = c.var.user.user_id;

			const updateData = Object.fromEntries(
				Object.entries(json).filter(([_, value]) => value !== undefined),
			);

			const result = await safeQuery(
				db
					.update(courses)
					.set({ ...updateData, updatedAt: sql`CURRENT_TIMESTAMP` })
					.where(
						and(
							eq(courses.id, id),
							eq(courses.authorId, userId),
							sql`${courses.deletedAt} IS NULL`,
						),
					)
					.returning(),
			);

			if (result.length === 0) throw new ApiError(404, "Course not found");

			return respond.ok(c, 200, "Course updated successfully", {
				course: result[0],
			});
		},
	)
	.delete(
		"/:id",
		validator("param", z.object({ id: z.coerce.number() })),
		async (c) => {
			const { id } = c.req.valid("param");
			const userId = c.var.user.user_id;
			const [course] = await safeQuery(
				db
					.select()
					.from(activeCourses)
					.where(
						and(eq(activeCourses.id, id), eq(activeCourses.authorId, userId)),
					),
			);
			if (!course) throw new ApiError(404, "Course not found");
			await softCascade(db, courses, id, [
				{
					table: sessions,
					foreignKeyField: sessions.courseId,
					children: [{ table: goals, foreignKeyField: goals.sessionId }],
				},
			]);
			return respond.ok(c, 200, "Course deleted successfully");
		},
	);

export default courseRoute;
export type CourseType = typeof courseRoute;
