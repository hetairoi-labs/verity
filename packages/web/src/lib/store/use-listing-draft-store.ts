import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ListingDraft {
	description: string;
	email: string;
	goals: string[];
	price: string;
	title: string;
	topic: string;
}

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
