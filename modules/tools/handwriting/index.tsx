import { usePreferences } from "@/components";
import { useWindowSize } from "@/hooks";
import { useLocale } from "@/locales/use-locale";
import { LucideDelete, LucideRedo2, LucideSpace, LucideUndo2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const MAX_WIDTH_LG = 542;
const MAX_WIDTH_MD = 558;
const MAX_WIDTH_SM = 600;
const MAX_HEIGHT = 320;

const defaultText = ["。", "，", "？", "！", "、", "；", "：", "“", "”", "‘", "’", "（", "）", "《", "》", "【", "】"];

export function HandwritingComponent({ onSelected }: { onSelected: (text: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hwCanvasRef = useRef<any | null>(null);
  const [recognizedText, setRecognizedText] = useState<string[]>(defaultText);
  const recognitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { t } = useLocale();

  const { width } = useWindowSize();
  const { isSimplified } = usePreferences();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (typeof window !== "undefined" && canvas) {
      const handwriting = window.handwriting;

      const isSmall = width < 640;
      const isMd = width < 768;
      const padding = isMd ? 34 : 40;

      const maxWidth = isSmall ? MAX_WIDTH_SM : isMd ? MAX_WIDTH_MD : MAX_WIDTH_LG;

      canvas.width = Math.min(maxWidth, width - padding);
      canvas.height = Math.min(MAX_HEIGHT, width - padding);

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.strokeStyle = "#f8f8f8";
      }

      if (handwriting) {
        hwCanvasRef.current = new handwriting.Canvas(canvas, 3);

        // Enable undo/redo
        hwCanvasRef.current.set_Undo_Redo(true, true);

        hwCanvasRef.current.setCallBack((results: any, error: any) => {
          if (error) {
            console.error("Recognition error:", error);
          } else {
            if (results) {
              setRecognizedText(results);
            }
          }
        });

        // Additional configuration if needed
        hwCanvasRef.current.setOptions({
          width: canvasRef.current.width,
          height: canvasRef.current.height,
          language: isSimplified ? "zh_CN" : "zh_TW", // Adjust language as per your needs
          numOfWords: 1, // Example: Limit recognition to single word
          numOfReturn: 5, // Example: Limit to 5 recognition results
        });
      }
    }
  }, [width, isSimplified]);

  const clearCanvas = () => {
    if (hwCanvasRef.current) {
      hwCanvasRef.current.erase();
      setRecognizedText(defaultText);
    }
  };

  const handleUndo = () => {
    if (hwCanvasRef.current) {
      hwCanvasRef.current.undo();
    }
  };

  const handleRedo = () => {
    if (hwCanvasRef.current) {
      hwCanvasRef.current.redo();
    }
  };

  const handleRecognize = () => {
    if (hwCanvasRef.current) {
      hwCanvasRef.current.recognize(
        hwCanvasRef.current.trace,
        hwCanvasRef.current.options,
        (results: any, error: any) => {
          if (error) {
            console.error("Recognition error:", error);
          } else {
            if (results) {
              setRecognizedText(results);
            }
          }
        }
      );
    }
  };

  return (
    <div className="md:px-2 w-full mx-auto">
      <canvas
        className="bg-softzinc rounded-md"
        id="myCanvas"
        ref={canvasRef}
        onPointerDown={(e) => {
          e.stopPropagation();
        }}
        onMouseUp={() => {
          clearTimeout(recognitionTimeoutRef.current!); // Clear previous timeout
          recognitionTimeoutRef.current = setTimeout(handleRecognize, 300);
        }}
        onTouchEnd={() => {
          clearTimeout(recognitionTimeoutRef.current!); // Clear previous timeout
          recognitionTimeoutRef.current = setTimeout(handleRecognize, 300);
        }}
      ></canvas>
      <div className="mt-2 pt-1 px-2 bg-subtle/50 rounded-md">
        <span className="text-xs text-secondary">{t.found}</span>
        <div className="mt-1 flex gap-1 overflow-x-auto scrollbar pb-2">
          {recognizedText &&
            recognizedText.map((text, index) => (
              <button
                onClick={() => {
                  if (hwCanvasRef.current) {
                    onSelected(text);
                    hwCanvasRef.current.erase();
                    setRecognizedText(defaultText);
                  }
                }}
                key={index}
                className="select-none shrink-0 p-0.5 text-lg sm:text-xl h-10 sm:h-12 aspect-square border border-secondary/10 grid place-items-center rounded-md active:bg-hovered duration-200"
              >
                {text}
              </button>
            ))}
        </div>
      </div>
      <div className="mt-2 flex gap-2">
        <button onClick={handleUndo} className="p-2.5 rounded-md bg-subtle/50 active:bg-hovered duration-200">
          <LucideUndo2 />
        </button>
        <button onClick={handleRedo} className="p-2.5 rounded-md bg-subtle/50 active:bg-hovered duration-200">
          <LucideRedo2 />
        </button>
        <button
          onClick={handleRedo}
          className="flex-1 grid place-items-center p-2.5 rounded-md bg-subtle/50 active:bg-hovered duration-200"
        >
          <LucideSpace />
        </button>
        <button onClick={clearCanvas} className="p-2.5 rounded-md bg-subtle/50 active:bg-hovered duration-200">
          <LucideDelete />
        </button>
      </div>
    </div>
  );
}
