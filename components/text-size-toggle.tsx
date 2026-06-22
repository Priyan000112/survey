"use client";

import { useEffect, useState } from "react";
import { Type } from "lucide-react";
import { getTextScale, setTextScale, type TextScale } from "@/lib/storage";

export function TextSizeToggle() {
  const [scale, setScale] = useState<TextScale>("normal");

  useEffect(() => {
    const nextScale = getTextScale();
    setScale(nextScale);
    document.documentElement.dataset.textScale = nextScale;
  }, []);

  function applyScale(nextScale: TextScale) {
    setScale(nextScale);
    setTextScale(nextScale);
    document.documentElement.dataset.textScale = nextScale;
  }

  return (
    <div className="fixed right-3 top-3 z-50 rounded-lg border border-stone-200 bg-white/95 p-1 shadow-soft backdrop-blur">
      <div className="flex items-center gap-1">
        <Type className="ml-2 h-4 w-4 text-brand-700" aria-hidden="true" />
        <button
          type="button"
          className={`focus-ring rounded-md px-3 py-2 text-sm font-semibold ${
            scale === "normal" ? "bg-brand-600 text-white" : "text-stone-600"
          }`}
          onClick={() => applyScale("normal")}
          aria-pressed={scale === "normal"}
        >
          A-
        </button>
        <button
          type="button"
          className={`focus-ring rounded-md px-3 py-2 text-sm font-semibold ${
            scale === "large" ? "bg-brand-600 text-white" : "text-stone-600"
          }`}
          onClick={() => applyScale("large")}
          aria-pressed={scale === "large"}
        >
          A+
        </button>
      </div>
    </div>
  );
}
