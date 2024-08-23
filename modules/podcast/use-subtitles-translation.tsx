import { SubtitleResponse } from "@/pages/api/subtitles/en";
import { useMemo } from "react";

export const useSubtitlesTranslation = ({
  subtitles,
  translation,
  elapsedTime,
}: {
  subtitles?: SubtitleResponse;
  translation?: SubtitleResponse;
  elapsedTime: number;
}) => {
  const { subtitleIndex, translationIndex } = useMemo(() => {
    const subtitleList = subtitles?.subtitles ?? [];
    const translationList = translation?.subtitles ?? [];

    let subtitleIndex = -1;
    let translationIndex = -1;

    for (let i = 0; i < subtitleList.length || i < translationList.length; i++) {
      if (i < subtitleList.length) {
        const subtitle = subtitleList[i];
        if (subtitle.start <= elapsedTime && subtitle.start + subtitle.duration >= elapsedTime && subtitle.text) {
          subtitleIndex = i;
        }
      }

      if (i < translationList.length) {
        const translationSubtitle = translationList[i];
        if (
          translationSubtitle.start <= elapsedTime &&
          translationSubtitle.start + translationSubtitle.duration >= elapsedTime &&
          translationSubtitle.text
        ) {
          translationIndex = i;
        }
      }

      if (subtitleIndex !== -1 && translationIndex !== -1) {
        break;
      }
    }

    return { subtitleIndex, translationIndex };
  }, [subtitles, translation, elapsedTime]);

  const currentTranslation = translationIndex !== -1 ? translation?.subtitles[translationIndex] : null;

  const sections = useMemo(() => {
    return subtitleIndex !== -1 ? subtitles?.sections[subtitleIndex] : null;
  }, [subtitleIndex, subtitles]);

  return { currentTranslation, sections };
};
