export const posColorMap: Record<string, string> = {
	NOUN: "text-blue-500 dark:text-blue-300",
	VERB: "text-green-500 dark:text-green-300",
	ADJ: "text-red-500 dark:text-red-300",
	ADV: "text-purple-500 dark:text-purple-300",
	PRON: "text-amber-600 dark:text-amber-300",
	PROPN: "text-yellow-600 dark:text-yellow-300",
	NUM: "text-pink-500 dark:text-pink-300",
	ADP: "text-teal-500 dark:text-teal-300",
	PART: "text-indigo-500 dark:text-indigo-300",
	CCONJ: "text-cyan-600 dark:text-cyan-300",
	SCONJ: "text-cyan-800 dark:text-cyan-400",
	DET: "text-fuchsia-600 dark:text-fuchsia-300",
	AUX: "text-lime-600 dark:text-lime-300",
	INTJ: "text-rose-500 dark:text-rose-300",
	SYM: "text-gray-600 dark:text-gray-400",
	X: "text-gray-400 dark:text-gray-300",
	PUNCT: "text-gray-500 dark:text-gray-300",
};

export const freqColorMap: Record<string, string> = {
	"1-100": "text-red-600 dark:text-red-300",
	"101-200": "text-orange-600 dark:text-orange-300",
	"201-500": "text-yellow-600 dark:text-yellow-300",
	"501-1000": "text-green-600 dark:text-green-300",
	"1001-2000": "text-blue-500 dark:text-blue-300",
	"2001-3500": "text-blue-700 dark:text-blue-400",
	"3501-5000": "text-blue-800 dark:text-blue-500",
	"5001-8000": "text-purple-500 dark:text-purple-300",
	"8001+": "text-purple-700 dark:text-purple-400",
};

export const posReadableMap: Record<string, string> = {
	NOUN: "Noun",
	VERB: "Verb",
	ADJ: "Adjective",
	ADV: "Adverb",
	PRON: "Pronoun",
	PROPN: "Proper Noun",
	NUM: "Numeral",
	ADP: "Adposition", // includes prepositions and postpositions
	PART: "Particle",
	CCONJ: "Coordinating Conjunction",
	SCONJ: "Subordinating Conjunction",
	DET: "Determiner",
	AUX: "Auxiliary Verb",
	INTJ: "Interjection",
	SYM: "Symbol",
	X: "Unknown",
	PUNCT: "Punctuation",
};

export const LANGUAGES = ["es", "zh-CN", "zh-TW", "ja", "ko"];
