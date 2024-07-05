import { useLocale } from "@/locales/use-locale";
import clsx from "clsx";
import React from "react";
import Tesseract, { createWorker } from "tesseract.js";
import { GeneratedText } from "./generated-text";

export function TextResultImage({ isLoading, imageUrls }: { isLoading: boolean; imageUrls: string[] }) {
  const [isGeneratingText, setIsGeneratingText] = React.useState(false);
  const [stage, setStage] = React.useState("");
  const [textResult, setTextResult] = React.useState<Array<{ text: string[]; page: number }>>([]);

  const { t } = useLocale();

  React.useEffect(() => {
    setTextResult([]);
  }, [imageUrls]);

  const processImages = async (urls: string[], worker: Tesseract.Worker) => {
    const canvas = document.createElement("canvas");
    const img = new Image();

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];

      await new Promise<void>((resolve) => {
        img.onload = async () => {
          canvas.width = img.width;
          canvas.height = img.height;
          const context = canvas.getContext("2d");
          if (!context) return;

          context.drawImage(img, 0, 0);

          // Convert the rendered canvas to grayscale
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          for (let j = 0; j < data.length; j += 4) {
            const avg = (data[j] + data[j + 1] + data[j + 2]) / 3;
            data[j] = avg; // Red
            data[j + 1] = avg; // Green
            data[j + 2] = avg; // Blue
          }

          // Apply a threshold to create a binary image
          const threshold = 200; // Adjust the threshold value as needed
          for (let j = 0; j < data.length; j += 4) {
            const gray = data[j];
            if (gray > threshold) {
              data[j] = 255; // Red
              data[j + 1] = 255; // Green
              data[j + 2] = 255; // Blue
            } else {
              data[j] = 0; // Red
              data[j + 1] = 0; // Green
              data[j + 2] = 0; // Blue
            }
          }

          context.putImageData(imageData, 0, 0);

          const updatedUrl = canvas.toDataURL("image/png");

          const ret = await worker.recognize(updatedUrl);
          const text = ret.data.text.split("\n");

          setTextResult((prev) => [...prev, { text, page: i + 1 }]);

          context.clearRect(0, 0, canvas.width, canvas.height);
          img.src = "";

          resolve();
        };
        img.onerror = () => {
          resolve();
        };
        img.src = url;
      });
    }
  };

  return (
    <div className="max-md:mt-4 md:max-h-[calc(100dvh-20.5rem)] flex-1 rounded-md border border-secondary/40 border-dashed">
      <div
        className={clsx(
          "relative px-4 scrollbar h-full",
          isLoading ? "overflow-y-hidden opacity-50" : "md:overflow-y-auto"
        )}
      >
        {textResult.length > 0 ? (
          <GeneratedText textResult={textResult} isLoading={isGeneratingText} isImage />
        ) : (
          <div className="max-md:h-44 grid place-items-center w-full h-full">
            <button
              disabled={isLoading || imageUrls.length === 0 || isGeneratingText}
              className="w-fit rounded-md py-2 px-6 active:bg-hovered duration-200 disabled:pointer-events-none disabled:border-none disabled:opacity-50 disabled:bg-transparent bg-subtle/50"
              onClick={async () => {
                setIsGeneratingText(true);
                const numOfPages = imageUrls.length;
                const workersToCreate = Math.min(Math.floor(Math.max(numOfPages / 10, 1)), 10);
                const workers = await Promise.all(
                  Array.from({ length: workersToCreate }, async () => {
                    const worker = createWorker("chi_sim", 1, {
                      logger: (m) => setStage(m.status),
                    });

                    (await worker).setParameters({ preserve_interword_spaces: "1" });

                    return worker;
                  })
                );

                const pagesDataPromises = [];
                for (let i = 0; i < workersToCreate; i++) {
                  const worker = workers[i];
                  const { start, end } = {
                    start: i * Math.ceil(numOfPages / workersToCreate) + 1,
                    end: Math.min((i + 1) * Math.ceil(numOfPages / workersToCreate), numOfPages),
                  };
                  pagesDataPromises.push(processImages(imageUrls.slice(start - 1, end), worker));
                }

                await Promise.all(pagesDataPromises);

                setIsGeneratingText(false);

                for (const worker of workers) {
                  await worker.terminate();
                }
              }}
            >
              {isGeneratingText ? stage : t.convertToText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
