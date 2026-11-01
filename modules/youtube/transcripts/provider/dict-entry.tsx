"use client";

import { useLocale } from "@/locales/use-locale";
import { DictEntry, getDictTTS, getFullDict, getSentenceTTS } from "../../utils/cdn";
import { useQuery } from "@tanstack/react-query";
import { createContext, SetStateAction, useContext, useMemo, useState } from "react";

interface DictEntryActionsContextType {
  setDrawerOpen: React.Dispatch<SetStateAction<boolean>>;
  setToken: (value: string) => void;
  setDictParams: (value: string) => void;
  setSentenceParams: (value: string) => void;
}

interface DictEntryContextType extends DictEntryActionsContextType {
  drawerOpen: boolean;
  token: string;
  isLoading: boolean;
  dictEntry?: DictEntry;
  audio?: string;
  sentenceAudio?: string;
}

const DictEntryActionsContext = createContext<DictEntryActionsContextType | undefined>(undefined);
const DictEntryContext = createContext<DictEntryContextType | undefined>(undefined);

export const DictEntryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [dictParams, setDictParams] = useState<string>("");
  const [sentenceParams, setSentenceParams] = useState<string>("");
  const [token, setToken] = useState<string>("");

  const { locale } = useLocale();

  const { data: dictEntry, isLoading } = useQuery({
    queryKey: ["dictEntry", dictParams, locale],
    queryFn: () => {
      const [form, pos, lang] = dictParams.split(",");
      return getFullDict({
        form,
        lemma: "",
        sl: lang,
        tl: locale,
        pos: pos.toUpperCase(),
        pow: "n",
      });
    },
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: dictParams.length > 0 && typeof locale === "string",
  });

  const { data: audio } = useQuery({
    queryKey: ["audio", dictParams],
    queryFn: () => {
      const [text, _, lang] = dictParams.split(",");
      return getDictTTS(lang, text);
    },
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: dictParams.length > 0,
  });

  const { data: sentenceAudio } = useQuery({
    queryKey: ["sentence-audio", sentenceParams],
    queryFn: () => {
      const [text, hash] = sentenceParams.split(",");
      const [_, __, lang] = dictParams.split(",");
      return getSentenceTTS(lang, text, hash);
    },
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: sentenceParams.length > 0,
  });

  const actions = useMemo(
    () => ({ setDrawerOpen, setToken, setDictParams, setSentenceParams }),
    []
  );

  return (
    <DictEntryActionsContext.Provider value={actions}>
      <DictEntryContext.Provider
        value={{
          ...actions,
          drawerOpen,
          dictEntry: dictEntry?.data,
          isLoading,
          audio,
          token,
          sentenceAudio,
        }}
      >
        {children}
      </DictEntryContext.Provider>
    </DictEntryActionsContext.Provider>
  );
};

export function useDictEntry() {
  const context = useContext(DictEntryContext);
  if (!context) {
    throw new Error("useDictEntry must be used within a DictEntryProvider");
  }
  return context;
}

export function useDictEntryActions() {
  const context = useContext(DictEntryActionsContext);
  if (!context) {
    throw new Error("useDictEntryActions must be used within a DictEntryProvider");
  }
  return context;
}
