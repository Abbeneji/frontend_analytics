"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Activity, MousePointer2, TrendingUp } from "lucide-react"

export default function HeatmapPage() {
  const [urls, setUrls] = useState<string[]>([])
  const [selectedUrl, setSelectedUrl] = useState<string>("")
  const [heatmapData, setHeatmapData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [timeRange, setTimeRange] = useState("30d")
  const [viewMode, setViewMode] = useState<"clicks" | "movement" | "combined">("combined")
  const projectId = "proj_12345"

  // Fetch available URLs on mount
  useEffect(() => {
    async function fetchUrls() {
      try {
        const res = await fetch(`http://localhost:3000/analytics/pages?project_id=${projectId}`)
        const json = await res.json()
        const pageUrls = json.pages.map((p: any) => p.url)
        setUrls(pageUrls)
        if (pageUrls.length > 0) setSelectedUrl(pageUrls[0])
      } catch (err) {
        console.error("Failed to fetch URLs:", err)
      }
    }
    fetchUrls()
  }, [])

  // Fetch heatmap data when URL, time range, or view mode changes
  useEffect(() => {
    if (!selectedUrl) return

    async function fetchHeatmap() {
      setLoading(true)
      try {
        const { from, to } = computeTimeRange(timeRange)
        
        // Build URL with optional event_type parameter
        let apiUrl = `http://localhost:3000/analytics/heatmap?project_id=${projectId}&url=${encodeURIComponent(selectedUrl)}&from=${from}&to=${to}`
        
        if (viewMode === "clicks") {
          apiUrl += "&event_type=click"
        } else if (viewMode === "movement") {
          apiUrl += "&event_type=mousemove"
        }
        // If viewMode is "combined", don't add event_type parameter (shows all)
        
        const res = await fetch(apiUrl)
        const json = await res.json()
        setHeatmapData(json)
      } catch (err) {
        console.error("Failed to fetch heatmap:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchHeatmap()
  }, [selectedUrl, timeRange, viewMode])

  function computeTimeRange(range: string) {
    const now = Date.now()
    const days = range === "7d" ? 7 : range === "30d" ? 30 : 90
    return {
      from: now - days * 24 * 60 * 60 * 1000,
      to: now
    }
  }

  const totalClicks = heatmapData?.points?.reduce((sum: number, p: any) => sum + p.count, 0) || 0
  const hottestSpot = heatmapData?.points?.reduce((max: any, p: any) => 
    p.count > (max?.count || 0) ? p : max, null
  )

  return (
    <div className="flex-1 space-y-6 px-6 pt-0">
      {/* Header */}
      <div className="flex md:flex-row flex-col md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Heatmap</h1>
          <p className="text-muted-foreground">
            Visualize user interactions and click density
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select value={viewMode} onValueChange={(v: any) => setViewMode(v)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="combined">Combined</SelectItem>
              <SelectItem value="clicks">Clicks Only</SelectItem>
              <SelectItem value="movement">Movement Only</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Export</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointer2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClicks.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all tracked interactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Hottest Area</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {hottestSpot ? `${hottestSpot.count} clicks` : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {hottestSpot ? `At (${hottestSpot.x}, ${hottestSpot.y})` : "No data"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Heat Points</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {heatmapData?.points?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Unique interaction zones
            </p>
          </CardContent>
        </Card>
      </div>

      {/* URL Selector & Heatmap Canvas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Click Heatmap</CardTitle>
              <CardDescription>Select a page to visualize user interactions</CardDescription>
            </div>
            <Select value={selectedUrl} onValueChange={setSelectedUrl}>
              <SelectTrigger className="w-[400px]">
                <SelectValue placeholder="Select a page" />
              </SelectTrigger>
              <SelectContent>
                {urls.map((url) => (
                  <SelectItem key={url} value={url}>
                    {url.length > 50 ? `...${url.slice(-50)}` : url}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-[600px]">
              <div className="text-muted-foreground">Loading heatmap...</div>
            </div>
          ) : heatmapData && selectedUrl ? (
            <HeatmapViewer url={selectedUrl} data={heatmapData} viewMode={viewMode} />
          ) : (
            <div className="flex items-center justify-center h-[600px]">
              <div className="text-muted-foreground">No heatmap data available</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function HeatmapViewer({ url, data, viewMode }: { url: string; data: any; viewMode: "clicks" | "movement" | "combined" }) {
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const [iframeError, setIframeError] = useState(false)
  
  useEffect(() => {
    setIframeLoaded(false)
    setIframeError(false)
  }, [url])

  useEffect(() => {
    if (!iframeLoaded || !data?.points) return

    const canvas = document.getElementById('heatmap-overlay') as HTMLCanvasElement
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    // Set canvas to a large fixed size that covers most landing pages
    canvas.width = 1920
    canvas.height = 3000

    // Clear canvas with transparent background
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // All filtering is now done on the backend
    const pointsToShow = data.points

    if (!pointsToShow || pointsToShow.length === 0) return

    // Find max count for color scaling
    const maxCount = Math.max(...pointsToShow.map((p: any) => p.count))

    // Draw smooth, professional heatmap with proper circular gradients
    pointsToShow.forEach((point: any) => {
      const { x, y, count } = point
      const intensity = count / maxCount

      // Larger radius for smoother, more professional appearance
      const radius = 35
      
      // Center the gradient at the center of the 20x20 bucket (x+10, y+10)
      const centerX = x + 10
      const centerY = y + 10
      
      // Create smooth radial gradient
      const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, radius
      )
      
      // Color based on intensity with smooth falloff
      let color
      
      if (intensity < 0.25) {
        color = `59, 130, 246` // Blue
      } else if (intensity < 0.5) {
        color = `34, 197, 94` // Green
      } else if (intensity < 0.75) {
        color = `251, 191, 36` // Yellow/Orange
      } else {
        color = `239, 68, 68` // Red
      }

      // Create smooth gradient with proper falloff
      gradient.addColorStop(0, `rgba(${color}, ${0.8 * intensity})`)
      gradient.addColorStop(0.4, `rgba(${color}, ${0.5 * intensity})`)
      gradient.addColorStop(0.7, `rgba(${color}, ${0.2 * intensity})`)
      gradient.addColorStop(1, `rgba(${color}, 0)`)

      // Draw using arc for perfect circles
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.fill()
    })

  }, [iframeLoaded, data, viewMode])

  const handleIframeLoad = () => {
    setIframeLoaded(true)
  }

  const handleIframeError = () => {
    setIframeError(true)
  }

  return (
    <div className="relative">
      {iframeError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 rounded-lg z-10">
          <div className="text-center p-6">
            <p className="text-lg font-semibold mb-2">Unable to load page preview</p>
            <p className="text-sm text-muted-foreground mb-4">
              The page cannot be displayed due to security restrictions (CORS).
            </p>
            <p className="text-xs text-muted-foreground">
              Heatmap data is still available - showing overlay only.
            </p>
          </div>
        </div>
      )}
      
      <div className="relative overflow-auto border rounded-lg bg-white" style={{ maxHeight: '700px' }}>
        {/* Iframe - The actual page */}
        <iframe
          id="page-iframe"
          src={url}
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          className="w-full border-0"
          style={{ minWidth: '1920px', height: '3000px' }}
          sandbox="allow-same-origin allow-scripts"
        />
        
        {/* Canvas overlay - The heatmap */}
        <canvas 
          id="heatmap-overlay"
          className="absolute top-0 left-0 pointer-events-none"
          style={{ mixBlendMode: 'multiply' }}
        />
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-500/60"></div>
          <span className="text-muted-foreground">Low</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-500/60"></div>
          <span className="text-muted-foreground">Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-yellow-500/70"></div>
          <span className="text-muted-foreground">High</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-500/80"></div>
          <span className="text-muted-foreground">Very High</span>
        </div>
      </div>
    </div>
  )
}