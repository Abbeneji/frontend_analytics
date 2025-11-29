"use client";

import { useEffect, useState } from "react";
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

interface Visit {
  uid: string;
  ts: number;
  url: string;
  browser: string | null;
  os: string | null;
}

export function RecentVisits({ projectId }: { projectId: string }) {
  const [visits, setVisits] = useState<Visit[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          `http://localhost:3000/analytics/recent?project_id=${projectId}&limit=5`
        );
        const data = await res.json();
        setVisits(data.visits || []);
      } catch (e) {
        console.error("Failed loading recent visits:", e);
      }
    }
    load();
  }, [projectId]);

  function timeAgo(ts: number) {
    const diff = Date.now() - ts;
    const min = Math.floor(diff / 60000);

    if (min < 1) return "just now";
    if (min < 60) return `${min} min ago`;

    const h = Math.floor(min / 60);
    if (h < 24) return `${h} hours ago`;

    const d = Math.floor(h / 24);
    return `${d} days ago`;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle>Recent Visits</CardTitle>
          <CardDescription>
            Latest activity from your visitors
          </CardDescription>
        </div>
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4 mr-2" />
          View All
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {visits.map((v, i) => {
          const initials = (v.browser ?? "?")
            .slice(0, 2)
            .toUpperCase();

          return (
            <div
              key={i}
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
      </CardContent>
    </Card>
  );
}
