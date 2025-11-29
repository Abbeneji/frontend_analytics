import { Heart } from "lucide-react"
import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="px-4 py-6 lg:px-6">
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          <p className="text-xs text-muted-foreground">
          © 2025 JetBeat.io. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
