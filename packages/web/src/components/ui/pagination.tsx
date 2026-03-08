import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";

export interface PaginationProps {
	className?: string;
	currentPage: number;
	hasNext: boolean;
	hasPrev: boolean;
	onPageChange: (page: number) => void;
}

export function Pagination({
	className,
	currentPage,
	hasNext,
	hasPrev,
	onPageChange,
}: PaginationProps) {
	return (
		<nav
			aria-label="Pagination"
			className={cn("flex items-center justify-end gap-2", className)}
		>
			<Button
				aria-label="Previous page"
				disabled={!hasPrev}
				onClick={() => onPageChange(Math.max(1, currentPage - 1))}
				variant="outline"
			>
				<CaretLeftIcon />
			</Button>
			<p aria-current="page" className="p-2 text-muted-foreground text-sm">
				{currentPage}
			</p>
			<Button
				aria-label="Next page"
				disabled={!hasNext}
				onClick={() => onPageChange(currentPage + 1)}
				variant="outline"
			>
				<CaretRightIcon />
			</Button>
		</nav>
	);
}
