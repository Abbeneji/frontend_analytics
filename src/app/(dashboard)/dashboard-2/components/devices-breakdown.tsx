"use client";

import * as React from "react";
import {
  PieChart,
  Pie,
  Label,
  Sector,
} from "recharts";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartStyle,
} from "@/components/ui/chart";

import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import { useDashboard2Data } from "../dashboard2-data-provider";

export function DevicesBreakdown() {
  const { devices, loading } = useDashboard2Data();
  const id = "devices-breakdown";

  const [activeCategory, setActiveCategory] =
    React.useState<"device" | "browser" | "os">("device");

  // -----------------------------
  // Handle loading + empty state
  // -----------------------------
  if (loading || !devices) {
    return (
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Audience Breakdown</CardTitle>
          <CardDescription>Devices, Browsers, and OS distribution</CardDescription>
        </CardHeader>
        <CardContent className="text-center text-sm text-muted-foreground py-20">
          Loading device data…
        </CardContent>
      </Card>
    );
  }

  // -----------------------------
  // Transform data from provider
  // -----------------------------
  const deviceDataset = [
    {
      category: "desktop",
      label: "Desktop",
      amount: devices.devices.desktop,
      fill: "var(--chart-1)",
    },
    {
      category: "tablet",
      label: "Tablet",
      amount: devices.devices.tablet,
      fill: "var(--chart-2)",
    },
    {
      category: "mobile",
      label: "Mobile",
      amount: devices.devices.mobile,
      fill: "var(--chart-3)",
    },
  ];

  const browserDataset = Object.entries(devices.browsers).map(
    ([browser, count], i) => ({
      category: browser,
      label: browser,
      amount: count,
      fill: `var(--chart-${(i % 4) + 1})`,
    })
  );

  const osDataset = Object.entries(devices.os).map(([os, count], i) => ({
    category: os,
    label: os,
    amount: count,
    fill: `var(--chart-${(i % 4) + 1})`,
  }));

  const datasets = {
    device: deviceDataset,
    browser: browserDataset,
    os: osDataset,
  };

  const activeData = datasets[activeCategory];
  const activeIndex = 0;

  const chartConfig: Record<string, any> = {};
  activeData.forEach((item) => {
    chartConfig[item.category] = {
      label: item.label,
      color: item.fill,
    };
  });

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <Card data-chart={id} className="flex flex-col cursor-pointer">
      <ChartStyle id={id} config={chartConfig} />

      <CardHeader className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between pb-2">
        <div>
          <CardTitle>Audience Breakdown</CardTitle>
          <CardDescription>
            Devices, Browsers, and OS distribution
          </CardDescription>
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
                      if (!viewBox || !("cx" in viewBox)) return null;
                      const total = activeData.reduce(
                        (sum, i) => sum + i.amount,
                        0
                      );
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
                      );
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </div>

          {/* LIST */}
          <div className="flex flex-col justify-center space-y-4">
            {activeData.map((item, index) => {
              const isActive = index === activeIndex;

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
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
