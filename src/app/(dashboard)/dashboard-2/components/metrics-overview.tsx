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

export function MetricsOverview() {
  const [metrics, setMetrics] = React.useState<any>(null)

  React.useEffect(() => {
    async function loadData() {
      const res = await fetch(
        "http://localhost:3000/analytics/overview?project_id=proj_12345"
      )
      const json = await res.json()

      setMetrics({
        visitors: json.totals.visitors,
        sessions: json.totals.sessions,
        pageviews: json.totals.pageviews,
        bounceRate: json.totals.bounce_rate,
      })
    }

    loadData()
  }, [])

  if (!metrics) {
    // skeleton state
    return <div className="grid gap-4 sm:grid-cols-2 @5xl:grid-cols-4">
      <Card className="h-32 animate-pulse bg-muted/40" />
      <Card className="h-32 animate-pulse bg-muted/40" />
      <Card className="h-32 animate-pulse bg-muted/40" />
      <Card className="h-32 animate-pulse bg-muted/40" />
    </div>
  }

  // Build card data dynamically
  const cardData = [
    {
      title: "Total Visitors",
      value: metrics.visitors,
      change: "+0%", // placeholder until we add time comparison
      trend: "up",
      icon: Users,
      footer: "Unique visitors",
    },
    {
      title: "Total Sessions",
      value: metrics.sessions,
      change: "+0%",
      trend: "up",
      icon: BarChart3,
      footer: "Engagement sessions",
    },
    {
      title: "Pageviews",
      value: metrics.pageviews,
      change: "+0%",
      trend: "up",
      icon: MousePointerClick,
      footer: "Total pageload events",
    },
    {
      title: "Bounce Rate",
      value: metrics.bounceRate.toFixed(1) + "%",
      change: metrics.bounceRate < 50 ? "+ok" : "-high",
      trend: metrics.bounceRate < 50 ? "up" : "down",
      icon: Timer,
      footer: "Single-page sessions",
    }
  ]

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs grid gap-4 sm:grid-cols-2 @5xl:grid-cols-4">
      {cardData.map((metric) => {
        const TrendIcon = metric.trend === "up" ? TrendingUp : TrendingDown
        
        return (
          <Card key={metric.title} className=" cursor-pointer">
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
