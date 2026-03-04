import { SpinnerIcon } from "@phosphor-icons/react";

export function Loader() {
	return (
		<div className="flex min-h-screen items-center justify-center">
			<SpinnerIcon className="animate-spin" size={32} />
		</div>
	);
}
