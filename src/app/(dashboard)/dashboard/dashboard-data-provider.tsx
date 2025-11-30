"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { analytics } from "@/lib/api/analytics";
import { useProject } from "@/app/(dashboard)/contexts/project-context";

// -------------------------------
// TYPES
// -------------------------------
type OverviewResponse = {
  totals: {
    visitors: number;
    sessions: number;
    pageviews: number;
    bounce_rate: number;
    avg_session_duration: number;
  };
  timeseries: Array<{
    date: string;
    visitors: number;
    sessions: number;
    pageviews: number;
  }>;
};

type LiveResponse = {
  active: number;
  visitors: Array<{
    uid: string;
    session: string;
    url: string;
    browser: string;
    os: string;
    referrer: string;
    locale: string;
    country?: string;
    last_seen: number;
  }>;
};

type DashboardData = {
  overview: OverviewResponse | null;
  live: LiveResponse | null;
  loading: boolean;
};

// -------------------------------
// CONTEXT
// -------------------------------
const DashboardDataContext = createContext<DashboardData | null>(null);

// -------------------------------
// PROVIDER
// -------------------------------
export function DashboardDataProvider({ children }: { children: ReactNode }) {
  const { selectedProject } = useProject();

  const [overview, setOverview] = useState<OverviewResponse | null>(null);
  const [live, setLive] = useState<LiveResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!selectedProject) return;

    let active = true;

    async function load() {
      const projectId: string = selectedProject!.project_id;

      try {
        setLoading(true);

        const now = Date.now();
        const from = now - 90 * 24 * 60 * 60 * 1000;

        const [overviewRes, liveRes] = await Promise.all([
          analytics.overview(projectId, from, now) as Promise<OverviewResponse>,
          analytics.live(projectId) as Promise<LiveResponse>,
        ]);

        if (!active) return;

        setOverview(overviewRes);
        setLive(liveRes);
      } finally {
        if (active) setLoading(false);
      }
    }

    load();

    const interval = setInterval(load, 5000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [selectedProject]);

  return (
    <DashboardDataContext.Provider value={{ overview, live, loading }}>
      {children}
    </DashboardDataContext.Provider>
  );
}

// -------------------------------
// HOOK
// -------------------------------
export function useDashboardData() {
  const ctx = useContext(DashboardDataContext);
  if (!ctx)
    throw new Error(
      "useDashboardData must be used inside DashboardDataProvider"
    );
  return ctx;
}
