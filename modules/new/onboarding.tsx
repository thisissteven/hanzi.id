import { Layout } from "@/modules/layout";
import { CameraIcon } from "lucide-react";
import React from "react";
import { buttons, NewReadingProps, ReadingType } from "./constants";
import { useFormContext } from "react-hook-form";
import { cn, uploadImage } from "@/utils";
import Image from "next/image";
import { Loader } from "./loader";
import { useStepFormActions } from "./store";

export function NewReadingOnboarding({ onSelected }: { onSelected: (type: ReadingType) => void }) {
  const { register, setValue, watch, getValues } = useFormContext<NewReadingProps>();

  const [source, setSource] = React.useState<string | null>(watch("image")?.source || null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const { setData } = useStepFormActions();

  return (
    <Layout>
      <div className="mt-4 flex max-md:flex-col gap-4">
        <div>
          <div className="w-full aspect-square sm:w-48 bg-transparent border border-smoke border-dashed group rounded-md relative overflow-hidden">
            {source && (
              <div
                className={cn(
                  "absolute inset-0 w-full h-full group-hover:opacity-50 group-active:opacity-50 duration-[200ms]",
                  isLoading ? "opacity-50" : "opacity-100"
                )}
              >
                <Image src={source} width={184} height={184} alt="cover" className="object-cover w-full h-full" />
              </div>
            )}

            <div
              className={cn(
                "absolute inset-0 w-full h-full pointer-events-none group-hover:bg-stone-500/5 group-active:bg-subtle/40 duration-[200ms] grid place-items-center",
                source && !isLoading && "opacity-0 group-hover:opacity-100 group-active:opacity-100"
              )}
            >
              {isLoading ? <Loader /> : <CameraIcon size={32} className="text-secondary" />}
            </div>

            <input
              type="file"
              accept="image/jpeg, image/png, image/gif"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={async (e) => {
                setIsLoading(true);
                try {
                  if (e.target.files) {
                    const file = e.target.files[0];
                    const formData = new FormData();
                    formData.append("file", file);
                    const { source, width, height } = await uploadImage({
                      formData,
                    });

                    const smallUrl = source.replace("w_430", "h_92,w_92");
                    const mediumUrl = source.replace("w_430", "h_184,w_184");

                    setValue("image", {
                      smallUrl,
                      mediumUrl,
                      source,
                      width,
                      height,
                    });

                    setSource(source);
                  }
                } finally {
                  setIsLoading(false);
                }
              }}
            />
          </div>
        </div>
        <div className="flex flex-col gap-4 flex-1">
          <input
            {...register("title")}
            className="bg-transparent px-3 py-2 rounded-md border border-subtle ring-offset-black ring-smoke focus:ring-offset-2 focus:ring-2 transition-shadow duration-[200ms] placeholder:text-secondary/50 focus:outline-none w-full"
            type="text"
            placeholder="What is the title of this reading?"
            required
          />

          <textarea
            {...register("description")}
            spellCheck="false"
            className="bg-transparent px-3 py-2 rounded-md border border-subtle ring-offset-black ring-smoke focus:ring-offset-2 focus:ring-2 transition-shadow duration-[200ms] placeholder:text-secondary/50 focus:outline-none w-full h-[8.5rem]"
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
              type="button"
              onClick={() => {
                onSelected(button.type);
                setData({
                  step: 1,
                  data: getValues(),
                });
              }}
              className="relative disabled:cursor-not-allowed flex flex-col items-center text-left gap-2 border border-subtle hover:bg-hovered p-4 rounded-lg duration-[200ms]"
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
