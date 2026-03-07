/**
 * Utility for handling Hot Module Replacement (HMR) persistence of instances.
 * Preserves instances across HMR reloads to prevent stale reference errors.
 */
export function createHmrInstance<T>(key: string, factory: () => T): T {
	let instance: T;

	if (import.meta.hot) {
		if (!import.meta.hot.data[key]) {
			import.meta.hot.data[key] = factory();
		}
		instance = import.meta.hot.data[key];
	} else {
		instance = factory();
	}

	return instance;
}
