import { useDebounce } from "@/utils";
import { PauseIcon } from "../icons/pause-icon";
import { PlayIcon } from "../icons/play-icon";
import { AnimatePresence, motion } from "framer-motion";

export function PlayButton({ isPlaying, onClick }: { isPlaying: boolean; onClick: () => void }) {
  const playing = useDebounce(isPlaying, 150);
  const Icon = playing ? PauseIcon : PlayIcon;

  return (
    <button
      type="button"
      className="group relative flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full hover:bg-hovered active:bg-subtle transition-colors duration-200"
      onClick={onClick}
      aria-label={isPlaying ? "Pause" : "Play"}
    >
      <div className="absolute -inset-3 md:hidden" />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isPlaying.toString()}
          initial={{
            scale: 0.9,
            opacity: 0,
          }}
          animate={{
            scale: 1,
            opacity: 1,
          }}
          exit={{
            scale: 0.9,
            opacity: 0,
          }}
          transition={{
            duration: 0.15,
          }}
          className="flex items-center justify-center w-full h-full"
        >
          <Icon className="h-7 w-7 fill-white group-active:fill-white/80 duration-200" />
        </motion.div>
      </AnimatePresence>
    </button>
  );
}

export function MobilePlayButton({ isPlaying, onClick }: { isPlaying: boolean; onClick: () => void }) {
  const Icon = useDebounce(isPlaying, 150) ? PauseIcon : PlayIcon;

  return (
    <button
      type="button"
      className="group relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full transition-colors duration-200"
      onClick={onClick}
      aria-label={isPlaying ? "Pause" : "Play"}
    >
      <div className="absolute -inset-3 md:hidden" />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isPlaying.toString()}
          initial={{
            scale: 0.9,
            opacity: 0,
          }}
          animate={{
            scale: 1,
            opacity: 1,
          }}
          exit={{
            scale: 0.9,
            opacity: 0,
          }}
          transition={{
            duration: 0.15,
          }}
          className="flex items-center justify-center w-full h-full"
        >
          <Icon className="h-6 w-6 fill-white group-active:fill-white/80 duration-200" />
        </motion.div>
      </AnimatePresence>
    </button>
  );
}
