"use client";

import { DashboardDataProvider } from "./dashboard-data-provider";
import { SectionCards } from "./components/section-cards";
import { ChartAreaInteractive } from "./components/chart-area-interactive";
import { ActiveVisitorsTable } from "./components/data-table";
import { useProject } from "@/app/(dashboard)/contexts/project-context";

export default function Page() {
  const { selectedProject } = useProject();

  if (!selectedProject) {
    return (
      <div className="px-4 lg:px-6 py-10">
        <p className="text-muted-foreground">
          No project selected. Create one in Settings.
        </p>
      </div>
    );
  }

  return (
    <DashboardDataProvider>
      <div className="px-4 lg:px-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">
            Live Dashboard
          </h1>
          <p className="text-muted-foreground">
            Track real-time visitor behaviour
          </p>
        </div>
      </div>

      <div className="@container/main px-4 lg:px-6 space-y-6">
        <SectionCards />
        <ChartAreaInteractive />
      </div>

      <div className="@container/main px-4 lg:px-6 space-y-6">
        <ActiveVisitorsTable />
      </div>
    </DashboardDataProvider>
  );
}
