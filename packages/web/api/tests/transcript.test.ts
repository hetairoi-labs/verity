import { describe, expect, test } from "bun:test";
import type { Transcript } from "../lib/types/bot.types";
import { compressTranscript, saveTranscript } from "../lib/utils/compress";

const SAMPLE_TRANSCRIPT: Transcript = [
	{
		participant: {
			id: 100,
			name: "Darth Vader",
			is_host: true,
			platform: "desktop",
			extra_data: null,
		},
		words: [
			{
				text: "No, I am your father.",
				start_timestamp: {
					relative: 9.730_066_299_438_477,
					absolute: "2025-07-17T00:00:09.730066Z",
				},
				end_timestamp: {
					relative: 12.751_030_921_936_035,
					absolute: "2025-07-17T00:00:12.751031Z",
				},
			},
		],
	},
	{
		participant: {
			id: 200,
			name: "Luke Skywalker",
			is_host: false,
			platform: "desktop",
			extra_data: null,
		},
		words: [
			{
				text: "No, that's not true.",
				start_timestamp: {
					relative: 13.263_169_288_635_254,
					absolute: "2025-07-17T00:00:13.263169Z",
				},
				end_timestamp: {
					relative: 16.988_412_857_055_664,
					absolute: "2025-07-17T00:00:16.988413Z",
				},
			},
		],
	},
	{
		participant: {
			id: 200,
			name: "Luke Skywalker",
			is_host: false,
			platform: "desktop",
			extra_data: null,
		},
		words: [
			{
				text: "That's impossible!",
				start_timestamp: {
					relative: 20.384_620_666_503_906,
					absolute: "2025-07-17T00:00:20.384621Z",
				},
				end_timestamp: {
					relative: 22.707_609_176_635_742,
					absolute: "2025-07-17T00:00:22.707609Z",
				},
			},
		],
	},
];

const SAMPLE_COMPRESSED_TRANSCRIPT = `Meeting Hosts: Darth Vader

[10s] Darth Vader: No, I am your father.
[13s] Luke Skywalker: No, that's not true. [20s] That's impossible!`;

describe("compressTranscript", () => {
	test("should compress a transcript correctly", () => {
		const compressed = compressTranscript(SAMPLE_TRANSCRIPT);
		expect(compressed).toBe(SAMPLE_COMPRESSED_TRANSCRIPT);
	});

	test("should save a transcript correctly", async () => {
		saveTranscript("test-raw", JSON.stringify(SAMPLE_TRANSCRIPT));
		const raw = await Bun.file(
			`${process.cwd()}/transcripts/test-raw.txt`
		).text();
		expect(raw).toBe(JSON.stringify(SAMPLE_TRANSCRIPT));

		saveTranscript("test-compressed", SAMPLE_COMPRESSED_TRANSCRIPT);
		const compressed = await Bun.file(
			`${process.cwd()}/transcripts/test-compressed.txt`
		).text();

		expect(compressed).toBe(SAMPLE_COMPRESSED_TRANSCRIPT);
	});
});
