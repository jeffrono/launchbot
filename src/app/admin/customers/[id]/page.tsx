"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Download } from "lucide-react";
import { cn } from "@/lib/cn";

interface CustomerDetail {
  id: string;
  name: string;
  studioId: string | null;
  workspaceSlug: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  progress: {
    id: string;
    status: string;
    completedAt: string | null;
    puntedAt: string | null;
    collectedData: Record<string, unknown>;
    module: {
      id: string;
      slug: string;
      title: string;
      displayOrder: number;
    };
  }[];
  collectedData: {
    id: string;
    dataType: string;
    data: Record<string, unknown>;
    updatedAt: string;
  }[];
}

const statusColors: Record<string, string> = {
  not_started: "bg-gray-100 text-gray-600",
  in_progress: "bg-blue-100 text-blue-700",
  punted: "bg-amber-100 text-amber-700",
  completed: "bg-green-100 text-green-700",
};

export default function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/customers/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setCustomer(data);
        setLoading(false);
      });
  }, [id]);

  const exportData = async () => {
    const res = await fetch(`/api/customers/${id}/export`);
    const data = await res.json();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `customer-${id}-export.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <p className="text-gray-400 text-sm">Loading...</p>;
  if (!customer) return <p className="text-red-500 text-sm">Customer not found</p>;

  const completed = customer.progress.filter((p) => p.status === "completed").length;
  const total = customer.progress.length;

  return (
    <div>
      <Link
        href="/admin"
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Back to customers
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{customer.name}</h2>
          <p className="text-sm text-gray-400">
            {customer.studioId ? `Studio #${customer.studioId}` : "No studio ID"}{" "}
            &middot; Created {new Date(customer.createdAt).toLocaleDateString()}{" "}
            &middot; {completed}/{total} modules complete
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/chat/${customer.workspaceSlug}`}
            target="_blank"
            className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <ExternalLink className="w-4 h-4" /> Open Workspace
          </Link>
          <button
            onClick={exportData}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Download className="w-4 h-4" /> Export JSON
          </button>
        </div>
      </div>

      {/* Module Progress */}
      <div className="bg-white rounded-xl border border-gray-200 mb-6">
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">
            Module Progress
          </h3>
        </div>
        <div className="divide-y divide-gray-50">
          {customer.progress
            .sort((a, b) => a.module.displayOrder - b.module.displayOrder)
            .map((p) => (
              <div key={p.id} className="flex items-center gap-4 p-4">
                <span className="text-xs text-gray-400 w-6 text-right">
                  {p.module.displayOrder}
                </span>
                <span className="text-sm text-gray-900 flex-1">
                  {p.module.title}
                </span>
                <span
                  className={cn(
                    "text-xs font-medium px-2.5 py-1 rounded-full",
                    statusColors[p.status] || statusColors.not_started
                  )}
                >
                  {p.status.replace("_", " ")}
                </span>
                {p.completedAt && (
                  <span className="text-xs text-gray-400">
                    {new Date(p.completedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            ))}
        </div>
      </div>

      {/* Collected Data */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">
            Collected Data
          </h3>
        </div>
        {customer.collectedData.length === 0 ? (
          <p className="p-4 text-sm text-gray-400">No data collected yet.</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {customer.collectedData.map((cd) => (
              <div key={cd.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900 capitalize">
                    {cd.dataType.replace("_", " ")}
                  </span>
                  <span className="text-xs text-gray-400">
                    Updated {new Date(cd.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <pre className="text-xs text-gray-600 bg-gray-50 rounded-lg p-3 overflow-x-auto">
                  {JSON.stringify(cd.data, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
