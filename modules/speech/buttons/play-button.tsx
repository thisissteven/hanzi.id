import { useDebounce } from "@/utils";
import { PauseIcon } from "../icons/pause-icon";
import { PlayIcon } from "../icons/play-icon";

export function PlayButton({ isPlaying, onClick }: { isPlaying: boolean; onClick: () => void }) {
  const Icon = useDebounce(isPlaying, 150) ? PauseIcon : PlayIcon;

  return (
    <button
      type="button"
      className="group relative flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full hover:bg-hovered active:bg-subtle transition-colors duration-200"
      onClick={onClick}
      aria-label={isPlaying ? "Pause" : "Play"}
    >
      <div className="absolute -inset-3 md:hidden" />
      <Icon className="h-7 w-7 fill-white group-active:fill-white/80 duration-200" />
    </button>
  );
}
