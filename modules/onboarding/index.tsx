import React from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/utils";
import { Line } from "./line";

const texts = [
  "Welcome to Flow.",
  "Clear your mind through raw, unfiltered writing.",
  "Thoughts will fade into the background to make space for new ones.",
  "Feel free to alter your thoughts within 5 minutes, after which you can leave them to rest.",
  "Don't worry. You can always come back to read your thought process.",
];

export function Onboarding() {
  const [currentSentenceIndex, setCurrentSentenceIndex] = React.useState(-1);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrentSentenceIndex((prev) => {
        return prev + 1;
      });
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  React.useEffect(() => {
    let timeout;

    if (currentSentenceIndex < 0 || currentSentenceIndex >= texts.length) {
      clearTimeout(timeout);
      return;
    }

    const length = texts[currentSentenceIndex].split(" ").length ?? 5;
    timeout = setTimeout(() => {
      setCurrentSentenceIndex((prev) => {
        return prev + 1;
      });
    }, length * 200 + 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [currentSentenceIndex]);

  const isEnd = currentSentenceIndex >= texts.length;

  const ref = React.useRef() as React.MutableRefObject<HTMLDivElement>;

  const router = useRouter();

  return (
    <article className="relative">
      <h1 className="text-3xl font-bold">Onboarding</h1>

      <hr className="w-full h-[1px] bg-[#282828] border-none my-4" />

      <ul
        onMouseLeave={() => {
          ref.current.style.transitionProperty = "opacity";
          ref.current.style.opacity = "0";
        }}
        className="relative md:text-lg list-none"
      >
        <div
          ref={ref}
          className="absolute w-full bg-[#242424] rounded-lg ease duration-[200ms] will-change-transform"
        ></div>

        {texts.map((text, index) => {
          return (
            <Line
              key={index}
              isLast={index === texts.length - 1}
              currentSentenceIndex={currentSentenceIndex}
              index={index}
              onMouseEnter={(e) => {
                if (index > currentSentenceIndex) {
                  ref.current.style.opacity = "0";
                } else {
                  const justEntered = ref.current.style.opacity === "0";
                  if (justEntered) {
                    ref.current.style.transitionProperty = "opacity";
                  } else {
                    ref.current.style.transitionProperty = "transform, height, opacity";
                  }

                  ref.current.style.transform = `translateY(${e.currentTarget.offsetTop}px)`;
                  ref.current.style.height = `${e.currentTarget.offsetHeight}px`;
                  ref.current.style.opacity = "1";
                }
              }}
            >
              {text}
            </Line>
          );
        })}
      </ul>

      <button
        onClick={() => router.push("/read/1")}
        className={cn(
          "mt-4 w-9 h-9 grid place-items-center ease duration-500 text-white pb-2.5 pt-1.5 px-2 rounded-md",
          isEnd ? "opacity-100" : "opacity-0",
          "duration-300 hover:bg-[#242424]"
        )}
        aria-label="Continue"
      >
        &#8594;
      </button>
    </article>
  );
}
