// src/lib/api/analytics.ts

const BASE_URL = "http://localhost:3000"; // analytics backend

// --------------------------------------------------
// Helper to build query strings
// --------------------------------------------------
function qs(params: Record<string, any>) {
  const q = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");

  return q.length > 0 ? `?${q}` : "";
}

// --------------------------------------------------
// Generic request wrapper
// --------------------------------------------------
async function request<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    console.error("[Analytics API ERROR]", res.status, url);
    throw new Error(`Failed API call: ${url}`);
  }
  return res.json();
}

// --------------------------------------------------
// ANALYTICS API
// --------------------------------------------------

export const analytics = {
  // -----------------------------
  // Overview (visitors, sessions, pageviews, timeseries, bounce rate)
  // -----------------------------
  async overview(projectId: string, from?: number, to?: number) {
    return request(
      `${BASE_URL}/analytics/overview` +
        qs({ project_id: projectId, from, to })
    );
  },

  // -----------------------------
  // Pages list
  // -----------------------------
  async pages(projectId: string, from?: number, to?: number) {
    return request(
      `${BASE_URL}/analytics/pages` +
        qs({ project_id: projectId, from, to })
    );
  },

  // -----------------------------
  // Referrer breakdown
  // -----------------------------
  async referrers(projectId: string, from?: number, to?: number) {
    return request(
      `${BASE_URL}/analytics/referrers` +
        qs({ project_id: projectId, from, to })
    );
  },

  // -----------------------------
  // Device + Browser + OS stats
  // -----------------------------
  async devices(projectId: string, from?: number, to?: number) {
    return request(
      `${BASE_URL}/analytics/devices` +
        qs({ project_id: projectId, from, to })
    );
  },

  // -----------------------------
  // Recent visits (last N events)
  // -----------------------------
  async recent(projectId: string, limit: number = 20) {
    return request(
      `${BASE_URL}/analytics/recent` +
        qs({ project_id: projectId, limit })
    );
  },

  // -----------------------------
  // Sessions list
  // -----------------------------
  async sessions(projectId: string, from?: number, to?: number) {
    return request(
      `${BASE_URL}/analytics/sessions` +
        qs({ project_id: projectId, from, to })
    );
  },

  // -----------------------------
  // Live visitors (last 5 minutes)
  // -----------------------------
  async live(projectId: string) {
    return request(
      `${BASE_URL}/analytics/live` +
        qs({ project_id: projectId })
    );
  },

  // -----------------------------
  // Heatmap points for a URL
  // -----------------------------
  async heatmap(
    projectId: string,
    url: string,
    from?: number,
    to?: number,
    event_type?: "click" | "mousemove" | "combined"
  ) {
    return request(
      `${BASE_URL}/analytics/heatmap` +
        qs({ project_id: projectId, url, from, to, event_type })
    );
  },

  // -----------------------------
  // Raw event logs (optional)
  // -----------------------------
  async events(projectId: string, from?: number, to?: number) {
    return request(
      `${BASE_URL}/analytics/events` +
        qs({ project_id: projectId, from, to })
    );
  },
};
