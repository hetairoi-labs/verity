import logo from "@assets/logo.svg";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Button } from "@/src/components/ui/button";

export default function NotFoundPage() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center p-8">
			<motion.div
				animate={{ opacity: 1, y: 0 }}
				className="flex max-w-lg flex-col items-center gap-6 text-center"
				initial={{ opacity: 0, y: 20 }}
				transition={{ duration: 0.3, ease: "easeOut" }}
			>
				<div className="space-y-4">
					<img
						alt="Logo"
						className="mx-auto mb-4 h-20 w-20 object-contain drop-shadow-md md:h-24 md:w-24 lg:h-28 lg:w-28"
						height={80}
						src={logo}
						width={80}
					/>
					<p className="text-muted-foreground/80 text-xs uppercase tracking-[0.17em]">
						Oops, page not found
					</p>
					<p className="text-lg text-muted-foreground md:text-xl">
						The page you&apos;re looking for has hopped away or never existed.
					</p>
				</div>

				<div className="mt-2 flex flex-wrap items-center justify-center gap-3">
					<Button className="px-6" size="lg" variant="default">
						<Link to="/">Back to home</Link>
					</Button>
				</div>
			</motion.div>
		</div>
	);
}
