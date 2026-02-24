import { createFileRoute } from "@tanstack/react-router";
import AllProjects from "./:c/all-projects";
import CompleteProfile from "./:c/complete-profile";
import Footer from "./:c/footer";
import GeneralInfo from "./:c/general-info";
import Header from "./:c/header";
import Notifications from "./:c/notifications";
import ProfileBanner from "./:c/profile-banner";
import Sidebar from "./:c/sidebar";
import StorageCard from "./:c/storage-card";

export const Route = createFileRoute("/dashboard/")({
	component: DashboardPage,
});

function DashboardPage() {
	return (
		<div className="flex min-h-dvh bg-background">
			<Sidebar />

			<main className="flex flex-1 flex-col p-6">
				<Header />

				<div className="grid grid-cols-12 gap-6">
					{/* Row 1 */}
					<div className="col-span-4">
						<ProfileBanner />
					</div>
					<div className="col-span-3">
						<StorageCard />
					</div>
					<div className="col-span-5">
						<CompleteProfile />
					</div>

					{/* Row 2 */}
					<div className="col-span-4">
						<AllProjects />
					</div>
					<div className="col-span-5">
						<GeneralInfo />
					</div>
					<div className="col-span-3">
						<Notifications />
					</div>
				</div>

				<Footer />
			</main>
		</div>
	);
}
