import { Layout } from "@/modules/layout";
import { CameraIcon } from "lucide-react";
import React from "react";
import { buttons, ReadingType } from "./constants";

export function NewReadingOnboarding({ onSelected }: { onSelected: (type: ReadingType) => void }) {
  return (
    <Layout>
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
            maxLength={500}
          />
        </div>
      </div>
      <div className="mt-4 grid sm:grid-cols-2 md:grid-cols-3 gap-2">
        {buttons.map((button, index) => {
          return (
            <button
              key={button.type}
              type="submit"
              onClick={() => {
                onSelected(button.type);
              }}
              className="relative flex flex-col items-center text-left gap-2 border border-subtle hover:bg-hovered p-4 rounded-lg duration-[200ms]"
            >
              <span className="absolute left-3 top-2 text-secondary text-xs">{index + 1}</span>
              {button.icon}
              <span className="text-secondary">{button.text}</span>
            </button>
          );
        })}
      </div>
    </Layout>
  );
}
