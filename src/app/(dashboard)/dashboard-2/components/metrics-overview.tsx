"use client";

import React from "react";
import {
  TrendingUp,
  TrendingDown,
  Users,
  BarChart3,
  MousePointerClick,
  Timer,
} from "lucide-react";

import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { useDashboard2Data } from "../dashboard2-data-provider";

export function MetricsOverview() {
  const { overview, loading } = useDashboard2Data();

  if (loading || !overview) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 @5xl:grid-cols-4">
        <Card className="h-32 animate-pulse bg-muted/40" />
        <Card className="h-32 animate-pulse bg-muted/40" />
        <Card className="h-32 animate-pulse bg-muted/40" />
        <Card className="h-32 animate-pulse bg-muted/40" />
      </div>
    );
  }

  const totals = overview.totals;

  const cardData = [
    {
      title: "Total Visitors",
      value: totals.visitors,
      change: "+0%", // Placeholder – real comparison can be added later
      trend: "up",
      icon: Users,
      footer: "Unique visitors",
    },
    {
      title: "Total Sessions",
      value: totals.sessions,
      change: "+0%",
      trend: "up",
      icon: BarChart3,
      footer: "Engagement sessions",
    },
    {
      title: "Pageviews",
      value: totals.pageviews,
      change: "+0%",
      trend: "up",
      icon: MousePointerClick,
      footer: "Total pageload events",
    },
    {
      title: "Bounce Rate",
      value: `${totals.bounce_rate.toFixed(1)}%`,
      change: totals.bounce_rate < 50 ? "+ok" : "-high",
      trend: totals.bounce_rate < 50 ? "up" : "down",
      icon: Timer,
      footer: "Single-page sessions",
    },
  ];

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs grid gap-4 sm:grid-cols-2 @5xl:grid-cols-4">
      {cardData.map((metric) => {
        const TrendIcon = metric.trend === "up" ? TrendingUp : TrendingDown;

        return (
          <Card key={metric.title} className="cursor-pointer">
            <CardHeader>
              <CardDescription>{metric.title}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {metric.value}
              </CardTitle>

              <CardAction>
                <Badge variant="outline">
                  <TrendIcon className="h-4 w-4" />
                  {metric.change}
                </Badge>
              </CardAction>
            </CardHeader>

            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {metric.footer} <TrendIcon className="size-4" />
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
