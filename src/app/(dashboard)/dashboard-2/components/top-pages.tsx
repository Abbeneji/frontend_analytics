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
import { Button } from "@/components/ui/button";

type PageStat = {
  url: string;
  pageviews: number;
  unique_visitors: number;
  avg_time_on_page: number;
};

type TopPagesProps = {
  projectId: string;
};

export function TopPages({ projectId }: TopPagesProps) {
  const [pages, setPages] = useState<PageStat[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          `http://localhost:3000/analytics/pages?project_id=${projectId}`
        );
        const data = await res.json();
        setPages(Array.isArray(data.pages) ? data.pages : []);
      } catch (err) {
        console.error("Failed to load top pages", err);
      }
    }

    load();
  }, [projectId]);

  // Limit to 5 rows for the card
  const topPages = pages.slice(0, 5);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle>Top Pages</CardTitle>
          <CardDescription>Most visited pages this month</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          <Eye className="mr-2 h-4 w-4" />
          View All
        </Button>
      </CardHeader>

      <CardContent className="space-y-3">
        {topPages.map((p, index) => (
          <div
            key={p.url + index}
            className="flex items-center gap-4 rounded-lg border p-3"
          >
            {/* Rank badge */}
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              #{index + 1}
            </div>

            {/* Main row content */}
            <div className="flex flex-1 flex-col gap-1">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium leading-none">
                    {p.url}
                  </p>
                </div>

                <div className="text-right text-sm font-medium">
                {p.unique_visitors} (unique) · {p.pageviews} total views
                </div>
              </div>
            </div>
          </div>
        ))}

        {topPages.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No pageviews yet for this period.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
