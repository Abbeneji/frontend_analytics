"use client";

import React from "react";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";

import {
  ThemeCustomizer,
  ThemeCustomizerTrigger,
} from "@/components/theme-customizer";

import { useSidebarConfig } from "@/hooks/use-sidebar-config";

// 🔥 GLOBAL PROVIDERS
import { ProjectProvider } from "./contexts/project-context";
import { DateFilterProvider } from "./contexts/date-filter-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [themeCustomizerOpen, setThemeCustomizerOpen] = React.useState(false);
  const { config } = useSidebarConfig();

  return (
    <ProjectProvider>
      <DateFilterProvider>
        <SidebarProvider
          style={{
            "--sidebar-width": "16rem",
            "--sidebar-width-icon": "3rem",
            "--header-height": "calc(var(--spacing) * 14)",
          } as React.CSSProperties}
          className={config.collapsible === "none" ? "sidebar-none-mode" : ""}
        >
          {config.side === "left" ? (
            <>
              {/* ==== LEFT SIDEBAR ==== */}
              <AppSidebar
                variant={config.variant}
                collapsible={config.collapsible}
                side={config.side}
              />

              <SidebarInset>
                {/* ==== HEADER (with ProjectSelector + DateFilter) ==== */}
                <SiteHeader />

                {/* ==== MAIN CONTENT AREA ==== */}
                <div className="flex flex-1 flex-col">
                  <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                      {children}
                    </div>
                  </div>
                </div>

                {/* ==== FOOTER ==== */}
                <SiteFooter />
              </SidebarInset>
            </>
          ) : (
            <>
              {/* ==== TOP FIRST, RIGHT SIDEBAR LATER ==== */}
              <SidebarInset>
                <SiteHeader />

                <div className="flex flex-1 flex-col">
                  <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                      {children}
                    </div>
                  </div>
                </div>

                <SiteFooter />
              </SidebarInset>

              <AppSidebar
                variant={config.variant}
                collapsible={config.collapsible}
                side={config.side}
              />
            </>
          )}

          {/* ==== THEME CUSTOMIZER ==== */}
          <ThemeCustomizerTrigger onClick={() => setThemeCustomizerOpen(true)} />

          <ThemeCustomizer
            open={themeCustomizerOpen}
            onOpenChange={setThemeCustomizerOpen}
          />
        </SidebarProvider>
      </DateFilterProvider>
    </ProjectProvider>
  );
}
