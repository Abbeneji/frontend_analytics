"use client";

import { DashboardDataProvider } from "./dashboard-data-provider";
import { SectionCards } from "./components/section-cards";
import { ChartAreaInteractive } from "./components/chart-area-interactive";
import { ActiveVisitorsTable } from "./components/data-table";
import { useProject } from "@/app/(dashboard)/contexts/project-context";

export default function LiveDashboardPage() {
  const { selectedProject } = useProject();

  // Guard: require a selected project before mounting analytics logic
  if (!selectedProject) {
    return (
      <div className="px-4 lg:px-6 py-10">
        <h1 className="text-2xl font-bold tracking-tight mb-2">
          Live Dashboard
        </h1>
        <p className="text-muted-foreground">
          No project selected. Create or select a project in Settings to see
          live analytics here.
        </p>
      </div>
    );
  }

  return (
    <DashboardDataProvider>
      {/* Page header */}
      <div className="px-4 lg:px-6 pt-6 pb-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Live Dashboard</h1>
          <p className="text-muted-foreground">
            Track real-time visitor behaviour for your selected project.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="@container/main px-4 lg:px-6 space-y-6 pb-8">
        {/* Top row: live cards + chart */}
        <SectionCards />
        <ChartAreaInteractive />

        {/* Bottom row: active visitors table */}
        <ActiveVisitorsTable />
      </div>
    </DashboardDataProvider>
  );
}
