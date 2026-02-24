export type ChunkFromStream<F extends (...args: unknown[]) => unknown> =
	Awaited<ReturnType<F>> extends AsyncIterable<infer T> ? T : never;
