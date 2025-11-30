"use client";

import { useEffect, useState } from "react";
import { HeatmapHeader } from "./components/heatmap-header";
import { HeatmapStats } from "./components/heatmap-stats";
import { HeatmapSelector } from "./components/heatmap-selector";
import { useProject } from "@/app/(dashboard)/contexts/project-context";

type ViewMode = "clicks" | "movement" | "combined";
type TimeRange = "7d" | "30d" | "90d";

type HeatmapPoint = {
  x: number;
  y: number;
  count: number;
};

type HeatmapResponse = {
  bucketSize: number;
  points: HeatmapPoint[];
};

export default function HeatmapPage() {
  const { selectedProject } = useProject();

  const [urls, setUrls] = useState<string[]>([]);
  const [selectedUrl, setSelectedUrl] = useState<string>("");
  const [heatmapData, setHeatmapData] = useState<HeatmapResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");
  const [viewMode, setViewMode] = useState<ViewMode>("combined");

  // ---------------------------------------------
  // Load Page URLs for this project
  // ---------------------------------------------
  useEffect(() => {
    if (!selectedProject) return;

    const controller = new AbortController();
    const projectId = selectedProject.project_id; // TS-safe reassignment

    async function loadUrls() {
      try {
        const res = await fetch(
          `http://localhost:3000/analytics/pages?project_id=${projectId}`,
          { signal: controller.signal }
        );

        if (!res.ok) {
          console.error("Failed to load pages", res.status);
          return;
        }

        const json = await res.json();
        const list: string[] = (json.pages || []).map((p: any) => p.url);

        setUrls(list);
        setSelectedUrl(list.length > 0 ? list[0] : "");
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("Heatmap URL error:", err);
        }
      }
    }

    loadUrls();
    return () => controller.abort();
  }, [selectedProject]);

  // ---------------------------------------------
  // Load Heatmap Data
  // ---------------------------------------------
  useEffect(() => {
    if (!selectedProject || !selectedUrl) return;

    const controller = new AbortController();
    const projectId = selectedProject.project_id; // TS-safe reassignment

    async function loadHeatmap() {
      try {
        setLoading(true);

        const now = Date.now();
        const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
        const from = now - days * 24 * 60 * 60 * 1000;

        const params = new URLSearchParams({
          project_id: projectId,
          url: selectedUrl,
          from: String(from),
          to: String(now),
        });

        if (viewMode === "clicks") params.set("event_type", "click");
        else if (viewMode === "movement") params.set("event_type", "mousemove");

        const res = await fetch(
          `http://localhost:3000/analytics/heatmap?${params.toString()}`,
          { signal: controller.signal }
        );

        if (!res.ok) {
          console.error("Heatmap fetch failed", res.status);
          return;
        }

        const json = await res.json();
        setHeatmapData(json);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("Heatmap data load error:", err);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadHeatmap();
    return () => controller.abort();
  }, [selectedProject, selectedUrl, timeRange, viewMode]);

  // ---------------------------------------------
  // Derived Stats
  // ---------------------------------------------
  const totalClicks =
    heatmapData?.points?.reduce((sum, p) => sum + p.count, 0) ?? 0;

  const hottestSpot =
    heatmapData?.points?.reduce<HeatmapPoint | null>((max, p) => {
      return !max || p.count > max.count ? p : max;
    }, null) ?? null;

  const heatPoints = heatmapData?.points?.length ?? 0;

  // ---------------------------------------------
  // Render
  // ---------------------------------------------
  return (
    <div className="flex-1 px-4 lg:px-6 space-y-6">
      <HeatmapHeader
        viewMode={viewMode}
        setViewMode={setViewMode}
        timeRange={timeRange}
        setTimeRange={setTimeRange}
      />

      <HeatmapStats
        totalClicks={totalClicks}
        hottestSpot={hottestSpot}
        heatPoints={heatPoints}
      />

      <HeatmapSelector
        urls={urls}
        selectedUrl={selectedUrl}
        setSelectedUrl={setSelectedUrl}
        loading={loading}
        heatmapData={heatmapData}
        viewMode={viewMode}
      />
    </div>
  );
}
