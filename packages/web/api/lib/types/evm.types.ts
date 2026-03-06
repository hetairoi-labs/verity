import z from "zod";

export const zListingDataSchema = z.object({
	metadata: z.string(),
	topic: z.string(),
	price: z.number(),
	goals: z.array(z.object({ name: z.string(), weight: z.number() })),
});
export type ListingData = z.infer<typeof zListingDataSchema>;
