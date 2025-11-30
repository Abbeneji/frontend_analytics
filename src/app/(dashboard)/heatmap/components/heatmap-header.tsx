"use client"

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

type TimeRange = "7d" | "30d" | "90d"

type Props = {
  viewMode: "clicks" | "movement" | "combined"
  setViewMode: (v: any) => void
  timeRange: TimeRange
  setTimeRange: (v: TimeRange) => void
}

export function HeatmapHeader({ viewMode, setViewMode, timeRange, setTimeRange }: Props) {
  return (
    <div className="flex md:flex-row flex-col md:items-center justify-between gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Heatmap</h1>
        <p className="text-muted-foreground">
          Visualize user interactions and click density
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Select value={viewMode} onValueChange={setViewMode}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="combined">Combined</SelectItem>
            <SelectItem value="clicks">Clicks Only</SelectItem>
            <SelectItem value="movement">Movement Only</SelectItem>
          </SelectContent>
        </Select>

        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline">Export</Button>
      </div>
    </div>
  )
}
