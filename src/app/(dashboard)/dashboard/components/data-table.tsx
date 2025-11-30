"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Visitor = {
  uid: string;
  session: string;
  url: string;
  browser: string;
  os: string;
  referrer: string;
  locale: string;     // ✅ Added
  country?: string;   // (Backend convenience, optional)
  last_seen: number;
};

// Convert "NL" → 🇳🇱
function countryFlag(cc: string) {
  if (!cc) return "";
  const code = cc.toUpperCase();

  return String.fromCodePoint(
    ...Array.from(code).map(char => 127397 + char.charCodeAt(0))
  );
}

export function ActiveVisitorsTable({ projectId }: { projectId: string }) {
  const [visitors, setVisitors] = React.useState<Visitor[]>([]);
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 10;

  // Fetch live visitor data (auto-refresh every 2s)
  React.useEffect(() => {
    let active = true;

    async function load() {
      try {
        const res = await fetch(
          `http://localhost:3000/analytics/live?project_id=${projectId}`
        );
        const json = await res.json();
        if (active) {
          setVisitors(json.visitors || []);
        }
      } catch (err) {
        console.error("Error fetching live visitors:", err);
      }
    }

    load();
    const interval = setInterval(load, 2000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [projectId]);

  const pageCount = Math.ceil(visitors.length / rowsPerPage) || 1;
  const safePage = Math.min(page, pageCount);
  const start = (safePage - 1) * rowsPerPage;
  const currentRows = visitors.slice(start, start + rowsPerPage);

  function formatUid(uid: string) {
    if (!uid) return "-";
    if (uid.length <= 10) return uid;
    return uid.slice(0, 6) + "…" + uid.slice(-4);
  }

  function formatLastSeen(ts: number) {
    const sec = Math.floor((Date.now() - ts) / 1000);
    if (sec < 60) return `${sec}s ago`;
    if (sec < 3600) return `${Math.floor(sec / 60)} min ago`;
    return `${Math.floor(sec / 3600)}h ago`;
  }

  return (
    <section className="mt-6 space-y-4">
      {/* Title row */}
      <div className="px-4">
        <h2 className="text-base font-medium">Active Visitors (Live)</h2>
        <p className="text-sm text-muted-foreground">
          Realtime sessions for the selected project
        </p>
      </div>

      {/* Table wrapper */}
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead>Visitor</TableHead>
              <TableHead>Session</TableHead>
              <TableHead>Page</TableHead>
              <TableHead>Browser</TableHead>
              <TableHead>OS</TableHead>
              <TableHead>Referrer</TableHead>
              <TableHead>Country</TableHead>   {/* ✅ NEW */}
              <TableHead className="text-right">Last Seen</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentRows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-20 text-center text-sm text-muted-foreground"
                >
                  No active visitors
                </TableCell>
              </TableRow>
            ) : (
              currentRows.map((v, i) => {
                // "nl-NL" → ["nl", "NL"] → "NL"
                const country =
                  v.country ||
                  (v.locale?.includes("-")
                    ? v.locale.split("-")[1]
                    : "XX");

                return (
                  <TableRow key={`${v.uid}-${i}`}>
                    <TableCell className="font-medium">
                      {formatUid(v.uid)}
                    </TableCell>
                    <TableCell>{v.session.slice(0, 8)}</TableCell>
                    <TableCell>
                      {v.url
                        .replace("http://", "")
                        .replace("https://", "")
                        .replace(/\/$/, "")}
                    </TableCell>
                    <TableCell>{v.browser}</TableCell>
                    <TableCell>{v.os}</TableCell>
                    <TableCell>{v.referrer || "Direct"}</TableCell>

                    {/* COUNTRY COLUMN */}
                    <TableCell className="whitespace-nowrap">
                      {countryFlag(country)} {country}
                    </TableCell>

                    <TableCell className="text-right">
                      {formatLastSeen(v.last_seen)}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 pb-2 text-sm">
        <div className="text-muted-foreground">
          {visitors.length === 0
            ? "0 of 0 visitors"
            : `${start + 1}–${Math.min(
                start + rowsPerPage,
                visitors.length
              )} of ${visitors.length} visitors`}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            disabled={safePage === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            disabled={safePage === pageCount || visitors.length === 0}
            onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
