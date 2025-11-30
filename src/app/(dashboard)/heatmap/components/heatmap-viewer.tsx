"use client";

import { useEffect, useState } from "react";

interface HeatmapViewerProps {
  url: string;
  data: {
    bucketSize: number;
    points: { x: number; y: number; count: number }[];
    viewport_w?: number;
    viewport_h?: number;
  };
  viewMode: "clicks" | "movement" | "combined";
}

export function HeatmapViewer({ url, data, viewMode }: HeatmapViewerProps) {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  const VIEW_W = data.viewport_w || 1920;
  const VIEW_H = data.viewport_h || 2000;

  // Reset state on URL change
  useEffect(() => {
    setIframeLoaded(false);
    setIframeError(false);
  }, [url]);

  /**
   * Inject CSS into the iframe to remove margins, padding,
   * internal scrollbars, and layout offsets.
   */
  function injectCSS(iframe: HTMLIFrameElement) {
    try {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) return;

      const style = doc.createElement("style");
      style.innerHTML = `
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          overflow: hidden !important;
          width: 100% !important;
          height: auto !important;
        }
        * {
          margin: 0 !important;
        }
      `;
      doc.head.appendChild(style);
    } catch (err) {
      console.warn("CSS injection failed (sandbox / CORS):", err);
    }
  }

  /**
   * Update wrapper scaling based on container width
   */
  useEffect(() => {
    function updateScale() {
      const wrapper = document.getElementById("heatmap-scale-wrapper") as HTMLDivElement;
      if (!wrapper) return;

      const container = wrapper.parentElement!;
      const containerWidth = container.clientWidth;

      const scale = containerWidth / VIEW_W;

      wrapper.style.transform = `scale(${scale})`;
      wrapper.style.transformOrigin = "top left";

      wrapper.style.width = `${VIEW_W}px`;
      wrapper.style.height = `${VIEW_H}px`;

      // Outer scroll area uses scaled height
      wrapper.style.margin = "0";
      wrapper.style.padding = "0";

      const outer = container as HTMLDivElement;
      outer.style.height = `${VIEW_H * scale}px`;
    }

    updateScale();
    window.addEventListener("resize", updateScale);

    return () => window.removeEventListener("resize", updateScale);
  }, [VIEW_W, VIEW_H]);

  /**
   * Draw heatmap overlay (always in real resolution)
   */
  useEffect(() => {
    if (!iframeLoaded || !data?.points) return;

    const canvas = document.getElementById("heatmap-overlay") as HTMLCanvasElement;
    if (!canvas) return;

    canvas.width = VIEW_W;
    canvas.height = VIEW_H;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    ctx.clearRect(0, 0, VIEW_W, VIEW_H);

    const bucketSize = data.bucketSize || 20;
    const points = data.points || [];
    const maxCount = Math.max(...points.map((p) => p.count), 1);

    points.forEach(({ x, y, count }) => {
      const intensity = count / maxCount;
      const radius = 35;

      const cx = x + bucketSize / 2;
      const cy = y + bucketSize / 2;

      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);

      let rgb;
      if (intensity < 0.25) rgb = "59, 130, 246";
      else if (intensity < 0.5) rgb = "34, 197, 94";
      else if (intensity < 0.75) rgb = "251, 191, 36";
      else rgb = "239, 68, 68";

      gradient.addColorStop(0, `rgba(${rgb}, ${0.8 * intensity})`);
      gradient.addColorStop(0.4, `rgba(${rgb}, ${0.5 * intensity})`);
      gradient.addColorStop(0.7, `rgba(${rgb}, ${0.2 * intensity})`);
      gradient.addColorStop(1, `rgba(${rgb}, 0)`);

      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    });
  }, [iframeLoaded, data, viewMode, VIEW_W, VIEW_H]);

  return (
    <div className="relative">
      {iframeError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 rounded-lg z-10">
          <div className="text-center p-6">
            <p className="text-lg font-semibold">Page preview blocked (CORS)</p>
            <p className="text-sm text-muted-foreground">Heatmap overlay still available.</p>
          </div>
        </div>
      )}

      {/* OUTER SCROLL AREA */}
      <div
        className="relative overflow-auto border rounded-lg bg-white"
        style={{
          maxHeight: "700px",
          overflowX: "hidden",
          width: "100%",
        }}
      >
        <div
          id="heatmap-scale-wrapper"
          style={{
            position: "relative",
            margin: 0,
            padding: 0,
          }}
        >
          {/* IFRAME */}
          <iframe
            id="heatmap-iframe"
            src={url}
            onLoad={(e) => {
              setIframeLoaded(true);
              injectCSS(e.currentTarget);
            }}
            onError={() => setIframeError(true)}
            className="border-0"
            style={{
              width: `${VIEW_W}px`,
              height: `${VIEW_H}px`,
              pointerEvents: "none",
              margin: 0,
              padding: 0,
              overflow: "hidden",
              display: "block",
            }}
            sandbox="allow-same-origin allow-scripts"
          />

          {/* OVERLAY */}
          <canvas
            id="heatmap-overlay"
            className="absolute top-0 left-0 pointer-events-none"
            style={{
              width: `${VIEW_W}px`,
              height: `${VIEW_H}px`,
              mixBlendMode: "multiply",
            }}
          />
        </div>
      </div>
    </div>
  );
}
