import React from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/utils";

const texts = [
  "Welcome to Flow.",
  "Clear your mind through raw, unfiltered writing.",
  "Thoughts will fade into the background to make space for new ones.",
  "Feel free to alter your thoughts within 5 minutes, after which you can leave them to rest.",
  "Don't worry. You can always come back to read your thought process.",
];

export default function Home() {
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
    <div className="bg-deepblack min-h-dvh">
      <main className="max-w-[960px] mx-auto px-4 md:px-8 py-32">
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
      </main>
    </div>
  );
}

type LineProps = {
  onMouseEnter: (e: React.MouseEvent<HTMLLIElement>) => void;
  index: number;
  currentSentenceIndex: number;
  children: React.ReactNode;
};

function Line({ onMouseEnter, index, currentSentenceIndex, children }: LineProps) {
  const shouldBlur = index < currentSentenceIndex;
  const shouldShow = index === currentSentenceIndex;
  const isNotYetRevealed = index > currentSentenceIndex;
  const isRevealed = !isNotYetRevealed && index < currentSentenceIndex;
  const isLast = index === texts.length - 1;

  return (
    <li
      onMouseEnter={onMouseEnter}
      className={cn(
        "relative px-3 md:px-4 ease duration-500",
        shouldBlur && !isLast && "blur-[2px] duration-[2000ms]",
        shouldShow && "opacity-100",
        isRevealed && !isLast && "opacity-30 duration-[2000ms]",
        isNotYetRevealed && "opacity-0",
        isRevealed && "cursor-default hover:blur-0 hover:opacity-100 hover:delay-0 hover:duration-[200ms]"
      )}
    >
      <p className="py-2 relative pointer-events-none">{children}</p>
    </li>
  );
}
