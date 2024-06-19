import React from "react";

export function ProgressBar({ value }: { value: number }) {
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={1}
      aria-valuenow={value}
      className="h-2 w-full rounded-full bg-empty overflow-hidden"
    >
      <div
        style={{
          width: `${value * 100}%`,
        }}
        className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 transition"
      ></div>
    </div>
  );
}
