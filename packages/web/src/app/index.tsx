import { SignOutIcon } from "@phosphor-icons/react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import Logo from "../components/custom/logo";
import ThemeSwitch from "../components/custom/theme-switch";
import { Button } from "../components/ui/button";
import { useAuth } from "../lib/context/auth-context";

export const Route = createFileRoute("/")({
	component: LandingPage,
});

const heroAssetUrl =
	"https://framerusercontent.com/images/epJvtkN6Fjcujly2tBCigpwwYk.png?scale-down-to=4096&width=4224&height=2522";
const bottomGlowUrl =
	"https://framerusercontent.com/images/xqtH4KxHeMnMzMUEyOHt96lpE.png?width=1674&height=1203";

function LandingPage() {
	const { authenticated, login, logout } = useAuth();
	const navigate = useNavigate();

	const handlePrimaryAction = () => {
		if (authenticated) {
			navigate({ to: "/dashboard" });
			return;
		}
		login.mutate();
	};

	return (
		<div className="relative min-h-dvh overflow-hidden bg-background text-foreground">
			<img
				alt="Blue glow background"
				className="pointer-events-none absolute -bottom-72 left-1/2 w-440 -translate-x-1/2 opacity-90"
				height={1203}
				src={bottomGlowUrl}
				width={1674}
			/>

			<div className="relative mx-auto flex w-full max-w-7xl flex-col px-4 pt-5 pb-10 sm:px-6 lg:px-8">
				<header className="mx-auto w-full max-w-4xl rounded-full border border-border/60 bg-card/80 p-2.5 backdrop-blur">
					<nav className="flex items-center justify-between gap-3">
						<div className="flex items-center gap-2 pl-3.5">
							<Logo className="size-8" />
							<p className="text-2xl">Verity</p>
						</div>

						<div className="hidden items-center gap-6 text-muted-foreground text-sm md:flex">
							<a className="hover:text-foreground" href="/">
								About
							</a>
							<a className="hover:text-foreground" href="/">
								Features
							</a>
							<a className="hover:text-foreground" href="/">
								Flows
							</a>
							<a className="hover:text-foreground" href="/">
								Architecture
							</a>
						</div>

						<div className="flex items-center gap-2">
							<Button
								className="h-11 rounded-full px-6"
								onClick={handlePrimaryAction}
							>
								{authenticated ? "Dashboard" : "Start Free Trial"}
							</Button>
							{authenticated ? (
								<Button
									className="rounded-full p-5"
									onClick={() => logout()}
									size="icon"
									variant="ghost"
								>
									<SignOutIcon />
								</Button>
							) : null}
						</div>
					</nav>
				</header>

				<main
					className="mx-auto flex w-full max-w-5xl flex-col items-center pt-16 text-center sm:pt-20"
					id="features"
				>
					<h1 className="mt-6 max-w-4xl text-5xl sm:text-6xl lg:text-7xl">
						Consult Less on Trust.
						<br />
						Verify Value with Verity.
					</h1>

					<p className="mt-6 max-w-3xl text-lg text-muted-foreground sm:text-xl">
						Escrow-backed sessions, autonomous AI witness, and merit-based
						settlement so experts are paid for impact and learners only pay for
						proven learning.
					</p>

					<div className="mt-10 flex flex-wrap items-center justify-center gap-3">
						<Button
							className="h-12 rounded-full px-7"
							onClick={handlePrimaryAction}
						>
							{authenticated ? "Go to Dashboard" : "Get Started Free"}
						</Button>
						<a
							href="https://hetairoiconsultingllc.mintlify.app/"
							rel="noopener"
							target="_blank"
						>
							<Button className="h-12 rounded-full px-7" variant="secondary">
								See Docs
							</Button>
						</a>
					</div>
				</main>

				<section
					className="mx-auto mt-14 w-full max-w-6xl rounded-[2rem] border border-border/60 bg-card/80 p-2 shadow-lg shadow-primary/20 sm:p-3"
					id="demo"
				>
					<img
						alt="Verity dashboard preview"
						className="h-auto w-full rounded-[1.5rem]"
						height={2522}
						src={heroAssetUrl}
						width={4224}
					/>
				</section>

				<section
					className="mx-auto mt-6 grid w-full max-w-6xl gap-3 sm:grid-cols-3"
					id="flows"
				>
					<div className="rounded-2xl border border-border/60 bg-card/40 p-4 text-left">
						<p>Smart Escrow</p>
						<p className="mt-1 text-muted-foreground text-sm">
							Funds are locked before each session starts.
						</p>
					</div>
					<div className="rounded-2xl border border-border/60 bg-card/40 p-4 text-left">
						<p>Autonomous Witness</p>
						<p className="mt-1 text-muted-foreground text-sm">
							AI captures objective session evidence in the background.
						</p>
					</div>
					<div
						className="rounded-2xl border border-border/60 bg-card/40 p-4 text-left"
						id="architecture"
					>
						<p>Merit Settlement</p>
						<p className="mt-1 text-muted-foreground text-sm">
							Outcome scores determine payout and refund split.
						</p>
					</div>
				</section>
			</div>

			<ThemeSwitch className="fixed right-4 bottom-4" variant="secondary" />
		</div>
	);
}
