import React from "react";
import { Line } from "./line";
import { ContinueButton } from "./continue-button";
import { Layout } from "../layout";

export * from "./use-onboarded";

const texts = [
  "Welcome to Flow.",
  "Clear your mind through raw, unfiltered writing.",
  "Thoughts will fade into the background to make space for new ones.",
  "Feel free to alter your thoughts within 5 minutes, after which you can leave them to rest.",
  "Don't worry. You can always come back to read your thought process.",
];

export function Onboarding({ onContinue }: { onContinue: () => void }) {
  const [currentSentenceIndex, setCurrentSentenceIndex] = React.useState(4);

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

  return (
    <Layout>
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
            className="absolute opacity-0 w-full bg-[#242424] rounded-lg ease duration-[200ms] will-change-transform"
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
                    const justEntered = ["0", ""].includes(ref.current.style.opacity);
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

        <ContinueButton isEnd={isEnd} onClick={onContinue} />
      </article>
    </Layout>
  );
}
