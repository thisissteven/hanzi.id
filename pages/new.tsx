import { Divider } from "@/components";
import { Layout } from "@/modules/layout";
import { cn } from "@/utils";
import { AnimatePresence } from "framer-motion";
import { CameraIcon, FileTextIcon, ImageUpIcon, TypeIcon } from "lucide-react";
import React from "react";

type ReadingType = "pdf" | "text" | "image";

const buttons: Array<{
  icon: React.ReactNode;
  text: string;
  type: ReadingType;
}> = [
  {
    icon: <FileTextIcon />,
    text: "Extract Text from PDF",
    type: "pdf",
  },
  {
    icon: <TypeIcon />,
    text: "Type or Paste Text",
    type: "text",
  },
  {
    icon: <ImageUpIcon />,
    text: "Upload Image/s",
    type: "image",
  },
];

function CreateNewReading({ type, onReturn }: { type: ReadingType; onReturn: () => void }) {
  return (
    <Layout>
      <div className="">
        <button
          onClick={onReturn}
          className={cn(
            "mt-4 ease duration-500 py-2 pl-3 pr-4 rounded-md",
            "duration-300 hover:bg-hovered active:bg-hovered",
            "flex items-center gap-2"
          )}
          aria-label="Continue"
        >
          <div className="mb-[3px]">&#8592;</div> Return
        </button>
        <div className="mt-4 flex max-md:flex-col gap-4">
          <div>
            <div className="w-full aspect-square sm:w-48 bg-transparent border border-gray border-dashed hover:bg-stone-500/5 active:bg-subtle/40 duration-[200ms] rounded-md grid place-items-center relative">
              <CameraIcon size={32} className="text-secondary" />
              <input
                type="file"
                accept="image/jpeg, image/png, image/gif"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>
          <div className="flex flex-col gap-4 flex-1">
            <input
              className="bg-transparent px-3 py-2 rounded-md border border-subtle ring-offset-black ring-gray focus:ring-offset-2 focus:ring-2 transition-shadow duration-[200ms] placeholder:text-secondary/50 focus:outline-none w-full"
              type="text"
              placeholder="What is the title of this reading?"
              required
            />

            <textarea
              className="bg-transparent px-3 py-2 rounded-md border border-subtle ring-offset-black ring-gray focus:ring-offset-2 focus:ring-2 transition-shadow duration-[200ms] placeholder:text-secondary/50 focus:outline-none w-full h-[8.5rem]"
              placeholder="What is this reading about?"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default function New() {
  const [readingType, setReadingType] = React.useState<ReadingType | null>();
  return (
    <Layout>
      <div className="min-h-dvh">
        <main className="max-w-[960px] mx-auto px-4 md:px-8 py-32">
          <h1 className="text-2xl md:text-3xl font-bold">New Reading</h1>

          <Divider />

          <AnimatePresence mode="wait" initial={false}>
            {readingType ? (
              <CreateNewReading key="create" type={readingType} onReturn={() => setReadingType(null)} />
            ) : (
              <Layout>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {buttons.map((button) => {
                    return (
                      <button
                        key={button.type}
                        onClick={() => setReadingType(button.type)}
                        className="flex flex-col text-left gap-2 hover:bg-hovered p-4 rounded-lg duration-[200ms]"
                      >
                        {button.icon}
                        <span className="text-secondary">{button.text}</span>
                      </button>
                    );
                  })}
                </div>
              </Layout>
            )}
          </AnimatePresence>
        </main>
      </div>
    </Layout>
  );
}
