"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { analytics } from "@/lib/api/analytics";
import { useProject } from "@/app/(dashboard)/contexts/project-context";

// -------------------------------
// TYPES
// -------------------------------

type OverviewTimeseriesPoint = {
  date: string;
  visitors: number;
  sessions: number;
  pageviews: number;
};

type OverviewResponse = {
  totals: {
    visitors: number;
    sessions: number;
    pageviews: number;
    bounce_rate: number;
    avg_session_duration: number;
  };
  timeseries: OverviewTimeseriesPoint[];
};

type LiveVisitor = {
  uid: string;
  session: string;
  url: string;
  browser: string;
  os: string;
  referrer: string;
  locale: string;
  country?: string;
  last_seen: number;
};

type LiveResponse = {
  active: number;
  visitors: LiveVisitor[];
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedProject) return;

    const projectId = selectedProject.project_id; // TS-safe snapshot
    let active = true;

    async function loadInitial() {
      try {
        setLoading(true);

        const now = Date.now();
        const from = now - 90 * 24 * 60 * 60 * 1000;

        // Explicitly type the tuple from Promise.all
        const [overviewRes, liveRes] = (await Promise.all([
          analytics.overview(projectId, from, now),
          analytics.live(projectId),
        ])) as [OverviewResponse, LiveResponse];

        if (!active) return;

        setOverview(overviewRes);
        setLive(liveRes);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadInitial();

    // Refresh ONLY "live" every 5 seconds
    const interval = setInterval(() => {
      analytics
        .live(projectId)
        .then((res) => {
          if (!active) return;
          // res is unknown -> cast to LiveResponse here
          setLive(res as LiveResponse);
        })
        .catch(() => {
          // swallow polling errors
        });
    }, 5000);

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
  if (!ctx) {
    throw new Error(
      "useDashboardData must be used inside DashboardDataProvider"
    );
  }
  return ctx;
}
