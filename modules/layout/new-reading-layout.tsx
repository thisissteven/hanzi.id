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
  title: "放学后 (Keigo Higashino)",
  description:
    'In "After School" by Keigo Higashino, a high school teacher becomes embroiled in a complex mystery involving his old friends, now adults, as they uncover secrets and face the consequences of their past.',
  image: {
    height: 640,
    mediumUrl:
      "https://res.cloudinary.com/drjgq6umm/image/upload/c_limit,h_184,w_184/dpr_2.0/v1719325046/uploads/focus-web-app/S85ad64401e7e464397194b5b4127bb949.jpg_640x640Q90.jpg__f8mfk9.webp",
    smallUrl:
      "https://res.cloudinary.com/drjgq6umm/image/upload/c_limit,h_92,w_92/dpr_2.0/v1719325046/uploads/focus-web-app/S85ad64401e7e464397194b5b4127bb949.jpg_640x640Q90.jpg__f8mfk9.webp",
    source:
      "https://res.cloudinary.com/drjgq6umm/image/upload/c_limit,w_430/dpr_2.0/v1719325046/uploads/focus-web-app/S85ad64401e7e464397194b5b4127bb949.jpg_640x640Q90.jpg__f8mfk9.webp",
    width: 640,
  },
  chapters: [
    {
      title: "",
      content: "",
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
