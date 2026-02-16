import { SpinnerIcon } from "@phosphor-icons/react";

export function Loader() {
	return (
		<div className="min-h-screen flex items-center justify-center">
			<SpinnerIcon size={32} className="animate-spin" />
		</div>
	);
}
