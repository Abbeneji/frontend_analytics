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

export function VisitorsChart() {
  const [timeRange, setTimeRange] = useState("12m")
  const [data, setData] = useState<any[]>([])
  const projectId = "proj_12345"

  function computeRange(range: string) {
    const now = Date.now()
    const months = range === "3m" ? 3 : range === "6m" ? 6 : 12
    return {
      from: now - months * 30 * 24 * 60 * 60 * 1000,
      to: now
    }
  }

  useEffect(() => {
    const { from, to } = computeRange(timeRange)
    async function load() {
      const res = await fetch(`http://localhost:3000/analytics/overview?project_id=${projectId}&from=${from}&to=${to}`)
      const json = await res.json()
      const mapped = json.timeseries.map((p: any) => ({
        date: new Date(p.date).toLocaleDateString("en-US", { month: "short" }),
        visitors: p.visitors,
        sessions: p.sessions
      }))
      setData(mapped)
    }
    load()
  }, [timeRange])

  // Minimal config to keep ChartContainer happy
  const chartConfig = {}

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
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="3m">Last 3 months</SelectItem>
                <SelectItem value="6m">Last 6 months</SelectItem>
                <SelectItem value="12m">Last 12 months</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">Export</Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[350px] flex items-center justify-center text-muted-foreground">
            Loading...
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="cursor-pointer">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Visitors Over Time</CardTitle>
          <CardDescription>Unique visitors and sessions</CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="3m">Last 3 months</SelectItem>
              <SelectItem value="6m">Last 6 months</SelectItem>
              <SelectItem value="12m">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Export</Button>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <AreaChart data={data}>
            <defs>
              {/* MAIN LIME-GREEN GRADIENT — matches your design exactly */}
              <linearGradient id="limeVisitors" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#9EE42A" stopOpacity={0.65} />
                <stop offset="50%"  stopColor="#81CD11" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#81CD11" stopOpacity={0} />
              </linearGradient>

              <linearGradient id="limeSessions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#81CD11" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#81CD11" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
            <XAxis dataKey="date" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />

            {/* Visitors — stronger fill */}
            <Area
              type="monotone"
              dataKey="visitors"
              stroke="#81CD11"
              strokeWidth={2.5}
              fill="url(#limeVisitors)"
              dot={false}
            />

            {/* Sessions — slightly behind and lighter */}
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