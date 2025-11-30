"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

/*  
    This is the same type structure you were using before  
    (based on your original file)  :contentReference[oaicite:1]{index=1}
*/
type PageStat = {
  url: string;
  pageviews: number;
  unique_visitors: number;
  avg_time_on_page: number;
  device?: string;
  os?: string;
  country?: string;
  timestamp?: string;
  referrers?: Record<string, number>;
  trend?: number[];
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
};

export function TopPagesSheet({ open, onOpenChange, projectId }: Props) {
  const [pages, setPages] = useState<PageStat[]>([]);
  const [search, setSearch] = useState("");
  const [device, setDevice] = useState("All");
  const [os, setOs] = useState("All");
  const [country, setCountry] = useState("All");
  const [range, setRange] = useState("all");

  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  // LOAD FULL PAGE ANALYTICS
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          `http://localhost:3000/analytics/pages?project_id=${projectId}`
        );
        const data = await res.json();
        if (Array.isArray(data.pages)) {
          setPages(data.pages);
        } else {
          setPages([]);
        }
      } catch (err) {
        console.error("TopPagesSheet load error:", err);
      }
    }

    load();
  }, [projectId]);

  // FILTER LOGIC
  const filtered = useMemo(() => {
    return pages.filter((p) => {
      if (search && !p.url.toLowerCase().includes(search.toLowerCase())) return false;
      if (device !== "All" && p.device !== device) return false;
      if (os !== "All" && p.os !== os) return false;
      if (country !== "All" && p.country !== country) return false;

      if (range !== "all" && p.timestamp) {
        const ts = new Date(p.timestamp).getTime();
        const now = Date.now();

        if (range === "24h" && now - ts > 24 * 3600 * 1000) return false;
        if (range === "7d" && now - ts > 7 * 24 * 3600 * 1000) return false;
        if (range === "30d" && now - ts > 30 * 24 * 3600 * 1000) return false;
        if (range === "12mo" && now - ts > 365 * 24 * 3600 * 1000) return false;
      }

      return true;
    });
  }, [pages, search, device, os, country, range]);

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const paginated = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  // SPARKLINE helper
  function Sparkline({ trend }: { trend?: number[] }) {
    if (!trend || trend.length < 2) return null;

    const data = {
      labels: trend.map((_, i) => i),
      datasets: [
        {
          data: trend,
          borderColor: "#4ade80",
          borderWidth: 2,
          tension: 0.3,
          pointRadius: 0,
        },
      ],
    };

    const options = {
      plugins: { legend: { display: false } },
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { display: false },
        y: { display: false },
      },
    };

    return (
      <div className="h-12 w-full">
        <Line data={data} options={options} />
      </div>
    );
  }

  // REFERRER BOX
  function ReferrerBox({ referrers }: { referrers?: Record<string, number> }) {
    if (!referrers) return null;
    const sorted = Object.entries(referrers).sort((a, b) => b[1] - a[1]).slice(0, 3);

    return (
      <div className="flex flex-col gap-1 text-xs text-muted-foreground">
        {sorted.map(([src, count]) => (
          <div key={src} className="flex justify-between w-full">
            <span className="truncate max-w-[120px]">{src}</span>
            <span>{count}</span>
          </div>
        ))}
      </div>
    );
  }

  // COUNTRY BOX
  function CountryBox({ country }: { country?: string }) {
    if (!country) return null;
    return (
      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
        {country}
      </span>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
  side="right"
  className="!w-screen !max-w-screen h-screen p-0 flex flex-col"
>
        <div className="h-full flex flex-col">

          {/* HEADER */}
          <SheetHeader className="p-6 pb-4 border-b">
            <SheetTitle>All Pages</SheetTitle>
            <SheetDescription>
              High-impact insights into your most visited pages.
            </SheetDescription>

            {/* FILTER BAR */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <Input
                placeholder="Search URL..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />

              <Select
                value={country}
                onValueChange={(v) => {
                  setCountry(v);
                  setPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Countries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Countries</SelectItem>
                  {[...new Set(pages.map((p) => p.country))].map(
                    (c) =>
                      c && (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      )
                  )}
                </SelectContent>
              </Select>

              <Select
                value={device}
                onValueChange={(v) => {
                  setDevice(v);
                  setPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Devices" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Devices</SelectItem>
                  {[...new Set(pages.map((p) => p.device))].map(
                    (d) =>
                      d && (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      )
                  )}
                </SelectContent>
              </Select>

              <Select
                value={os}
                onValueChange={(v) => {
                  setOs(v);
                  setPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All OS" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All OS</SelectItem>
                  {[...new Set(pages.map((p) => p.os))].map(
                    (o) =>
                      o && (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      )
                  )}
                </SelectContent>
              </Select>

              <Select
                value={range}
                onValueChange={(v) => {
                  setRange(v);
                  setPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="24h">Last 24 hours</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="12mo">Last 12 months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </SheetHeader>

          {/* MAIN LIST */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {paginated.map((p, index) => (
              <div
                key={p.url + index}
                className="p-5 border rounded-xl bg-card flex flex-col gap-4 shadow-sm"
              >
                {/* TOP ROW */}
                <div className="flex justify-between items-start">
                  <p className="font-medium text-sm break-all">{p.url}</p>
                  <span className="text-xs text-primary px-2 py-1 bg-primary/10 rounded">
                    {p.pageviews} views
                  </span>
                </div>

                {/* TREND */}
                <Sparkline trend={p.trend} />

                {/* INSIGHTS ROW */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <p className="font-medium mb-1 text-muted-foreground">Referrers</p>
                    <ReferrerBox referrers={p.referrers} />
                  </div>

                  <div>
                    <p className="font-medium mb-1 text-muted-foreground">Country</p>
                    <CountryBox country={p.country} />
                  </div>

                  <div>
                    <p className="font-medium mb-1 text-muted-foreground">Device / OS</p>
                    <div className="flex gap-2">
                      <span>{p.device || "??"}</span>
                      <span>{p.os || "??"}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {paginated.length === 0 && (
              <p className="text-sm text-muted-foreground">No pages match these filters.</p>
            )}
          </div>

          {/* FOOTER PAGINATION */}
          <div className="p-4 border-t flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Page {page} of {totalPages || 1}
            </p>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
