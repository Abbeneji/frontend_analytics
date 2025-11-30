"use client";

import { useState, useMemo } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useDashboard2Data } from "../dashboard2-data-provider";

export function VisitorsChart() {
  const { overview, loading } = useDashboard2Data();

  const [timeRange, setTimeRange] = useState("90d");

  // Convert the provider data into the chart format
  const data = useMemo(() => {
    if (!overview) return [];

    const lookup: Record<string, number> = {
      "1d": 1,
      "7d": 7,
      "30d": 30,
      "90d": 90,
      "180d": 180,
      "365d": 365,
    };

    const rangeDays = lookup[timeRange] ?? 90;
    const cutoff = Date.now() - rangeDays * 24 * 60 * 60 * 1000;

    return overview.timeseries
      .filter((p) => new Date(p.date).getTime() >= cutoff)
      .map((p) => ({
        date: new Date(p.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        visitors: p.visitors,
        sessions: p.sessions,
      }));
  }, [overview, timeRange]);

  /* ---------------- Skeleton Loading State ---------------- */
  if (loading || !overview) {
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
    );
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
        <ChartContainer config={{}} className="h-[350px] w-full">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="visitorsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C6FF4A" stopOpacity={0.7} />
                <stop offset="50%" stopColor="#A8F234" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#A8F234" stopOpacity={0} />
              </linearGradient>

              <linearGradient id="sessionsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5FBF0F" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#5FBF0F" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
            <XAxis dataKey="date" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />

            <ChartTooltip content={<ChartTooltipContent />} />

            <Area
              type="monotone"
              dataKey="visitors"
              stroke="#A8F234"
              strokeWidth={2.5}
              fill="url(#visitorsGradient)"
              dot={false}
            />

            <Area
              type="monotone"
              dataKey="sessions"
              stroke="#5FBF0F"
              strokeWidth={2}
              fill="url(#sessionsGradient)"
              dot={false}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
