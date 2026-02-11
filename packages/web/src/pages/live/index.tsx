import { useCallback, useEffect, useRef, useState } from "react";
import Layout from "../layout";

export function LivePage() {
	const [logs, setLogs] = useState<string[]>([]);
	const hasInit = useRef(false);

	const addLog = useCallback((msg: string) => {
		setLogs((prev) => [...prev.slice(-5), `> ${msg}`]);
	}, []);

	useEffect(() => {
		if (hasInit.current) return;

		const startEcho = async () => {
			try {
				addLog("Requesting Meeting Audio...");
				const stream = await navigator.mediaDevices.getUserMedia({
					audio: true,
				});
				addLog("Microphone Captured!");

				const AudioContext =
					window.AudioContext || (window as any).webkitAudioContext;
				const ctx = new AudioContext();

				if (ctx.state === "suspended") await ctx.resume();
				addLog(`Audio State: ${ctx.state}`);

				const source = ctx.createMediaStreamSource(stream);
				source.connect(ctx.destination);
				addLog("Loopback Active: Bot should now echo everything.");

				hasInit.current = true;
			} catch (err) {
				addLog(
					`Echo Error: ${err instanceof Error ? err.message : String(err)}`,
				);
			}
		};

		const timer = setTimeout(startEcho, 2000);
		return () => clearTimeout(timer);
	}, [addLog]);

	return (
		<Layout className="flex flex-col items-center justify-center h-screen bg-background text-foreground p-10">
			<div className="size-40 bg-primary rounded-full animate-pulse" />
			<div className="mt-10 font-mono text-sm bg-card p-4 border border-border rounded w-full max-w-md">
				<p className="text-muted-foreground mb-2 border-b border-border pb-1">
					KEX_LIVE
				</p>
				{logs.map((log) => (
					<div key={log} className="text-primary font-mono">
						{log}
					</div>
				))}
			</div>
		</Layout>
	);
}
