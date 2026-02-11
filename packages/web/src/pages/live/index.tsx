import { motion } from "motion/react";
import Layout from "../layout";

export function LivePage() {
	return (
		<Layout className="flex flex-col items-center justify-center h-screen p-8">
			<motion.div
				className="rounded-full size-48 bg-foreground animate-pulse"
				initial={{ scale: 0 }}
				animate={{ scale: 1 }}
				transition={{ duration: 0.4, type: "spring", bounce: 0.6 }}
				whileHover={{ scale: 1.5 }}
			/>
		</Layout>
	);
}
