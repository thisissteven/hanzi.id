import { cn } from "@/utils";
import React, { useEffect, useState } from "react";

export const SoundWave = React.memo(
  function SoundWave({ isPlaying }: { isPlaying: boolean }) {
    const [barHeights, setBarHeights] = useState(new Array(11).fill(1.25)); // Initial heights

    useEffect(() => {
      const updateBars = () => {
        const newHeights = Array.from({ length: 11 }, () => {
          return Math.random() * 24 + 8;
        });
        setBarHeights(newHeights);
      };

      const intervalId = isPlaying
        ? setInterval(updateBars, 200)
        : (function reset() {
            setBarHeights(new Array(11).fill(1.25));
            return undefined;
          })(); // Update every 200ms

      return () => clearInterval(intervalId);
    }, [isPlaying]);

    return (
      <div className="pointer-events-none absolute opacity-80 w-full aspect-square grid place-items-center top-4">
        <div className="grid h-full grid-cols-11 justify-center gap-1.5 bg-transparent max-w-11">
          {barHeights.map((height, index) => (
            <div
              key={index}
              className="col-span-1 mx-auto my-auto w-[2.25px] scale-125 rounded-full bg-white/80 duration-300"
              style={{ height: `${height}px` }}
            ></div>
          ))}
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.isPlaying === nextProps.isPlaying;
  }
);

export const SoundWaveMobile = React.memo(
  function SoundWave({ isPlaying }: { isPlaying: boolean }) {
    const [barHeights, setBarHeights] = useState(new Array(6).fill(1)); // Initial heights

    useEffect(() => {
      const updateBars = () => {
        const newHeights = Array.from({ length: 6 }, () => {
          return Math.random() * 12 + 4;
        });
        setBarHeights(newHeights);
      };

      const intervalId = isPlaying
        ? setInterval(updateBars, 200)
        : (function reset() {
            setBarHeights(new Array(6).fill(1));
            return undefined;
          })(); // Update every 200ms

      return () => clearInterval(intervalId);
    }, [isPlaying]);

    return (
      <div
        className={cn(
          "pointer-events-none absolute bg-black/50 w-full h-full inset-0 grid place-items-center",
          isPlaying ? "opacity-100 duration-100" : "opacity-0 duration-500"
        )}
      >
        <div className="grid h-full grid-cols-6 justify-center gap-0.5 bg-transparent max-w-11">
          {barHeights.map((height, index) => (
            <div
              key={index}
              className="col-span-1 mx-auto my-auto w-[1.25px] scale-125 rounded-full bg-white/80 duration-300"
              style={{ height: `${height}px` }}
            ></div>
          ))}
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.isPlaying === nextProps.isPlaying;
  }
);
