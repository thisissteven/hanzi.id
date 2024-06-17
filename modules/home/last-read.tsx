import { Divider } from "@/components";
import React from "react";

export function LastRead() {
  return (
    <React.Fragment>
      <h2 className="text-xl md:text-2xl font-semibold">Continue Reading</h2>

      <Divider />

      <div className="grid sm:grid-cols-2 md:grid-cols-3">
        <div className="w-full h-40 rounded-xl bg-white"></div>
      </div>
    </React.Fragment>
  );
}
