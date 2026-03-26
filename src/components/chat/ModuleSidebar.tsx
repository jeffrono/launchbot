"use client";

import { cn } from "@/lib/cn";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { useState, useMemo } from "react";

interface ModuleProgress {
  id: string;
  status: string;
  module: {
    id: string;
    slug: string;
    title: string;
    displayOrder: number;
    sectionSlug?: string;
    sectionTitle?: string;
    sectionOrder?: number;
    moduleType?: string;
  };
}

interface ModuleSidebarProps {
  progress: ModuleProgress[];
  onModuleClick: (moduleSlug: string) => void;
}

const statusDot: Record<string, { color: string; bg: string }> = {
  not_started: { color: "bg-gray-300", bg: "" },
  in_progress: { color: "bg-blue-500", bg: "bg-blue-50" },
  punted: { color: "bg-amber-400", bg: "" },
  partially_complete: { color: "bg-orange-400", bg: "bg-orange-50" },
  completed: { color: "bg-green-500", bg: "" },
};

interface Section {
  slug: string;
  title: string;
  order: number;
  content: ModuleProgress[];
  actions: ModuleProgress[];
}

export function ModuleSidebar({ progress, onModuleClick }: ModuleSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  // Find the active module's section for auto-expand
  const activeSection = useMemo(() => {
    const active = progress.find((p) => p.status === "in_progress");
    return active?.module.sectionSlug || "getting-started";
  }, [progress]);

  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set([activeSection])
  );

  // Group modules into sections
  const sections = useMemo(() => {
    const grouped = new Map<string, Section>();

    for (const p of progress) {
      const slug = p.module.sectionSlug || "getting-started";
      const title = p.module.sectionTitle || "Getting Started";
      const order = p.module.sectionOrder || 0;

      if (!grouped.has(slug)) {
        grouped.set(slug, { slug, title, order, content: [], actions: [] });
      }

      const section = grouped.get(slug)!;
      if (p.module.moduleType === "content") {
        section.content.push(p);
      } else {
        section.actions.push(p);
      }
    }

    return [...grouped.values()].sort((a, b) => a.order - b.order);
  }, [progress]);

  const completed = progress.filter((p) => p.status === "completed").length;
  const total = progress.length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  const toggleSection = (slug: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const getSectionProgress = (section: Section) => {
    const all = [...section.content, ...section.actions];
    const done = all.filter((p) => p.status === "completed").length;
    return { done, total: all.length };
  };

  const renderModule = (p: ModuleProgress) => {
    const dot = statusDot[p.status] || statusDot.not_started;
    const isActive = p.status === "in_progress";
    return (
      <button
        key={p.id}
        onClick={() => onModuleClick(p.module.slug)}
        className={cn(
          "w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-left transition-colors text-xs",
          isActive ? "bg-blue-50 font-semibold text-gray-900" : "text-gray-600 hover:bg-gray-50"
        )}
      >
        <span className={cn("w-2 h-2 rounded-full flex-shrink-0", dot.color)} />
        <span className="truncate">{p.module.title}</span>
      </button>
    );
  };

  return (
    <div
      className={cn(
        "h-full border-r border-gray-200 bg-white transition-all duration-200 flex flex-col",
        collapsed ? "w-12" : "w-72"
      )}
    >
      {/* Toggle */}
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
          <div className="px-4 pt-4 pb-3 border-b border-gray-100">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-gray-500">Progress</span>
              <span className="text-xs font-bold text-gray-700">{pct}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="text-[10px] text-gray-400 mt-1">
              {completed} of {total} completed
            </p>
          </div>

          {/* Section list */}
          <div className="flex-1 overflow-y-auto">
            {sections.map((section) => {
              const isExpanded = expandedSections.has(section.slug);
              const { done, total: sTotal } = getSectionProgress(section);
              const allDone = done === sTotal;

              return (
                <div key={section.slug} className="border-b border-gray-50">
                  {/* Section header */}
                  <button
                    onClick={() => toggleSection(section.slug)}
                    className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <ChevronDown
                      className={cn(
                        "w-3.5 h-3.5 text-gray-400 transition-transform flex-shrink-0",
                        !isExpanded && "-rotate-90"
                      )}
                    />
                    <span className="text-xs font-semibold text-gray-800 flex-1 text-left truncate">
                      {section.title}
                    </span>
                    <span
                      className={cn(
                        "text-[10px] font-medium px-1.5 py-0.5 rounded-full",
                        allDone
                          ? "bg-green-100 text-green-700"
                          : done > 0
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-500"
                      )}
                    >
                      {done}/{sTotal}
                    </span>
                  </button>

                  {/* Expanded section content */}
                  {isExpanded && (
                    <div className="pb-2">
                      {section.content.length > 0 && (
                        <div className="px-4 mb-1">
                          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1 pl-3">
                            Contents
                          </p>
                          {section.content.map(renderModule)}
                        </div>
                      )}
                      {section.actions.length > 0 && (
                        <div className="px-4">
                          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1 pl-3">
                            Actions
                          </p>
                          {section.actions.map(renderModule)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
