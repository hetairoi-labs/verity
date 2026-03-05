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
			<div className="mx-auto grid w-full max-w-480 gap-4 lg:grid-cols-[16.5rem_1fr]">
				<Sidebar />

				<main className="grid min-w-0 gap-4">
					<TopNavbar />
					<KpiSection />
					<PerformanceSection />
					<BottomSection />
				</main>
			</div>
		</div>
	);
}
