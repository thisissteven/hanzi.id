import React from "react";
import useSWRImmutable from "swr/immutable";
import { useLocale } from "@/locales/use-locale";
import { createErrorToast, dismissToast, LoadingBar, usePreferences } from "@/components";
import { useWindowSize } from "@/hooks";
import { cn } from "@/utils";
import getYoutubeVideoId from "get-video-id";
import { SectionsContainer } from "@/modules/youtube";
import { SubtitleResponse } from "@/pages/api/subtitles/en";

function getVideoId(url: string, errorMessage: string) {
  try {
    const videoId = getYoutubeVideoId(url);
    if (!videoId.id) {
      createErrorToast(errorMessage, {
        id: "youtube-error",
        position: "bottom-center",
      });
    }
    return videoId.id;
  } catch {
    createErrorToast(errorMessage, {
      id: "youtube-error",
      position: "bottom-center",
    });
  }
}

const NINE_PER_SIXTEEN = 0.5625;

export function VideoContainer() {
  const [youtubeUrl, setYoutubeUrl] = React.useState("");
  const playerRef = React.useRef<YT.Player | null>(null);

  const { width } = useWindowSize();

  const [isRendered, setIsRendered] = React.useState(false);
  const [elapsedTime, setElapsedTime] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);

  React.useEffect(() => {
    if (isRendered) {
      const offset = width < 768 ? 0 : 64;
      const maxWidth = Math.min(960 - offset, width - offset);
      const height = maxWidth * NINE_PER_SIXTEEN;

      const player = new YT.Player("player", {
        width: maxWidth,
        height,
        videoId: undefined,
      });

      player.addEventListener("onReady", () => {
        playerRef.current = player;
      });

      player.addEventListener("onStateChange", (event) => {
        const target = event.target;
        if (target) {
          const isPlaying = target?.getPlayerState() === YT.PlayerState.PLAYING;
          const isPaused = target?.getPlayerState() === YT.PlayerState.PAUSED;

          if (isPlaying && !isPaused) {
            setIsPlaying(true);
          } else {
            setIsPlaying(false);
          }
        }
      });

      // This is the source "window" that will emit the events.
      var iframeWindow = player.getIframe().contentWindow;

      // So we can compare against new updates.
      var lastTimeUpdate = 0;

      // Listen to events triggered by postMessage,
      // this is how different windows in a browser
      // (such as a popup or iFrame) can communicate.
      // See: https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
      window.addEventListener("message", function (event) {
        // Check that the event was sent from the YouTube IFrame.
        if (event.source === iframeWindow) {
          var data = JSON.parse(event.data);

          // The "infoDelivery" event is used by YT to transmit any
          // kind of information change in the player,
          // such as the current time or a playback quality change.
          if (data.event === "infoDelivery" && data.info && data.info.currentTime) {
            // currentTime is emitted very frequently,
            // but we only care about whole second changes.
            var time = Math.round(data.info.currentTime * 10) / 10;

            if (time !== lastTimeUpdate) {
              lastTimeUpdate = time;
              setElapsedTime(time);
            }
          }
        }
      });
    }
  }, [isRendered, width]);

  React.useEffect(() => {
    if (width && !isRendered) {
      setIsRendered(true);
    }

    if (playerRef.current) {
      const offset = width < 768 ? 0 : 64;
      const maxWidth = Math.min(960 - offset, width - offset);
      const height = maxWidth * NINE_PER_SIXTEEN;
      playerRef.current.setSize(maxWidth, height);
    }
  }, [isRendered, width]);

  const { t, locale } = useLocale();
  const { isSimplified } = usePreferences();

  const videoId = youtubeUrl ? getVideoId(youtubeUrl, t.youtubeErrorToast) : null;

  React.useEffect(() => {
    if (videoId) {
      dismissToast("youtube-error");
    }
  }, [videoId]);

  const {
    data: translation,
    isLoading: isLoadingTranslation,
    error: translationError,
  } = useSWRImmutable<SubtitleResponse>(videoId ? `/subtitles/${locale}?videoID=${videoId}&lang=${locale}` : undefined);

  const {
    data: subtitles,
    isLoading: isLoadingSubtitles,
    error: subtitlesError,
  } = useSWRImmutable<SubtitleResponse>(
    videoId ? `/subtitles/${locale}?videoID=${videoId}&lang=${isSimplified ? "zh-CN" : "zh-TW"}` : undefined
  );

  const index = subtitles?.subtitles.findIndex((subtitle) => {
    return subtitle.start <= elapsedTime && subtitle.start + subtitle.duration >= elapsedTime && subtitle.text;
  });

  const currentSub = index !== undefined ? subtitles?.subtitles[index] : null;
  const currentTranslation = index !== undefined ? translation?.subtitles[index] : null;

  const sections = React.useMemo(() => {
    return index !== undefined ? subtitles?.sections[index] : null;
  }, [index, subtitles]);

  const isLoading = isLoadingSubtitles || isLoadingTranslation;

  React.useEffect(() => {
    if (!isLoading && videoId && playerRef.current) {
      playerRef.current.loadVideoById(videoId);
    } else if (!videoId) {
      playerRef.current?.pauseVideo();
    }
  }, [isLoading, videoId]);

  React.useEffect(() => {
    if (subtitlesError) {
      if (subtitlesError?.response?.data?.error === "not-found")
        createErrorToast(t.subtitlesErrorToast, {
          id: "subtitles-error",
          position: "bottom-center",
        });
    }
  }, [subtitlesError, t.subtitlesErrorToast]);

  React.useEffect(() => {
    if (translationError) {
      if (translationError?.response?.data?.error === "not-found")
        createErrorToast(t.translationErrorToast, {
          id: "translation-error",
          position: "bottom-center",
        });
    }
  }, [translationError, t.translationErrorToast]);

  return (
    <React.Fragment>
      <div className="relative mt-4 px-2 flex items-center gap-2">
        <input
          type="text"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          placeholder={t.youtubePlaceholder}
          className="bg-transparent pl-3 pr-10 py-2 rounded-md border border-subtle ring-offset-black ring-smoke focus:ring-offset-2 focus:ring-2 text-secondary focus:text-white transition-shadow duration-200 placeholder:text-secondary/50 focus:outline-none w-full"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary p-2.5 bg-black h-fit">
          {isLoading && <LoadingBar visible />}
        </div>
      </div>

      <div
        aria-hidden={!videoId}
        className={cn("mt-4 duration-200", videoId ? "opacity-100" : "opacity-0 pointer-events-none")}
      >
        <div id="player"></div>
      </div>

      <div className="mt-4 px-2">
        {isPlaying && (
          <React.Fragment>
            <p className="text-2xl text-center">{currentSub?.text}</p>
            <p className="text-xl text-center text-secondary">{currentTranslation?.text}</p>
          </React.Fragment>
        )}
        {sections && !isPlaying && (
          <SectionsContainer sections={sections} flashcardName={`${videoId}-${playerRef.current?.getIframe().title}`}>
            <p className="text-xl text-center text-secondary">{currentTranslation?.text}</p>
          </SectionsContainer>
        )}
      </div>
    </React.Fragment>
  );
}
