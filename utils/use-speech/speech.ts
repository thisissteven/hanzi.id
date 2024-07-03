import { franc } from "franc";

export type SpeechEngineOptions = {
  onBoundary: (e: SpeechSynthesisEvent) => void;
  onEnd: (e: SpeechSynthesisEvent) => void;
  onStateUpdate: (state: PlayingState) => void;
  voice: SpeechSynthesisVoice;
  rate: number;
  isMobile: boolean;
};

export type PlayingState = "initialized" | "playing" | "paused" | "ended" | "audio-error";

export type SpeechEngineState = {
  utterance: SpeechSynthesisUtterance | null;
  config: {
    rate: number;
    volume: number;
    voice: SpeechSynthesisVoice;
    isMobile: boolean;
  };
};

export type SpeechEngine = ReturnType<typeof createSpeechEngine>;

/**
 * This speech engine is meant to be a simple adapter for using speech synthesis api.
 * This should generally be left for the candidate to use as the speech synthesis apis have a few nuances
 * that the candidate might not be familiar with.
 */
const createSpeechEngine = (options: SpeechEngineOptions) => {
  const state: SpeechEngineState = {
    utterance: null,
    config: {
      rate: options.rate,
      voice: options.voice,
      isMobile: options.isMobile,
      volume: 1,
    },
  };

  window.speechSynthesis.onvoiceschanged = (e) => {
    state.config.voice = options.voice;
  };

  const load = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);

    const localeMapping = {
      eng: state.config.isMobile ? "en_US" : "en-US", // English
      cmn: state.config.isMobile ? "zh_CN" : "zh-CN", // Simplified Chinese (Mandarin)
      und: state.config.isMobile ? "zh_CN" : "zh-CN", // Simplified Chinese (Mandarin)
    } as const;
    const locale = franc(text) as keyof typeof localeMapping;

    utterance.rate = state.config.rate;
    utterance.volume = state.config.volume;
    utterance.voice = state.config.voice;
    utterance.lang = localeMapping[locale];
    // set up listeners
    utterance.onboundary = (e) => options.onBoundary(e);
    utterance.onend = (e) => {
      options.onStateUpdate("ended");
      options.onEnd(e);
    };

    // set it up as active utterance
    state.utterance = utterance;
  };

  const play = () => {
    if (!state.utterance) throw new Error("No active utterance found to play");
    state.utterance.onstart = () => {
      options.onStateUpdate("playing");
    };

    state.utterance.onerror = (e) => {
      console.log(e.error);
      if (!e.error || e.error === "synthesis-failed") options.onStateUpdate("audio-error");
    };
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(state.utterance);
  };

  const pause = () => {
    options.onStateUpdate("paused");
    window.speechSynthesis.pause();
  };

  const cancel = () => {
    options.onStateUpdate("initialized");
    window.speechSynthesis.cancel();
  };

  return {
    state,
    play,
    pause,
    cancel,
    load,
  };
};

export { createSpeechEngine };
