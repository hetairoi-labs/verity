import { Hono } from "hono";

const app = new Hono();

const mockTranscriptData = [
	{
		participant: {
			id: 1,
			name: "Alice Johnson",
			is_host: true,
			platform: "zoom",
			extra_data: null,
			email: "alice@example.com",
		},
		words: [
			{
				text: "Hello",
				start_timestamp: {
					absolute: "2023-10-01T10:00:00Z",
					relative: 0,
				},
				end_timestamp: {
					absolute: "2023-10-01T10:00:01Z",
					relative: 1,
				},
			},
			{
				text: "everyone,",
				start_timestamp: {
					absolute: "2023-10-01T10:00:01Z",
					relative: 1,
				},
				end_timestamp: {
					absolute: "2023-10-01T10:00:02Z",
					relative: 2,
				},
			},
			{
				text: "welcome",
				start_timestamp: {
					absolute: "2023-10-01T10:00:02Z",
					relative: 2,
				},
				end_timestamp: {
					absolute: "2023-10-01T10:00:03Z",
					relative: 3,
				},
			},
			{
				text: "to",
				start_timestamp: {
					absolute: "2023-10-01T10:00:03Z",
					relative: 3,
				},
				end_timestamp: {
					absolute: "2023-10-01T10:00:04Z",
					relative: 4,
				},
			},
			{
				text: "the",
				start_timestamp: {
					absolute: "2023-10-01T10:00:04Z",
					relative: 4,
				},
				end_timestamp: {
					absolute: "2023-10-01T10:00:05Z",
					relative: 5,
				},
			},
			{
				text: "meeting.",
				start_timestamp: {
					absolute: "2023-10-01T10:00:05Z",
					relative: 5,
				},
				end_timestamp: {
					absolute: "2023-10-01T10:00:06Z",
					relative: 6,
				},
			},
		],
	},
	{
		participant: {
			id: 2,
			name: "Bob Smith",
			is_host: false,
			platform: "zoom",
			extra_data: null,
			email: "bob@example.com",
		},
		words: [
			{
				text: "Thanks",
				start_timestamp: {
					absolute: "2023-10-01T10:00:07Z",
					relative: 7,
				},
				end_timestamp: {
					absolute: "2023-10-01T10:00:08Z",
					relative: 8,
				},
			},
			{
				text: "Alice.",
				start_timestamp: {
					absolute: "2023-10-01T10:00:08Z",
					relative: 8,
				},
				end_timestamp: {
					absolute: "2023-10-01T10:00:09Z",
					relative: 9,
				},
			},
			{
				text: "I",
				start_timestamp: {
					absolute: "2023-10-01T10:00:09Z",
					relative: 9,
				},
				end_timestamp: {
					absolute: "2023-10-01T10:00:10Z",
					relative: 10,
				},
			},
			{
				text: "have",
				start_timestamp: {
					absolute: "2023-10-01T10:00:10Z",
					relative: 10,
				},
				end_timestamp: {
					absolute: "2023-10-01T10:00:11Z",
					relative: 11,
				},
			},
			{
				text: "some",
				start_timestamp: {
					absolute: "2023-10-01T10:00:11Z",
					relative: 11,
				},
				end_timestamp: {
					absolute: "2023-10-01T10:00:12Z",
					relative: 12,
				},
			},
			{
				text: "updates",
				start_timestamp: {
					absolute: "2023-10-01T10:00:12Z",
					relative: 12,
				},
				end_timestamp: {
					absolute: "2023-10-01T10:00:13Z",
					relative: 13,
				},
			},
			{
				text: "to",
				start_timestamp: {
					absolute: "2023-10-01T10:00:13Z",
					relative: 13,
				},
				end_timestamp: {
					absolute: "2023-10-01T10:00:14Z",
					relative: 14,
				},
			},
			{
				text: "share.",
				start_timestamp: {
					absolute: "2023-10-01T10:00:14Z",
					relative: 14,
				},
				end_timestamp: {
					absolute: "2023-10-01T10:00:15Z",
					relative: 15,
				},
			},
		],
	},
];

app.get("/transcript", (c) => {
	return c.json(mockTranscriptData);
});

export default app;

if (import.meta.main) {
	console.log("Starting mock Recall server on http://localhost:3001");
	Bun.serve({
		port: 3001,
		fetch: app.fetch,
	});
}
