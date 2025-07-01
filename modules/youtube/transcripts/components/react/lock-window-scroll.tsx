"use client";

import { LucideLock, LucideLockOpen } from "lucide-react";
import { useEffect, useState } from "react";

export function LockWindowScroll() {
  const [lock, setLock] = useState(false);

  useEffect(() => {
    if (lock) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [lock]);

  return (
    <button
      title="lock/unlock window scroll"
      className="absolute top-1/2 -translate-y-1/2 right-2 text-smokewhite"
      onClick={() => setLock(!lock)}
    >
      {lock ? <LucideLock className="w-5 h-5" /> : <LucideLockOpen className="w-5 h-5 opacity-50" />}
    </button>
  );
}
