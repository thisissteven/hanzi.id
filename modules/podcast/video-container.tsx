import { createErrorToast, dismissToast, usePreferences } from "@/components";
import { useWindowSize } from "@/hooks";
import { useLocale } from "@/locales/use-locale";
import { SectionsContainer } from "@/modules/youtube-old";
import { fetcher } from "@/pages/_app";
import { SubtitleResponse } from "@/pages/api/subtitles/en";
import { cn } from "@/utils";
import getYoutubeVideoId from "get-video-id";
import React from "react";
import useSWRImmutable from "swr/immutable";
import { useSubtitlesTranslation } from "./use-subtitles-translation";

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

type LastWatched = {
  videoID: string;
  title: string;
  thumbnail: string;
  timeElapsed: number;
  prettyTime: string;
  totalDuration: number;
  prettyDuration: string;
  percentage: number;
};

function useLastWatched() {
  const [lastWatched, setLastWatched] = React.useState<LastWatched[]>([]);

  React.useEffect(() => {
    const lastWatched = localStorage.getItem("lastWatched");
    if (lastWatched) {
      setLastWatched(JSON.parse(lastWatched));
    }
  }, []);

  return [lastWatched, setLastWatched] as const;
}

function convertSeconds(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}`;
}

export function VideoContainer({ videoId }: { videoId: string }) {
  const [lastTime, setLastTime] = React.useState(0);
  const playerRef = React.useRef<YT.Player | null>(null);

  const { width } = useWindowSize();

  const [isRendered, setIsRendered] = React.useState(false);
  const [elapsedTime, setElapsedTime] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);

  const [lastWatched, setLastWatched] = useLastWatched();
  const lastWatchedRef = React.useRef(lastWatched);

  React.useEffect(() => {
    let intervalId: number;
    if (isRendered) {
      if (!playerRef.current) {
        const offset = width < 768 ? 0 : 64;
        const maxWidth = Math.min(960 - offset, width - offset);
        const height = maxWidth * NINE_PER_SIXTEEN;

        const player = new YT.Player("player", {
          width: maxWidth,
          height,
          videoId: undefined,
          playerVars:
            lastTime === 0
              ? undefined
              : {
                  start: lastTime,
                },
          events: {
            onReady: () => {
              playerRef.current = player;
            },
            onStateChange: (event) => {
              try {
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
              } catch {}
            },
          },
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
      } else {
      }
    }

    intervalId = window.setInterval(() => {
      try {
        const player = playerRef.current;
        if (player) {
          const videoID = getYoutubeVideoId(player.getVideoUrl()).id;
          if (videoID) {
            const timeElapsed = player.getCurrentTime();
            const totalDuration = player.getDuration();

            const lastWatched = {
              videoID,
              title: player.getIframe().title,
              thumbnail: `https://img.youtube.com/vi/${videoID}/0.jpg`,
              timeElapsed: timeElapsed,
              prettyTime: convertSeconds(timeElapsed),
              totalDuration,
              prettyDuration: convertSeconds(totalDuration),
              percentage: (timeElapsed / totalDuration) * 100,
            };

            const localLastWatched = JSON.parse(localStorage.getItem("lastWatched") ?? "[]");

            const updatedLastWatched = localLastWatched.filter((watched: LastWatched) => watched.videoID !== videoID);

            const currentLastWatched = [lastWatched, ...updatedLastWatched].slice(0, 10);

            localStorage.setItem("lastWatched", JSON.stringify(currentLastWatched));
            lastWatchedRef.current = currentLastWatched;
          }
        }
      } catch {}
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isRendered, lastTime, width]);

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

  React.useEffect(() => {
    if (videoId) {
      dismissToast("youtube-error");
    } else {
      setLastTime(0);
      if (lastWatchedRef.current.length > 0) {
        setLastWatched(lastWatchedRef.current);
      }
    }
  }, [setLastWatched, videoId]);

  const {
    data: translation,
    isLoading: isLoadingTranslation,
    error: translationError,
  } = useSWRImmutable<SubtitleResponse>(
    videoId ? `https://content.hanzi.id/subtitles/${videoId}/${locale}.json` : undefined,
    fetcher as any,
    {
      shouldRetryOnError: false,
    }
  );

  const {
    data: subtitles,
    isLoading: isLoadingSubtitles,
    error: subtitlesError,
  } = useSWRImmutable<SubtitleResponse>(
    videoId ? `https://content.hanzi.id/subtitles/${videoId}/${isSimplified ? "zh-CN" : "zh-TW"}.json` : undefined
  );

  const { sections, currentTranslation } = useSubtitlesTranslation({
    subtitles,
    translation,
    elapsedTime: elapsedTime + 0.125,
  });

  const isLoading = isLoadingSubtitles || isLoadingTranslation;

  React.useEffect(() => {
    if (!isLoading && videoId && playerRef.current) {
      playerRef.current.loadVideoById(videoId, lastTime);
      window.scrollTo({ top: 0 });
    } else if (!videoId) {
      playerRef.current?.pauseVideo();
    }
  }, [isLoading, lastTime, videoId]);

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
      <div
        aria-hidden={!videoId}
        className={cn("mt-4 duration-200", videoId ? "opacity-100" : "opacity-0 pointer-events-none")}
      >
        <div id="player"></div>
      </div>

      <div className="mt-4 px-2">
        {sections && (
          <SectionsContainer
            isPlaying={isPlaying}
            sections={sections}
            flashcardName={`${videoId}-${playerRef.current?.getIframe().title}`}
          >
            <p className="text-xl text-center text-secondary">{currentTranslation?.text}</p>
          </SectionsContainer>
        )}
      </div>
    </React.Fragment>
  );
}
