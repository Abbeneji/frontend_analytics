"use client"

import * as React from "react"
import { Pie, PieChart, Label, Sector } from "recharts"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartStyle } from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"

// -------------------------------------------------
// Helper: Fetch devices API
// -------------------------------------------------
async function fetchDevices(project_id: string) {
  const res = await fetch(
    `http://localhost:3000/analytics/devices?project_id=${project_id}`
  )
  return res.json()
}

// -------------------------------------------------
// Component
// -------------------------------------------------

export function DevicesBreakdown({ projectId }: { projectId: string }) {
  const id = "devices-breakdown"

  const [activeCategory, setActiveCategory] =
    React.useState<"device" | "browser" | "os">("device")

  const [data, setData] = React.useState({
    devices: { desktop: 0, tablet: 0, mobile: 0 },
    browsers: {} as Record<string, number>,
    os: {} as Record<string, number>,
  })

  // -----------------------------
  // Load from backend
  // -----------------------------
  React.useEffect(() => {
    if (!projectId) return
    fetchDevices(projectId).then((res) =>
      setData({
        devices: res.devices,
        browsers: res.browsers,
        os: res.os,
      })
    )
  }, [projectId])

  // -----------------------------
  // Transform into chart-friendly format
  // -----------------------------
  const deviceData = [
    { category: "desktop", label: "Desktop", amount: data.devices.desktop, fill: "var(--chart-1)" },
    { category: "tablet", label: "Tablet", amount: data.devices.tablet, fill: "var(--chart-2)" },
    { category: "mobile", label: "Mobile", amount: data.devices.mobile, fill: "var(--chart-3)" },
  ]

  const browserData = Object.entries(data.browsers).map(([name, count], i) => ({
    category: name,
    label: name,
    amount: count,
    fill: `var(--chart-${(i % 4) + 1})`,
  }))

  const osData = Object.entries(data.os).map(([name, count], i) => ({
    category: name,
    label: name,
    amount: count,
    fill: `var(--chart-${(i % 4) + 1})`,
  }))

  const datasets = {
    device: deviceData,
    browser: browserData,
    os: osData,
  }

  const activeData = datasets[activeCategory]
  const activeIndex = 0 // simple highlight, can expand later

  // Config for ChartStyle
  const chartConfig: Record<string, any> = {}
  activeData.forEach((item, i) => {
    chartConfig[item.category] = {
      label: item.label,
      color: item.fill,
    }
  })

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <Card data-chart={id} className="flex flex-col cursor-pointer">
      <ChartStyle id={id} config={chartConfig} />

      <CardHeader className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between pb-2">
        <div>
          <CardTitle>Audience Breakdown</CardTitle>
          <CardDescription>Devices, Browsers, and OS distribution</CardDescription>
        </div>

        <div className="flex items-center space-x-2">
          <Select
            value={activeCategory}
            onValueChange={(v: any) => setActiveCategory(v)}
          >
            <SelectTrigger className="w-[175px] rounded-lg cursor-pointer">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="device">Devices</SelectItem>
              <SelectItem value="browser">Browsers</SelectItem>
              <SelectItem value="os">Operating Systems</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline">Export</Button>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">

          {/* CHART */}
          <div className="flex justify-center">
            <ChartContainer
              id={id}
              config={chartConfig}
              className="mx-auto aspect-square w-full max-w-[300px]"
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />

                <Pie
                  data={activeData}
                  dataKey="amount"
                  nameKey="label"
                  innerRadius={60}
                  strokeWidth={5}
                  activeIndex={activeIndex}
                  activeShape={({ outerRadius = 0, ...props }) => (
                    <g>
                      <Sector {...props} outerRadius={outerRadius + 10} />
                      <Sector
                        {...props}
                        outerRadius={outerRadius + 25}
                        innerRadius={outerRadius + 12}
                      />
                    </g>
                  )}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (!viewBox || !("cx" in viewBox)) return null
                      const total = activeData.reduce((sum, i) => sum + i.amount, 0)
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan className="fill-foreground text-3xl font-bold">
                            {total}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            total
                          </tspan>
                        </text>
                      )
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </div>

          {/* LIST */}
          <div className="flex flex-col justify-center space-y-4">
            {activeData.map((item, index) => {
              const isActive = index === activeIndex

              return (
                <div
                  key={item.category}
                  className={`flex items-center justify-between p-3 rounded-lg transition-colors cursor-pointer ${
                    isActive ? "bg-muted" : "hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-3 w-3 shrink-0 rounded-full"
                      style={{ backgroundColor: item.fill }}
                    />
                    <span className="font-medium">{item.label}</span>
                  </div>

                  <div className="text-right">
                    <div className="font-bold">{item.amount}</div>
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      </CardContent>
    </Card>
  )
}
