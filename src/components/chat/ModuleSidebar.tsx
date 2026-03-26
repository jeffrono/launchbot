"use client";

import { cn } from "@/lib/cn";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface ModuleProgress {
  id: string;
  status: string;
  module: {
    id: string;
    slug: string;
    title: string;
    displayOrder: number;
  };
}

interface ModuleSidebarProps {
  progress: ModuleProgress[];
  onModuleClick: (moduleSlug: string) => void;
}

const statusConfig: Record<string, { icon: string; color: string; label: string }> = {
  not_started: { icon: "\u25CB", color: "text-gray-300", label: "Not started" },
  in_progress: { icon: "\u25CF", color: "text-blue-500", label: "In progress" },
  punted: { icon: "\u25CF", color: "text-amber-400", label: "Skipped" },
  partially_complete: { icon: "\u25CF", color: "text-orange-400", label: "In progress" },
  completed: { icon: "\u2713", color: "text-green-500", label: "Complete" },
};

export function ModuleSidebar({ progress, onModuleClick }: ModuleSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const completed = progress.filter((p) => p.status === "completed").length;
  const total = progress.length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div
      className={cn(
        "h-full border-r border-gray-200 bg-white transition-all duration-200 flex flex-col",
        collapsed ? "w-12" : "w-64"
      )}
    >
      {/* Toggle button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors flex items-center justify-center"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-gray-400" />
        )}
      </button>

      {!collapsed && (
        <>
          {/* Progress bar */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500">Progress</span>
              <span className="text-xs font-bold text-gray-700">{pct}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {completed} of {total} modules
            </p>
          </div>

          {/* Module list */}
          <div className="flex-1 overflow-y-auto p-2">
            {progress.map((p) => {
              const config = statusConfig[p.status] || statusConfig.not_started;
              return (
                <button
                  key={p.id}
                  onClick={() => onModuleClick(p.module.slug)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors",
                    p.status === "in_progress"
                      ? "bg-blue-50"
                      : "hover:bg-gray-50"
                  )}
                >
                  <span className={cn("text-lg", config.color)}>
                    {config.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "text-sm truncate",
                        p.status === "in_progress"
                          ? "font-semibold text-gray-900"
                          : "text-gray-700"
                      )}
                    >
                      {p.module.title}
                    </p>
                    <p className="text-xs text-gray-400">{config.label}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
