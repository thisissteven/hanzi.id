import { AnimatePresence, motion } from "framer-motion";
import { Layout } from "./layout";
import { FormProvider, useForm } from "react-hook-form";
import { NewReadingProps } from "../new";

import React from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "@/utils";
import { usePathname } from "next/navigation";

export const defaultValues = {
  title: "",
  description: "",
  image: null,
  chapters: [
    {
      title: "",
      content: "",
    },
  ],
};

const dummyDefaultValues = {
  title: "Their Side",
  description: "Conversations with the most tragically misunderstood people of our time.",
  image: {
    smallUrl:
      "https://res.cloudinary.com/drjgq6umm/image/upload/c_limit,h_92,w_92/dpr_2.0/v1718698982/uploads/focus-web-app/poster_rm1k6w.png",
    mediumUrl:
      "https://res.cloudinary.com/drjgq6umm/image/upload/c_limit,h_184,w_184/dpr_2.0/v1718698982/uploads/focus-web-app/poster_rm1k6w.png",
    source:
      "https://res.cloudinary.com/drjgq6umm/image/upload/c_limit,w_430/dpr_2.0/v1718698982/uploads/focus-web-app/poster_rm1k6w.png",
    width: 960,
    height: 960,
  },
  chapters: [
    {
      title: "Skeletor",
      content:
        "You know him as an evil supervillain, but his closest friends call him Jeff, and he's just doing his best to find his way in a world that doesn't know what to do with a talking skeleton.",
    },
    {
      title: "Hank Scorpio",
      content:
        "What looks to outsiders like a malicious plan to conquer the east coast, was actually a story of liberation and freedom if you get it straight from the source.",
    },
    {
      title: "The Wet Bandits",
      content:
        "The Christmas of 1989 wasn't the first time Harry and Marv crossed paths with the McCallisters. The real story starts in 1973, when Peter tripped Marv in the highschool locker room.",
    },
  ],
};

export function NewReadingLayout({ children }: { children: React.ReactNode }) {
  const methods = useForm<NewReadingProps>({
    defaultValues: dummyDefaultValues,
  });

  const pathname = usePathname();

  const isStepOne = pathname === "/new";
  const isStepTwo = ["/new/text", "/new/image", "/new/pdf"].includes(pathname);
  const isPreview = pathname === "/new/preview";

  return (
    <Layout>
      <div className="min-h-dvh">
        <main className="max-w-[960px] mx-auto md:px-8 pb-4">
          <div className="max-md:sticky top-0 h-[11.25rem] flex flex-col justify-end bg-black z-10 max-md:px-4 pb-4 border-b-[1.5px] border-b-subtle">
            <AnimatePresence mode="wait">
              <motion.h1
                key={pathname}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "tween", duration: 0.2 }}
                className="text-2xl md:text-3xl font-bold"
              >
                {isStepOne && "Metadata"}
                {isStepTwo && "Add content"}
                {isPreview && "Preview"}
              </motion.h1>
            </AnimatePresence>
          </div>

          <FormProvider {...methods}>
            <AnimatePresence mode="wait">{children}</AnimatePresence>
          </FormProvider>
        </main>
      </div>
    </Layout>
  );
}

const ConfettiContext = React.createContext(
  {} as {
    party: () => void;
  }
);

export function useConfetti() {
  return React.useContext(ConfettiContext);
}

export function ConfettiProvider({ children }: { children: React.ReactNode }) {
  const [party, setParty] = React.useState(false);

  const { width, height } = useWindowSize();

  return (
    <ConfettiContext.Provider
      value={{
        party: () => setParty(true),
      }}
    >
      <div className="fixed z-50 top-0 h-screen w-screen pointer-events-none">
        <Confetti
          width={width}
          height={height}
          numberOfPieces={party ? 800 : 0}
          tweenDuration={20000}
          recycle={false}
          onConfettiComplete={(confetti) => {
            setParty(false);
            confetti?.reset();
          }}
        />
      </div>
      {children}
    </ConfettiContext.Provider>
  );
}
