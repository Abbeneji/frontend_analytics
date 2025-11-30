"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { HeatmapViewer } from "./heatmap-viewer"

type Props = {
  urls: string[]
  selectedUrl: string
  setSelectedUrl: (u: string) => void
  loading: boolean
  heatmapData: any
  viewMode: "clicks" | "movement" | "combined"
}

export function HeatmapSelector({
  urls,
  selectedUrl,
  setSelectedUrl,
  loading,
  heatmapData,
  viewMode
}: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Click Heatmap</CardTitle>
            <CardDescription>Select a page to visualize interactions</CardDescription>
          </div>
          <Select value={selectedUrl} onValueChange={setSelectedUrl}>
            <SelectTrigger className="w-[400px]">
              <SelectValue placeholder="Select a page" />
            </SelectTrigger>
            <SelectContent>
              {urls.map(url => (
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
          <div className="flex items-center justify-center h-[600px] text-muted-foreground">
            Loading heatmap...
          </div>
        ) : heatmapData && selectedUrl ? (
          <HeatmapViewer url={selectedUrl} data={heatmapData} viewMode={viewMode} />
        ) : (
          <div className="flex items-center justify-center h-[600px] text-muted-foreground">
            No heatmap data available
          </div>
        )}
      </CardContent>
    </Card>
  )
}
