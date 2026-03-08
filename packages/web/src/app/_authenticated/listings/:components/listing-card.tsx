import cardImage from "@/src/assets/card.webp";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useGetSessionByIdQuery } from "@/src/lib/hooks/api/use-sessions-api";
import { formatUSDC } from "@/src/lib/utils/usdc";

interface ListingCardProps {
	listingId: string | number;
}

export function ListingCard({ listingId }: ListingCardProps) {
	const { data: sessionData, isPending } = useGetSessionByIdQuery({
		sessionId: String(listingId),
	});

	const session = sessionData;
	const goals = session?.goals ?? [];

	if (isPending || listingId === undefined) {
		return (
			<div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/50 bg-card/30">
				<Skeleton className="aspect-square rounded-none" />
				<div className="flex flex-1 flex-col space-y-4 p-5">
					<Skeleton className="h-6 w-3/4" />
					<Skeleton className="h-4 w-full" />
					<div className="flex gap-2">
						<Skeleton className="h-4 w-12" />
						<Skeleton className="h-4 w-12" />
					</div>
					<div className="mt-auto flex justify-between border-border/40 border-t pt-4">
						<Skeleton className="h-4 w-10" />
						<Skeleton className="h-6 w-20" />
					</div>
				</div>
			</div>
		);
	}

	if (!session) {
		return null;
	}

	return (
		<div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/50 bg-card/30 transition-all hover:border-border/80 hover:bg-card/50">
			{/* Image Container */}
			<div className="relative aspect-square overflow-hidden">
				<img
					alt={session.title ?? ""}
					className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
					height={400}
					src={cardImage}
					width={400}
				/>
				{/* Top Badge */}
				<div className="absolute top-4 left-4">
					<span className="rounded-full bg-background/80 px-3 py-1 font-medium text-[10px] uppercase tracking-wider backdrop-blur-md">
						New
					</span>
				</div>
			</div>

			{/* Content */}
			<div className="flex flex-1 flex-col p-5">
				<div className="mb-4 flex-1">
					<h3 className="mb-1 font-medium text-xl leading-tight tracking-tight">
						{session.title}
					</h3>
					<p className="line-clamp-2 text-muted-foreground text-sm leading-relaxed">
						{session.topic}
					</p>
				</div>

				{/* Goals */}
				{goals.length > 0 && (
					<div className="mb-4 flex flex-wrap gap-1.5">
						{goals.slice(0, 3).map((goal) => (
							<span
								className="rounded-md bg-muted/50 px-2 py-0.5 text-[10px] text-muted-foreground"
								key={goal.id}
							>
								{goal.name}
							</span>
						))}
					</div>
				)}

				{/* Footer/Price */}
				<div className="mt-auto flex items-center justify-between border-border/40 border-t pt-4">
					<p className="text-muted-foreground text-xs uppercase tracking-widest">
						Price
					</p>
					<div className="rounded-lg bg-foreground px-3 py-1.5 text-background">
						<span className="font-semibold text-sm">
							{formatUSDC(BigInt(session.price ?? "0"))} USDC
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
