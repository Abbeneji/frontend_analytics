"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
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
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import { useDashboardData } from "../dashboard-data-provider";

export const description = "An interactive area chart";

const chartConfig = {
  visitors: { label: "Visitors" },
  desktop: { label: "Desktop", color: "var(--primary)" },
  mobile: { label: "Mobile", color: "var(--primary)" },
} satisfies ChartConfig;

type TimeRange = "90d" | "30d" | "7d";

export function ChartAreaInteractive() {
  const { overview, loading } = useDashboardData();
  const isMobile = useIsMobile();

  const [timeRange, setTimeRange] = React.useState<TimeRange>("90d");

  // Auto-switch to 7 days when on mobile
  React.useEffect(() => {
    if (isMobile) {
      setTimeRange((prev) => (prev === "90d" ? "7d" : prev));
    }
  }, [isMobile]);

  const timeseries = overview?.timeseries || [];

  // Time-range filter
  const now = Date.now();
  const days =
    timeRange === "90d" ? 90 : timeRange === "30d" ? 30 : 7;
  const cutoff = now - days * 24 * 60 * 60 * 1000;

  const filtered = timeseries.filter((p: any) => {
    return new Date(p.date).getTime() >= cutoff;
  });

  const chartData = filtered.map((p: any) => ({
    date: p.date,
    desktop: p.visitors,
    mobile: p.sessions,
  }));

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Visitors</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total for the selected period
          </span>
          <span className="@[540px]/card:hidden">
            {timeRange === "90d" && "Last 3 months"}
            {timeRange === "30d" && "Last 30 days"}
            {timeRange === "7d" && "Last 7 days"}
          </span>
        </CardDescription>

        <CardAction>
          {/* Desktop Toggle */}
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={(val) => val && setTimeRange(val as TimeRange)}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>

          {/* Mobile Select */}
          <Select
            value={timeRange}
            onValueChange={(val) => setTimeRange(val as TimeRange)}
          >
            <SelectTrigger
              className="flex w-40 *:data-[slot=select-value]:block *:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>

            <SelectContent className="rounded-xl">
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-desktop)" stopOpacity={1} />
                <stop offset="95%" stopColor="var(--color-desktop)" stopOpacity={0.1} />
              </linearGradient>

              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-mobile)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-mobile)" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              minTickGap={32}
              tickMargin={8}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                  indicator="dot"
                />
              }
            />

            <Area
              dataKey="mobile"
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--color-mobile)"
              stackId="a"
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="var(--color-desktop)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>

        {loading && (
          <p className="mt-2 text-xs text-muted-foreground">
            Loading data…
          </p>
        )}
      </CardContent>
    </Card>
  );
}
