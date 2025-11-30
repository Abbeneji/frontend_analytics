"use client";

import { useDateFilter } from "@/app/(dashboard)/contexts/date-filter-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CalendarDays } from "lucide-react";

const PRESETS = [
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "Last 90 days", value: "90d" },
  { label: "This month", value: "month" },
  { label: "This year", value: "year" },
];

export function DateFilter() {
  const { range, setPreset } = useDateFilter();

  const currentLabel =
    PRESETS.find((p) => p.value === range.preset)?.label || "Select range";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <CalendarDays className="w-4 h-4" />
          {currentLabel}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        {PRESETS.map((preset) => (
          <DropdownMenuItem
            key={preset.value}
            onClick={() => setPreset(preset.value as any)}
            className={preset.value === range.preset ? "font-medium" : ""}
          >
            {preset.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
