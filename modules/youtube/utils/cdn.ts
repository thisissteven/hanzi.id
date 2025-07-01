export async function getYoutubeSubsData(videoId: string, type: string = "YT") {
  const response = await fetch("https://api-cdn.dioco.io/base_media_getYoutubeSubsData_2", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, videoId }),
  });

  if (!response.ok) throw new Error(`Failed to fetch subs data: ${response.statusText}`);
  return response.json();
}

export async function getYoutubeSubsTranslations(videoId: string, destLang_G: string = "en", type: string = "YT") {
  const response = await fetch("https://api-cdn.dioco.io/base_media_getYoutubeSubsTranslations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ videoId, destLang_G, type }),
  });

  if (!response.ok) throw new Error(`Failed to fetch subs translations: ${response.statusText}`);
  return response.json();
}

interface DictParams {
  form: string; // word to search
  lemma: string; // leave empty
  sl: string; // source language, e.g., "zh-CN" for Simplified Chinese
  tl: string; // target language, e.g., "en" for English
  pos: string; // part of speech, e.g., "NOUN", "VERB", etc.
  pow: string; // always "n"
}

export interface DictEntry {
  renderData: RenderData;
  tatoebaExamples: TatoebaExamples;
}

export interface RenderData {
  hoverDictEntries: string[];
  fullDictRenderData: FullDictRenderData;
}

export interface FullDictRenderData {
  type: string;
  entries: Entry[];
}

export interface Entry {
  word: string;
  posGroups: PosGroup[];
}

export interface PosGroup {
  pos: string;
  translations: string[];
}

export interface TatoebaExamples {
  NOUN: Noun[];
}

export interface Noun {
  lEFN_LC: string;
  langCode_G: string;
  pos: string;
  tokenIndex: number;
  sentenceNumber: number;
  isMTranslation: boolean;
  fN_LC: string;
  length: number;
  lemmaExampleScore: number;
  sentenceScore: number;
  text: string;
  userName?: string;
  root?: number;
  firstDegLink: FirstDegLink;
  translationLangs: string[];
  nlp: Nlp[];
  avgFreqRank: number;
  maxFreqRank: number;
  textHash: string;
  translation: Translation;
}

export interface FirstDegLink {
  en?: number;
  "zh-TW"?: number;
}

export interface Nlp {
  pos: string;
  form: Form;
  freq?: number;
  xpos: string;
  feats: any;
  deprel: any;
  pointer: any;
  diocoFreq: any;
  form_norm: FormNorm;
}

export interface Form {
  text: string;
  tones: number[];
  pinyin: string[];
}

export interface FormNorm {
  text: string;
  tones: number[];
  pinyin: string[];
}

export interface Translation {
  type: string;
  langCode_G: string;
  text: string;
  sentenceNumber?: number;
}

export async function getFullDict(params: DictParams): Promise<{ data: DictEntry }> {
  const query = new URLSearchParams(params as unknown as Record<string, string>).toString();
  const url = `https://api-cdn-plus.dioco.io/base_dict_getFullDict_8?${query}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch full dict: ${response.statusText}`);
  return response.json();
}

export async function getDictTTS(lang: string, text: string): Promise<string> {
  const query = new URLSearchParams({ lang, text }).toString();
  const url = `https://api-cdn-plus.dioco.io/base_dict_getDictTTS_3?${query}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch TTS: ${response.statusText}`);

  const json = await response.json();

  if (!json.data || !json.data.startsWith("data:audio/")) {
    throw new Error("Invalid audio format in response");
  }

  return json.data; // base64 data URL string
}

export async function getSentenceTTS(lang: string, text: string, hash: string): Promise<string> {
  const query = new URLSearchParams({ lang, text, hash }).toString();

  const url = `https://api-cdn-plus.dioco.io/base_items_getSentenceTTS_3?${query}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch TTS: ${response.statusText}`);

  const json = await response.json();

  if (!json.data || !json.data.startsWith("data:audio/")) {
    throw new Error("Invalid audio format in response");
  }

  return json.data; // base64 data URL string
}

export async function getHoverDict(params: DictParams) {
  const query = new URLSearchParams(params as unknown as Record<string, string>).toString();
  const url = `https://api-cdn-plus.dioco.io/base_dict_getHoverDict_8?${query}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch hover dict: ${response.statusText}`);
  return response.json();
}
