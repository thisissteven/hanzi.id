import { useDebounce } from "@/utils";
import { PauseIcon } from "../icons/pause-icon";
import { PlayIcon } from "../icons/play-icon";

export function PlayButton({ isPlaying, onClick }: { isPlaying: boolean; onClick: () => void }) {
  const Icon = useDebounce(isPlaying, 150) ? PauseIcon : PlayIcon;

  return (
    <button
      type="button"
      className="group relative flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-primary hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-black focus:ring-primary/50 focus:ring-offset-2"
      onClick={onClick}
      aria-label={isPlaying ? "Pause" : "Play"}
    >
      <div className="absolute -inset-3 md:hidden" />
      <Icon className="h-7 w-7 focus:ring-primary fill-softblack group-active:fill-softblack/80" />
    </button>
  );
}
