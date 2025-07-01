"use client";

import { Button } from "@/components";
import { useEffect, useState } from "react";

type Status = "known" | "learning";

export interface WordStatusData {
  word: string;
  pos: string;
  lang: string;
  transliteration: string;
}

interface WordStatusButtonsProps extends WordStatusData {}

export function WordStatusButtons({ word, pos, lang, transliteration }: WordStatusButtonsProps) {
  const [status, setStatus] = useState<Status | null>(null);

  const LOCAL_KEY = "wordStatus";

  // Load status from localStorage
  useEffect(() => {
    const data = localStorage.getItem(LOCAL_KEY);
    if (!data) return;

    const parsed = JSON.parse(data) as Record<Status, WordStatusData[]>;
    if (parsed.known?.some((entry) => entry.word === word && entry.lang === lang && entry.pos === pos)) {
      setStatus("known");
    } else if (parsed.learning?.some((entry) => entry.word === word && entry.lang === lang && entry.pos === pos)) {
      setStatus("learning");
    }
  }, [word, pos, lang]);

  const handleSave = (newStatus: Status) => {
    const data = localStorage.getItem(LOCAL_KEY);
    const parsed: Record<Status, WordStatusData[]> = data ? JSON.parse(data) : { known: [], learning: [] };

    // Remove existing entries to prevent duplicates
    parsed.known = parsed.known.filter((entry) => entry.word !== word || entry.pos !== pos || entry.lang !== lang);
    parsed.learning = parsed.learning.filter(
      (entry) => entry.word !== word || entry.pos !== pos || entry.lang !== lang
    );

    // Add the new entry
    parsed[newStatus].push({ word, pos, lang, transliteration });

    localStorage.setItem(LOCAL_KEY, JSON.stringify(parsed));
    setStatus(newStatus);
  };

  //   return (
  //     <div className="flex items-center mt-2 gap-2">
  //       <Button variant={status === "known" ? "primary" : "secondary"} onClick={() => handleSave("known")}>
  //         ★ Known
  //       </Button>
  //       <Button variant={status === "learning" ? "primary" : "secondary"} onClick={() => handleSave("learning")}>
  //         🧠 Learning
  //       </Button>
  //     </div>
  //   );

  return null;
}
