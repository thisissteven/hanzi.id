import React from "react";
import { Line } from "./line";
import { ContinueButton } from "./continue-button";
import { Layout } from "@/modules/layout";
import { Divider } from "@/components";
import { useLocale } from "@/locales/use-locale";

export function Onboarding({ onContinue }: { onContinue: () => void }) {
  const { t } = useLocale();

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

    if (currentSentenceIndex < 0 || currentSentenceIndex >= t.onboarding.length) {
      clearTimeout(timeout);
      return;
    }

    const length = t.onboarding[currentSentenceIndex].split(" ").length ?? 5;
    timeout = setTimeout(() => {
      setCurrentSentenceIndex((prev) => {
        return prev + 1;
      });
    }, length * 300 + 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [currentSentenceIndex, t.onboarding]);

  const isEnd = currentSentenceIndex >= t.onboarding.length;

  const ref = React.useRef() as React.MutableRefObject<HTMLDivElement>;

  return (
    <Layout>
      <article className="relative">
        <h1 className="text-3xl font-bold">Onboarding</h1>

        <Divider />

        <ul
          onMouseLeave={() => {
            ref.current.style.transitionProperty = "opacity";
            ref.current.style.opacity = "0";
          }}
          className="relative md:text-lg list-none"
        >
          <div
            ref={ref}
            className="absolute opacity-0 w-full bg-hovered rounded-lg ease duration-200 will-change-transform"
          ></div>

          {t.onboarding.map((text, index) => {
            return (
              <Line
                key={index}
                isLast={index === t.onboarding.length - 1}
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
