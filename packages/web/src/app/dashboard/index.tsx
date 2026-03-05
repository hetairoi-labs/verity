import { createFileRoute } from "@tanstack/react-router";
import { BottomSection } from "./:components/bottom-section";
import { KpiSection } from "./:components/kpi-section";
import { PerformanceSection } from "./:components/performance-section";
import { Sidebar } from "./:components/sidebar";
import { TopNavbar } from "./:components/top-navbar";

export const Route = createFileRoute("/dashboard/")({
	component: NewDashPage,
});

function NewDashPage() {
	return (
		<div className="dark min-h-dvh bg-background p-3 text-foreground md:p-4">
			<div className="mx-auto w-full gap-4 lg:grid lg:grid-cols-[16rem_1fr]">
				<Sidebar />

				<main className="flex flex-col gap-4">
					<TopNavbar />
					<KpiSection />
					<PerformanceSection />
					<BottomSection />
				</main>
			</div>
		</div>
	);
}
