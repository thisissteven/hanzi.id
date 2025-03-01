import { useReading } from "@/modules/layout";
import { ZapIcon, ZapOffIcon } from "lucide-react";
import React from "react";

export function ChangeMode() {
  const { mode, changeMode } = useReading();

  return (
    <button
      onClick={() => {
        changeMode(mode === "normal" ? "flash" : "normal");
      }}
      className="active:bg-hovered text-smokewhite p-2 rounded-md duration-200"
    >
      {mode === "normal" ? <ZapIcon size={22} /> : <ZapOffIcon size={22} />}
    </button>
  );
}
