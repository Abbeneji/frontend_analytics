"use client";

import { createContext, useContext, useState, ReactNode, useMemo } from "react";

// Preset ranges to use across UI
export type DateRangePreset = "7d" | "30d" | "90d" | "24h" | "custom";

export interface DateRange {
  from: number;
  to: number;
  preset: DateRangePreset;
}

const DateFilterContext = createContext<{
  range: DateRange;
  setPreset: (preset: DateRangePreset) => void;
  setCustomRange: (from: number, to: number) => void;
} | null>(null);

// Helper for presets
function computePreset(preset: DateRangePreset): { from: number; to: number } {
  const now = Date.now();

  switch (preset) {
    case "24h":
      return { from: now - 1 * 24 * 60 * 60 * 1000, to: now };
    case "7d":
      return { from: now - 7 * 24 * 60 * 60 * 1000, to: now };
    case "30d":
      return { from: now - 30 * 24 * 60 * 60 * 1000, to: now };
    case "90d":
      return { from: now - 90 * 24 * 60 * 60 * 1000, to: now };
    default:
      return { from: now - 30 * 24 * 60 * 60 * 1000, to: now }; // fallback
  }
}

export function DateFilterProvider({ children }: { children: ReactNode }) {
  const [range, setRange] = useState<DateRange>(() => {
    const { from, to } = computePreset("30d");
    return { from, to, preset: "30d" };
  });

  function setPreset(preset: DateRangePreset) {
    const { from, to } = computePreset(preset);
    setRange({ from, to, preset });
  }

  function setCustomRange(from: number, to: number) {
    setRange({ from, to, preset: "custom" });
  }

  return (
    <DateFilterContext.Provider value={{ range, setPreset, setCustomRange }}>
      {children}
    </DateFilterContext.Provider>
  );
}

export function useDateFilter() {
  const ctx = useContext(DateFilterContext);
  if (!ctx) throw new Error("useDateFilter must be inside DateFilterProvider");
  return ctx;
}
