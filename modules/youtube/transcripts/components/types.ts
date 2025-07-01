// Types for inner structures
export type Token = {
  deprel: string | null;
  feats: string | null;
  form: {
    text: string;
    pinyin: string[];
    tones: number[];
  };
  pointer: any;
  pos: string;
  xpos: string;
  form_norm: {
    text: string;
    pinyin: string[];
    tones: number[];
  };
  diocoFreq: number | string;
  freq?: number;
};

export type Subtitle = {
  begin: number;
  end: number;
  text: string;
};

export type NLPGroup = Token[];

export type SourceSubsData = {
  subsType: string;
  subs: Subtitle[];
  nlp: NLPGroup[];
  haveWordFrequency: boolean;
};

export type SourceSubs = {
  state: string;
  lang_G: string;
  type: string;
  tm: {
    isTranslatedTrack: boolean;
    isTranslatable: boolean;
    isFromASR: boolean;
    langCode_YT: string;
    langCode_G: string;
    md5: string;
    vssId: string;
    name: string;
  };
  data: SourceSubsData;
};

export type ApiResponse = {
  status: string;
  data: {
    sourceSubs: SourceSubs;
  };
};
