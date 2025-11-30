"use client";

import { useMemo } from "react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

import { useDashboard2Data } from "../dashboard2-data-provider";

function formatDateLabel(raw: string) {
  const d = new Date(raw);
  return Number.isNaN(d.getTime())
    ? raw
    : d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

const chartConfig = {
  visitors: { label: "Visitors", color: "#81CD11" },
  sessions: { label: "Sessions", color: "#81CD11" },
  pageviews: { label: "Pageviews", color: "#9EE42A" },
} as const;

export function CustomerInsights() {
  const { overview, loading } = useDashboard2Data();

  if (loading || !overview) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Traffic Insights</CardTitle>
          <CardDescription>Loading data…</CardDescription>
        </CardHeader>

        <CardContent className="py-20 flex justify-center text-muted-foreground">
          Loading…
        </CardContent>
      </Card>
    );
  }

  const totals = overview.totals;

  const chartData = useMemo(
    () =>
      (overview.timeseries ?? []).map((p) => ({
        label: formatDateLabel(p.date),
        visitors: p.visitors ?? 0,
        sessions: p.sessions ?? 0,
        pageviews: p.pageviews ?? 0,
      })),
    [overview]
  );

  const avgPagesPerSession =
    totals.sessions > 0 ? totals.pageviews / totals.sessions : 0;
  const bounceRatePct = totals.bounce_rate * 100;

  return (
    <Tabs defaultValue="growth" className="w-full">
      <Card>
        <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle>Traffic Insights</CardTitle>
            <CardDescription>
              Growth trends and key metrics from your visitors
            </CardDescription>
          </div>

          <TabsList>
            <TabsTrigger value="growth">Growth</TabsTrigger>
            <TabsTrigger value="demographics" disabled>
              Demographics
            </TabsTrigger>
            <TabsTrigger value="regions" disabled>
              Regions
            </TabsTrigger>
          </TabsList>
        </CardHeader>

        <CardContent>
          <TabsContent value="growth" className="space-y-4">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] items-start">
              {/* LEFT: Chart */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Visitor growth over time</p>
                <p className="text-xs text-muted-foreground">
                  Daily visitors, sessions, and pageviews
                </p>

                <ChartContainer
                  config={chartConfig}
                  className="mt-4 h-[260px] w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <defs>
                        {/* Visitors */}
                        <linearGradient
                          id="fillVisitors"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop offset="0%" stopColor="#81CD11" stopOpacity={0.9} />
                          <stop offset="100%" stopColor="#81CD11" stopOpacity={0.7} />
                        </linearGradient>

                        {/* Sessions */}
                        <linearGradient
                          id="fillSessions"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop offset="0%" stopColor="#81CD11" stopOpacity={0.8} />
                          <stop offset="100%" stopColor="#81CD11" stopOpacity={0.5} />
                        </linearGradient>

                        {/* Pageviews */}
                        <linearGradient
                          id="fillPageviews"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop offset="0%" stopColor="#9EE42A" stopOpacity={0.85} />
                          <stop offset="70%" stopColor="#9EE42A" stopOpacity={0.6} />
                          <stop offset="100%" stopColor="#81CD11" stopOpacity={0.4} />
                        </linearGradient>
                      </defs>

                      <CartesianGrid
                        vertical={false}
                        strokeDasharray="3 3"
                        className="stroke-muted/30"
                      />
                      <XAxis
                        dataKey="label"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                      />
                      <YAxis tickLine={false} axisLine={false} tickMargin={8} />

                      <ChartTooltip content={<ChartTooltipContent />} />
                      <ChartLegend content={<ChartLegendContent />} />

                      <Bar
                        dataKey="visitors"
                        stackId="a"
                        fill="url(#fillVisitors)"
                      />
                      <Bar
                        dataKey="sessions"
                        stackId="a"
                        fill="url(#fillSessions)"
                      />
                      <Bar
                        dataKey="pageviews"
                        stackId="a"
                        fill="url(#fillPageviews)"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>

              {/* RIGHT: Summary */}
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <p className="text-xs font-medium text-muted-foreground">
                    Total Visitors
                  </p>
                  <p className="mt-2 text-2xl font-semibold">
                    {totals.visitors.toLocaleString()}
                  </p>
                </div>

                <div className="rounded-lg border p-4">
                  <p className="text-xs font-medium text-muted-foreground">
                    Total Sessions
                  </p>
                  <p className="mt-2 text-2xl font-semibold">
                    {totals.sessions.toLocaleString()}
                  </p>
                </div>

                <div className="rounded-lg border p-4">
                  <p className="text-xs font-medium text-muted-foreground">
                    Avg. pages per session
                  </p>
                  <p className="mt-2 text-2xl font-semibold">
                    {avgPagesPerSession.toFixed(1)}
                  </p>
                </div>

                <div className="rounded-lg border p-4">
                  <p className="text-xs font-medium text-muted-foreground">
                    Bounce rate
                  </p>
                  <p className="mt-2 text-2xl font-semibold">
                    {bounceRatePct.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </CardContent>
      </Card>
    </Tabs>
  );
}
