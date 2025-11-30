import { ChartAreaInteractive } from "./components/chart-area-interactive"
import { ActiveVisitorsTable } from "./components/data-table"
import { SectionCards } from "./components/section-cards"

import data from "./data/data.json"
import pastPerformanceData from "./data/past-performance-data.json"
import keyPersonnelData from "./data/key-personnel-data.json"
import focusDocumentsData from "./data/focus-documents-data.json"

export default function Page() {
  return (
    <>
      {/* Page Title and Description */}
      <div className="px-4 lg:px-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Live Dashboard</h1>
          <p className="text-muted-foreground">Track your current visitor's behaviour and patterns</p>
        </div>
      </div>

      <div className="@container/main px-4 lg:px-6 space-y-6">
        <SectionCards projectId="proj_12345"/>
        <ChartAreaInteractive projectId="proj_12345"/>
      </div>
      <div className="@container/main px-4 lg:px-6 space-y-6">
        <ActiveVisitorsTable projectId="proj_12345"/>
      </div>
    </>
  )
}
