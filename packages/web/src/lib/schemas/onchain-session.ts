import { z } from "zod";

const zBigIntLike = z.union([z.bigint(), z.number(), z.string()]);
const zNumberLike = z.union([z.number(), z.bigint(), z.string()]);

export const onchainMeetingSchema = z
	.object({
		teacher: z.string(),
		learner: z.string(),
		amount: zBigIntLike.pipe(z.coerce.bigint()),
		status: zNumberLike.pipe(z.coerce.number()),
		confidenceBps: zNumberLike.pipe(z.coerce.number()),
		learningBps: zNumberLike.pipe(z.coerce.number()),
		teacherClaimable: zBigIntLike.pipe(z.coerce.bigint()),
		learnerRefundable: zBigIntLike.pipe(z.coerce.bigint()),
		evaluatedAt: zBigIntLike.pipe(z.coerce.bigint()),
		dataCID: z.string(),
		evidenceCID: z.string(),
	})
	.loose();

export const meetingEvidenceSchema = z.object({
	score: z.number(),
	reasoning: z.string(),
	improvements: z.array(z.string()),
});

export type OnchainMeeting = z.infer<typeof onchainMeetingSchema>;
export type MeetingEvidence = z.infer<typeof meetingEvidenceSchema>;
