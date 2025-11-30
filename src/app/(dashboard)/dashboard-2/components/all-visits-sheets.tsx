"use client";

import { useMemo, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { useDashboard2Data } from "../dashboard2-data-provider";

interface Visit {
  uid: string;
  ts: number;
  url: string;
  browser: string | null;
  os: string | null;
  locale?: string | null;
  referrer?: string | null;
}

export function AllVisitsSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { recentVisits, loading } = useDashboard2Data();

  const visits: Visit[] = recentVisits ?? [];

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("all");
  const [browser, setBrowser] = useState("all");
  const [os, setOs] = useState("all");
  const [range, setRange] = useState("all");

  const perPage = 20;

  function timeAgo(ts: number) {
    const diff = Date.now() - ts;
    const m = Math.floor(diff / 60000);
    if (m < 1) return "just now";
    if (m < 60) return `${m} min ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h} hours ago`;
    return `${Math.floor(h / 24)} days ago`;
  }

  function getCountryCode(locale?: string | null) {
    if (!locale) return "??";
    const parts = locale.split("-");
    return parts.length > 1 ? parts[1].toUpperCase() : "??";
  }

  const filtered = useMemo(() => {
    return visits.filter((v) => {
      const c = getCountryCode(v.locale);

      const matchSearch =
        search === "" ||
        v.url.toLowerCase().includes(search.toLowerCase()) ||
        (v.browser ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (v.os ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (v.referrer ?? "").toLowerCase().includes(search.toLowerCase());

      const matchCountry = country === "all" || c === country;
      const matchBrowser = browser === "all" || v.browser === browser;
      const matchOs = os === "all" || v.os === os;

      const now = Date.now();
      const diff = now - v.ts;
      const day = 24 * 60 * 60 * 1000;

      let matchRange = true;
      if (range === "24h") matchRange = diff <= day;
      if (range === "7d") matchRange = diff <= day * 7;
      if (range === "30d") matchRange = diff <= day * 30;

      return matchSearch && matchCountry && matchBrowser && matchOs && matchRange;
    });
  }, [visits, search, country, browser, os, range]);

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-screen !max-w-screen h-screen p-0 flex flex-col"
      >
        <SheetHeader className="p-6 border-b">
          <SheetTitle>All Visits</SheetTitle>
          <SheetDescription>
            Explore full visitor activity with filters.
          </SheetDescription>
        </SheetHeader>

        {/* FILTER BAR */}
        <div className="p-4 border-b bg-muted/40">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
            <Input
              placeholder="Search URL, browser, OS, referrer…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="md:col-span-2"
            />

            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger>
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {[...new Set(visits.map((v) => getCountryCode(v.locale)))].map(
                  (c) =>
                    c && (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    )
                )}
              </SelectContent>
            </Select>

            <Select value={browser} onValueChange={setBrowser}>
              <SelectTrigger>
                <SelectValue placeholder="Browser" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Browsers</SelectItem>
                {[...new Set(visits.map((v) => v.browser))].map(
                  (b) =>
                    b && (
                      <SelectItem key={b} value={b}>
                        {b}
                      </SelectItem>
                    )
                )}
              </SelectContent>
            </Select>

            <Select value={os} onValueChange={setOs}>
              <SelectTrigger>
                <SelectValue placeholder="OS" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All OS</SelectItem>
                {[...new Set(visits.map((v) => v.os))].map(
                  (o) =>
                    o && (
                      <SelectItem key={o} value={o}>
                        {o}
                      </SelectItem>
                    )
                )}
              </SelectContent>
            </Select>

            <Select value={range} onValueChange={setRange}>
              <SelectTrigger>
                <SelectValue placeholder="Time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="24h">Last 24 Hours</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* LIST */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading && (
            <p className="text-sm text-muted-foreground">Loading visits…</p>
          )}

          {!loading &&
            paginated.map((v, i) => {
              const initials = (v.browser ?? "?").slice(0, 2).toUpperCase();

              return (
                <div
                  key={i}
                  className="flex p-4 rounded-lg border gap-4 items-center bg-card"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>

                  <div className="flex flex-1 justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">
                        {v.browser || "Unknown"} · {v.os || "Unknown"} ·{" "}
                        {getCountryCode(v.locale)}
                      </p>

                      <p className="text-xs text-muted-foreground truncate max-w-xl">
                        {v.url}
                      </p>
                    </div>

                    <div className="text-right">
                      <Badge variant="secondary">pageload</Badge>
                      <p className="text-xs text-muted-foreground">
                        {timeAgo(v.ts)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

          {!loading && paginated.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No visits match these filters.
            </p>
          )}
        </div>

        {/* PAGINATION */}
        <div className="border-t p-4 flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>

            <Button
              variant="outline"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
