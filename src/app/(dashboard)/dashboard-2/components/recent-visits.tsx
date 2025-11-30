"use client";

import { useMemo, useState } from "react";
import { Eye } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { AllVisitsSheet } from "./all-visits-sheets";
import { useDashboard2Data } from "../dashboard2-data-provider";

export function RecentVisits() {
  const { recentVisits, loading } = useDashboard2Data();
  const [open, setOpen] = useState(false);

  // Only show first 5 items (same as original)
  const visits = useMemo(() => {
    return (recentVisits ?? []).slice(0, 5);
  }, [recentVisits]);

  function timeAgo(ts: number) {
    const diff = Date.now() - ts;
    const min = Math.floor(diff / 60000);

    if (min < 1) return "just now";
    if (min < 60) return `${min} min ago`;

    const h = Math.floor(min / 60);
    if (h < 24) return `${h} hours ago`;

    return `${Math.floor(h / 24)} days ago`;
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle>Recent Visits</CardTitle>
            <CardDescription>
              Latest activity from your visitors
            </CardDescription>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpen(true)}
            disabled={loading || visits.length === 0}
          >
            <Eye className="h-4 w-4 mr-2" />
            View All
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* LOADING */}
          {loading && (
            <p className="text-sm text-muted-foreground">
              Loading recent visits…
            </p>
          )}

          {/* LIST */}
          {!loading &&
            visits.map((v, i) => {
              const initials = (v.browser ?? "?")
                .slice(0, 2)
                .toUpperCase();

              return (
                <div
                  key={v.uid + "-" + i}
                  className="flex p-3 rounded-lg border gap-3 items-center"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>

                  <div className="flex flex-1 justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">
                        {v.browser || "Unknown"} · {v.os || "Unknown"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {v.url}
                      </p>
                    </div>

                    <div className="text-right ml-3 whitespace-nowrap">
                      <Badge variant="secondary">pageload</Badge>
                      <p className="text-xs text-muted-foreground">
                        {timeAgo(v.ts)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

          {!loading && visits.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No recent visits yet
            </p>
          )}
        </CardContent>
      </Card>

      {/* MODAL */}
      <AllVisitsSheet open={open} onClose={() => setOpen(false)} />
    </>
  );
}
