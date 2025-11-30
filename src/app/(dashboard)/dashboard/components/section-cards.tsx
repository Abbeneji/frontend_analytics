"use client";

import React from "react";
import { useDashboardData } from "../dashboard-data-provider";
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

export function SectionCards() {
  const { overview, live, loading } = useDashboardData();

  if (loading || !overview || !live) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 @5xl:grid-cols-4">
        <Card className="h-32 animate-pulse bg-muted/40" />
        <Card className="h-32 animate-pulse bg-muted/40" />
        <Card className="h-32 animate-pulse bg-muted/40" />
        <Card className="h-32 animate-pulse bg-muted/40" />
      </div>
    );
  }

  const metrics = {
    activeVisitors: live.active,
    activeSessions: live.visitors.length,
    pageviews: overview.totals.pageviews,
    bounceRate: overview.totals.bounce_rate,
  };

  const cardData = [
    {
      title: "Active Visitors",
      value: metrics.activeVisitors,
      icon: Users,
      footer: "People currently browsing",
      change: "Live",
      trend: "up",
    },
    {
      title: "Active Sessions",
      value: metrics.activeSessions,
      icon: BarChart3,
      footer: "Open sessions",
      change: "Live",
      trend: "up",
    },
    {
      title: "Pageviews Today",
      value: metrics.pageviews,
      icon: MousePointerClick,
      footer: "Total pageloads",
      change: "+0%",
      trend: "up",
    },
    {
      title: "Bounce Rate",
      value: (metrics.bounceRate * 100).toFixed(1) + "%",
      icon: Timer,
      footer: "Single-page sessions",
      change: metrics.bounceRate < 0.5 ? "+ok" : "-high",
      trend: metrics.bounceRate < 0.5 ? "up" : "down",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 @5xl:grid-cols-4">
      {cardData.map((c) => {
        const TrendIcon = c.trend === "up" ? TrendingUp : TrendingDown;
        return (
          <Card key={c.title}>
            <CardHeader>
              <CardDescription>{c.title}</CardDescription>
              <CardTitle className="text-2xl">
                {c.value}
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  <TrendIcon className="h-4 w-4" /> {c.change}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start text-sm">
              <div className="flex gap-2 font-medium">
                {c.footer} <TrendIcon className="h-4 w-4" />
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
