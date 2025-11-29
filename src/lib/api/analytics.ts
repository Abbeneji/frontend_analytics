// src/lib/api/analytics.ts

const BASE_URL = "http://localhost:3000"; // your analytics backend

// Helper to build query strings
function qs(params: Record<string, any>) {
  const q = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");

  return q.length > 0 ? `?${q}` : "";
}

// Generic requester
async function request<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    console.error("[Analytics API ERROR]", res.status, url);
    throw new Error(`Failed API call: ${url}`);
  }
  return res.json();
}

// --------------
// API METHODS
// --------------

export const analytics = {
  /** Overview tile data (visitors, sessions, pageviews, bounce rate, timeseries) */
  async overview(projectId: string, from: number, to: number) {
    return request(
      `${BASE_URL}/analytics/overview` +
        qs({ project_id: projectId, from, to })
    );
  },

  /** Page-level stats list */
  async pages(projectId: string, from: number, to: number) {
    return request(
      `${BASE_URL}/analytics/pages` +
        qs({ project_id: projectId, from, to })
    );
  },

  /** Heatmap points for a specific URL */
  async heatmap(projectId: string, url: string, from: number, to: number) {
    return request(
      `${BASE_URL}/analytics/heatmap` +
        qs({ project_id: projectId, url, from, to })
    );
  },

  /** Session-level events (optional future feature) */
  async events(projectId: string, from?: number, to?: number) {
    return request(
      `${BASE_URL}/analytics/events` +
        qs({ project_id: projectId, from, to })
    );
  },
};
