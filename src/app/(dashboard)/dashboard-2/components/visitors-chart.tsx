"use client"

import { useEffect, useState } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

/* -----------------------------------------------------
   Visitors Over Time — supports 1d, 7d, 30d, 90d, 180d, 365d
------------------------------------------------------ */

export function VisitorsChart() {
  const [timeRange, setTimeRange] = useState("90d")
  const [data, setData] = useState<any[]>([])
  const projectId = "proj_12345"

  function computeRange(range: string) {
    const now = Date.now()

    const lookup: any = {
      "1d": 1,
      "7d": 7,
      "30d": 30,
      "90d": 90,
      "180d": 180,
      "365d": 365,
    }

    const days = lookup[range] ?? 90
    return {
      from: now - days * 24 * 60 * 60 * 1000,
      to: now,
    }
  }

  /* ---------------- Fetch Overview Data ---------------- */
  useEffect(() => {
    const { from, to } = computeRange(timeRange)

    async function load() {
      const url = `http://localhost:3000/analytics/overview?project_id=${projectId}&from=${from}&to=${to}`

      const res = await fetch(url)
      const json = await res.json()

      const mapped = json.timeseries.map((p: any) => ({
        date: new Date(p.date).toLocaleDateString("en-US", {
          month: "short",
          day: timeRange === "1d" ? "numeric" : undefined,
        }),
        visitors: p.visitors,
        sessions: p.sessions,
      }))

      setData(mapped)
    }

    load()
  }, [timeRange])

  const chartConfig = {}

  /* ---------------- Skeleton Loading State ---------------- */
  if (data.length === 0) {
    return (
      <Card className="cursor-pointer">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Visitors Over Time</CardTitle>
            <CardDescription>Unique visitors and sessions</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1d">Last 24 hours</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 3 months</SelectItem>
                <SelectItem value="180d">Last 6 months</SelectItem>
                <SelectItem value="365d">Last 12 months</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">Export</Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[350px] flex items-center justify-center text-muted-foreground">
            Loading…
          </div>
        </CardContent>
      </Card>
    )
  }

  /* ---------------- Render Chart ---------------- */
  return (
    <Card className="cursor-pointer">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Visitors Over Time</CardTitle>
          <CardDescription>Unique visitors and sessions</CardDescription>
        </div>

        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="180d">Last 6 months</SelectItem>
              <SelectItem value="365d">Last 12 months</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline">Export</Button>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="limeVisitors" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#9EE42A" stopOpacity={0.65} />
                <stop offset="50%" stopColor="#81CD11" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#81CD11" stopOpacity={0} />
              </linearGradient>

              <linearGradient id="limeSessions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#81CD11" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#81CD11" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              interval={timeRange === "1d" ? 0 : "preserveStartEnd"}
            />

            <YAxis tickLine={false} axisLine={false} />

            <ChartTooltip content={<ChartTooltipContent />} />

            <Area
              type="monotone"
              dataKey="visitors"
              stroke="#81CD11"
              strokeWidth={2.5}
              fill="url(#limeVisitors)"
              dot={false}
            />

            <Area
              type="monotone"
              dataKey="sessions"
              stroke="#81CD11"
              strokeWidth={2}
              fill="url(#limeSessions)"
              dot={false}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
