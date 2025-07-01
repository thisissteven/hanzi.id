"use client";

import { usePersistedState } from "../../hooks/usePersistedState";
import { getYoutubeSubsData, getYoutubeSubsTranslations } from "../../utils/cdn";
import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";
import { createContext, useContext } from "react";
import { useParsedSubsData } from "../components/hook";

type ColorBy = "none" | "pos" | "freq";
type ColorMode = "text" | "underline";
type VideoSize = "default" | "half-screen" | "full-screen";

interface SubtitleSettingsContextType {
  colorBy: ColorBy;
  setColorBy: (value: ColorBy) => void;
  colorMode: ColorMode;
  setColorMode: (value: ColorMode) => void;
  videoSize: VideoSize;
  setVideoSize: (value: VideoSize) => void;
  audioOnly: boolean;
  setAudioOnly: (value: boolean) => void;
  showPinyin: boolean;
  setShowPinyin: (value: boolean) => void;
  showTranslation: boolean;
  setShowTranslation: (value: boolean) => void;
  videoId: any;
  lang: string;
  subsData: any;
  subsTranslations: any;
  isLoading: boolean;
  isError: boolean;
  subtitles: ReturnType<typeof useParsedSubsData>["subtitles"];
}

const SubtitleSettingsContext = createContext<SubtitleSettingsContextType | undefined>(undefined);

export const SubtitleSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [colorBy, setColorBy] = usePersistedState<ColorBy>("colorBy", "pos");
  const [videoSize, setVideoSize] = usePersistedState<VideoSize>("videoSize", "default");
  const [colorMode, setColorMode] = usePersistedState<ColorMode>("colorMode", "text");
  const [audioOnly, setAudioOnly] = usePersistedState<boolean>("audioOnly", false);
  const [showPinyin, setShowPinyin] = usePersistedState<boolean>("showPinyin", true);
  const [showTranslation, setShowTranslation] = usePersistedState<boolean>("showTranslation", true);

  const params = useParams();
  const videoId = params?.id as string;
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang") ?? "es";

  const {
    data: subsData,
    isLoading: isSubsDataLoading,
    isError: isSubsDataError,
  } = useQuery({
    queryKey: ["subsData", videoId],
    queryFn: () => getYoutubeSubsData(videoId as string),
    enabled: typeof videoId === "string" && !!videoId,
  });

  const {
    data: subsTranslations,
    isLoading: isSubsTranslationsLoading,
    isError: isSubsTranslationsError,
  } = useQuery({
    queryKey: ["subsTranslations", videoId],
    queryFn: () => getYoutubeSubsTranslations(videoId as string),
    enabled: typeof videoId === "string" && !!videoId,
  });

  const { subtitles } = useParsedSubsData(subsData);

  return (
    <SubtitleSettingsContext.Provider
      value={{
        colorBy,
        setColorBy,
        colorMode,
        setColorMode,
        videoSize,
        setVideoSize,
        audioOnly,
        setAudioOnly,
        showPinyin,
        setShowPinyin,
        showTranslation,
        setShowTranslation,
        videoId,
        lang,
        subsData,
        subsTranslations: subsTranslations?.data,
        isError: isSubsDataError || isSubsTranslationsError,
        isLoading: isSubsDataLoading && isSubsTranslationsLoading,
        subtitles,
      }}
    >
      {children}
    </SubtitleSettingsContext.Provider>
  );
};

export function useSubtitleSettings() {
  const context = useContext(SubtitleSettingsContext);
  if (!context) {
    return {
      videoSize: "default",
    } as SubtitleSettingsContextType;
  }
  return context;
}
