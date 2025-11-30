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
import { Button } from "@/components/ui/button";

import { TopPagesSheet } from "./top-pages-sheet";
import { useDashboard2Data } from "../dashboard2-data-provider";

export function TopPages() {
  const { pages, loading } = useDashboard2Data();
  const [sheetOpen, setSheetOpen] = useState(false);

  const topPages = useMemo(
    () => (pages ?? []).slice(0, 5),
    [pages]
  );

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle>Top Pages</CardTitle>
            <CardDescription>Most visited pages in the selected window</CardDescription>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setSheetOpen(true)}
            disabled={loading || !pages || pages.length === 0}
          >
            <Eye className="mr-2 h-4 w-4" />
            View All
          </Button>
        </CardHeader>

        <CardContent className="space-y-3">
          {loading && (
            <p className="text-sm text-muted-foreground">
              Loading page analytics…
            </p>
          )}

          {!loading && topPages.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No pageviews yet for this period.
            </p>
          )}

          {!loading &&
            topPages.map((p, index) => (
              <div
                key={p.url + index}
                className="flex items-center gap-4 rounded-lg border p-3"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  #{index + 1}
                </div>

                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium leading-none">
                        {p.url}
                      </p>
                    </div>

                    <div className="text-right text-xs sm:text-sm font-medium">
                      {p.unique_visitors.toLocaleString()} unique ·{" "}
                      {p.pageviews.toLocaleString()} total views
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </CardContent>
      </Card>

      <TopPagesSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </>
  );
}
