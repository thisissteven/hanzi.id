"use client";
import { cn } from "@/utils";
import { LucideCopy, LucideCopyCheck } from "lucide-react";
import { useRef, useState } from "react";

export function CopyButton({ text, className = "top-4" }: { text: string; className?: string }) {
  const [isCopied, setIsCopied] = useState(false);
  const timeoutRef = useRef<any>(0);

  return (
    <div className={cn("absolute right-4", className)}>
      <button
        onClick={() => {
          clearTimeout(timeoutRef.current);
          navigator.clipboard.writeText(text);
          setIsCopied(true);
          timeoutRef.current = setTimeout(() => {
            setIsCopied(false);
          }, 3000);
        }}
        className="text-smokewhite opacity-50 active:opacity-100"
      >
        {isCopied ? <LucideCopyCheck className="w-5 h-5" /> : <LucideCopy className="w-5 h-5" />}
      </button>
    </div>
  );
}
