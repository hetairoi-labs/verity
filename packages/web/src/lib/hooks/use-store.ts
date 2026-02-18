import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Schema } from "@/api/lib/db/schema";

type User = Schema["users"];

interface UserStore {
	user?: User;
	setUser: (user: User | undefined) => void;
}

export const useUserStore = create<UserStore>()(
	persist(
		(set) => ({
			user: undefined,
			setUser: (user: User | undefined) => set({ user }),
		}),
		{ name: "user" },
	),
);
