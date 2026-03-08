import { z } from "zod";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { parseUSDC } from "../utils/usdc";

export const listingSchema = z.object({
	title: z.string().min(1, "Title is required"),
	email: z.email("Invalid email format"),
	topic: z.string().min(1, "Topic is required"),
	description: z.string(),
	price: z.string().refine((val) => parseUSDC(val) >= parseUSDC("1"), {
		message: "Price must be at least 1 USDC",
	}),
	goals: z
		.array(z.string().min(1, "Goal cannot be empty"))
		.min(1, "At least one goal is required"),
});

export type ListingDraft = z.infer<typeof listingSchema>;

interface ListingDraftState {
	draft: ListingDraft;
	resetDraft: () => void;
	updateDraft: (updates: Partial<ListingDraft>) => void;
}

const initialDraft: ListingDraft = {
	title: "",
	email: "",
	topic: "",
	description: "",
	price: "1",
	goals: [""],
};

export const useListingDraftStore = create<ListingDraftState>()(
	persist(
		(set) => ({
			draft: initialDraft,
			updateDraft: (updates) =>
				set((state) => ({
					draft: { ...state.draft, ...updates },
				})),
			resetDraft: () => set({ draft: initialDraft }),
		}),
		{
			name: "listing-draft-storage",
		}
	)
);
