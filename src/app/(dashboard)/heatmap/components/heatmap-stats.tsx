"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Activity, MousePointer2, TrendingUp } from "lucide-react"

type Props = {
  totalClicks: number
  hottestSpot: any
  heatPoints: number
}

export function HeatmapStats({ totalClicks, hottestSpot, heatPoints }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
          <MousePointer2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalClicks.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">Across all interactions</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Hottest Area</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {hottestSpot ? `${hottestSpot.count} clicks` : "N/A"}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {hottestSpot ? `At (${hottestSpot.x}, ${hottestSpot.y})` : "No data"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Heat Points</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{heatPoints}</div>
          <p className="text-xs text-muted-foreground mt-1">Unique zones</p>
        </CardContent>
      </Card>
    </div>
  )
}
