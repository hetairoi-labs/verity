import { createFileRoute } from "@tanstack/react-router";
import AllProjects from "./:components/all-projects";
import CompleteProfile from "./:components/complete-profile";
import Footer from "./:components/footer";
import GeneralInfo from "./:components/general-info";
import Header from "./:components/header";
import Notifications from "./:components/notifications";
import ProfileBanner from "./:components/profile-banner";
import Sidebar from "./:components/sidebar";
import StorageCard from "./:components/storage-card";

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
