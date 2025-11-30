"use client"

import React from "react"
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  BarChart3, 
  MousePointerClick, 
  Timer 
} from "lucide-react"

import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type SectionCardsProps = {
  projectId: string
}

export function SectionCards({ projectId }: SectionCardsProps) {
  const [metrics, setMetrics] = React.useState<any>(null)

  React.useEffect(() => {
    if (!projectId) return

    async function loadData() {
      try {
        const liveRes = await fetch(
          `http://localhost:3000/analytics/live?project_id=${projectId}`
        )
        const live = await liveRes.json()

        const overviewRes = await fetch(
          `http://localhost:3000/analytics/overview?project_id=${projectId}`
        )
        const overview = await overviewRes.json()

        setMetrics({
          activeVisitors: live.active,
          activeSessions: live.visitors.length,
          pageviews: overview.totals.pageviews,
          bounceRate: overview.totals.bounce_rate,
        })
      } catch (err) {
        console.error("SectionCards fetch error:", err)
      }
    }

    loadData()
    const interval = setInterval(loadData, 5000)
    return () => clearInterval(interval)

  }, [projectId])

  if (!metrics) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 @5xl:grid-cols-4">
        <Card className="h-32 animate-pulse bg-muted/40" />
        <Card className="h-32 animate-pulse bg-muted/40" />
        <Card className="h-32 animate-pulse bg-muted/40" />
        <Card className="h-32 animate-pulse bg-muted/40" />
      </div>
    )
  }

  const cardData = [
    {
      title: "Active Visitors",
      value: metrics.activeVisitors,
      change: "Live",
      trend: "up",
      icon: Users,
      footer: "People currently browsing",
    },
    {
      title: "Active Sessions",
      value: metrics.activeSessions,
      change: "Live",
      trend: "up",
      icon: BarChart3,
      footer: "Open active sessions",
    },
    {
      title: "Pageviews Today",
      value: metrics.pageviews,
      change: "+0%",
      trend: "up",
      icon: MousePointerClick,
      footer: "Total pageloads",
    },
    {
      title: "Bounce Rate",
      value: (metrics.bounceRate * 100).toFixed(1) + "%",
      change: metrics.bounceRate < 0.5 ? "+ok" : "-high",
      trend: metrics.bounceRate < 0.5 ? "up" : "down",
      icon: Timer,
      footer: "Single-page sessions",
    }
  ]

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs grid gap-4 sm:grid-cols-2 @5xl:grid-cols-4">
      {cardData.map((metric) => {
        const TrendIcon = metric.trend === "up" ? TrendingUp : TrendingDown

        return (
          <Card key={metric.title}>
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
        )
      })}
    </div>
  )
}
