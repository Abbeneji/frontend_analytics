"use client";

import { MetricsOverview } from "./components/metrics-overview";
import { DevicesBreakdown } from "./components/devices-breakdown";
import { VisitorsChart } from "./components/visitors-chart";
import { TopPages } from "./components/top-pages";
import { TopProducts } from "./components/top-products";
import { CustomerInsights } from "./components/customer-insights";
import { QuickActions } from "./components/quick-actions";
import { RecentVisits } from "./components/recent-visits";

import { useProject } from "@/app/(dashboard)/contexts/project-context";
import { Dashboard2DataProvider } from "./dashboard2-data-provider";

import { DateFilterProvider } from "../contexts/date-filter-context";
import { DateFilter } from "@/components/date-filter";



export default function Dashboard2() {
  const { selectedProject } = useProject();

  if (!selectedProject) {
    return (
      <div className="flex-1 px-6 pt-6">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Select or create a project in Settings to see its analytics here.
        </p>
      </div>
    );
  }

  return (
    <DateFilterProvider>
      <Dashboard2DataProvider>
        <div className="flex-1 space-y-6 px-6 pt-0">
          {/* Header */}
          <div className="flex md:flex-row flex-col md:items-center justify-between gap-4 md:gap-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">
                View your web analytics in a comprehensive dashboard.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <DateFilter />
              <QuickActions />
            </div>
          </div>

          {/* Main Grid */}
          <div className="@container/main space-y-6">
            {/* Top row: key metrics */}
            <MetricsOverview />

            {/* Second row: visitors vs devices */}
            <div className="grid gap-6 grid-cols-1 @5xl:grid-cols-2">
              <VisitorsChart />
              <DevicesBreakdown />
            </div>

            {/* Third row: recent + top pages */}
            <div className="grid gap-6 grid-cols-1 @5xl:grid-cols-2">
              <RecentVisits />
              <TopPages />
            </div>

            {/* Fourth row: deeper insights */}
            <CustomerInsights />

            {/* Optional revenue/products */}
            {/* <TopProducts /> */}
          </div>
        </div>
      </Dashboard2DataProvider>
    </DateFilterProvider>
  );
}
