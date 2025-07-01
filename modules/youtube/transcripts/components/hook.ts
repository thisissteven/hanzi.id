import { useMemo } from "react";
import { ApiResponse, Subtitle, NLPGroup, Token } from "./types";
import { groupTokensByFreq } from "./utils";

export type FrequencyRange = {
	label: string;
	min: number;
	max: number;
};

export const ranges: FrequencyRange[] = [
	{ label: "1-100", min: 1, max: 100 },
	{ label: "101-200", min: 101, max: 200 },
	{ label: "201-500", min: 201, max: 500 },
	{ label: "501-1000", min: 501, max: 1000 },
	{ label: "1001-2000", min: 1001, max: 2000 },
	{ label: "2001-3500", min: 2001, max: 3500 },
	{ label: "3501-5000", min: 3501, max: 5000 },
	{ label: "5001-8000", min: 5001, max: 8000 },
	{ label: "8001+", min: 8001, max: Infinity },
];

// Get frequency range label from ranges
function getFrequencyRangeLabel(freq: number | null | undefined): string | null {
	if (typeof freq !== "number" || freq <= 0) return null;
	const found = ranges.find((r) => freq >= r.min && freq <= r.max);
	return found?.label ?? null;
}

export function useParsedSubsData(apiResponse: ApiResponse | null) {
	return useMemo(() => {
		if (!apiResponse || apiResponse.status !== "success") {
			return {
				categorizedGroups: {},
				subtitles: [],
				haveWordFrequency: false,
				ranges,
			};
		}

		const sourceData = apiResponse.data.sourceSubs.data;
		const nlpGroups: NLPGroup[] = sourceData.nlp;
		const plainSubs: Subtitle[] = sourceData.subs;

		const categorizedGroups = groupTokensByFreq(nlpGroups);

		// Enrich subtitles with token freqRange
		const enrichedSubtitles = plainSubs.map((sub: Subtitle, i: number) => {
			const tokens = (nlpGroups[i] || []).map((token: Token) => {
				const freq = typeof token.freq === "number" ? token.freq : parseInt(token.diocoFreq as string) || 0;

				return {
					...token,
					freqRange: getFrequencyRangeLabel(freq),
				};
			});
			return { ...sub, tokens };
		});

		return {
			categorizedGroups,
			subtitles: enrichedSubtitles,
			haveWordFrequency: sourceData.haveWordFrequency,
			ranges, // make ranges available to UI
		};
	}, [apiResponse]);
}
