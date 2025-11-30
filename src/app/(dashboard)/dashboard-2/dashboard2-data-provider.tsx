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
import { useDateFilter } from "../contexts/date-filter-context";

// ------------ TYPES ------------

type OverviewPoint = {
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
    avg_session_duration?: number;
  };
  timeseries: OverviewPoint[];
};

type DevicesResponse = {
  devices: {
    desktop: number;
    tablet: number;
    mobile: number;
  };
  browsers: Record<string, number>;
  os: Record<string, number>;
};

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

type Visit = {
  uid: string;
  ts: number;
  url: string;
  browser: string | null;
  os: string | null;
  locale?: string | null;
  referrer?: string | null;
};

type Dashboard2Data = {
  projectId: string | null;
  overview: OverviewResponse | null;
  devices: DevicesResponse | null;
  pages: PageStat[] | null;
  recentVisits: Visit[] | null;
  loading: boolean;
};

// ------------ CONTEXT ------------

const Dashboard2DataContext = createContext<Dashboard2Data | null>(null);

// ------------ PROVIDER ------------

export function Dashboard2DataProvider({ children }: { children: ReactNode }) {
  const { selectedProject } = useProject();
  const { range } = useDateFilter();

  const [overview, setOverview] = useState<OverviewResponse | null>(null);
  const [devices, setDevices] = useState<DevicesResponse | null>(null);
  const [pages, setPages] = useState<PageStat[] | null>(null);
  const [recentVisits, setRecentVisits] = useState<Visit[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!selectedProject) return;

    let active = true;

    const projectId = selectedProject.project_id;
    const { from, to } = range;

    async function load() {
      try {
        setLoading(true);

        const [overviewRes, devicesRes, pagesRes, recentRes] = await Promise.all([
          analytics.overview(projectId, from, to) as Promise<OverviewResponse>,
          analytics.devices(projectId) as Promise<DevicesResponse>,
          analytics.pages(projectId, from, to) as Promise<{ pages: PageStat[] }>,
          analytics.recent(projectId, 2000) as Promise<{ visits: Visit[] }>,
        ]);

        if (!active) return;

        setOverview(overviewRes);
        setDevices(devicesRes);
        setPages(pagesRes.pages ?? []);
        setRecentVisits(recentRes.visits ?? []);
      } finally {
        if (active) setLoading(false);
      }
    }

    load();

    const interval = setInterval(load, 10_000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [selectedProject, range]);

  const projectId = selectedProject?.project_id ?? null;

  return (
    <Dashboard2DataContext.Provider
      value={{ projectId, overview, devices, pages, recentVisits, loading }}
    >
      {children}
    </Dashboard2DataContext.Provider>
  );
}

// ------------ HOOK ------------

export function useDashboard2Data() {
  const ctx = useContext(Dashboard2DataContext);
  if (!ctx) throw new Error("useDashboard2Data must be inside Dashboard2DataProvider");
  return ctx;
}
