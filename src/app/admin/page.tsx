"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, ExternalLink, Download, Search, Trash2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { TableSkeleton } from "@/components/ui/Skeleton";

interface Customer {
  id: string;
  name: string;
  studioId: string | null;
  workspaceSlug: string;
  createdAt: string;
  progress: { status: string }[];
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");
  const [newName, setNewName] = useState("");
  const [newStudioId, setNewStudioId] = useState("");

  const [error, setError] = useState("");

  const fetchCustomers = async () => {
    try {
      const res = await fetch("/api/customers");
      if (!res.ok) throw new Error("Failed to load customers");
      const data = await res.json();
      setCustomers(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  const bulkExport = async () => {
    const allData = [];
    for (const c of customers) {
      const res = await fetch(`/api/customers/${c.id}/export`);
      if (res.ok) allData.push(await res.json());
    }
    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `all-customers-export.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const createCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    await fetch("/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newName.trim(),
        studioId: newStudioId.trim() || null,
      }),
    });

    setNewName("");
    setNewStudioId("");
    setShowCreate(false);
    fetchCustomers();
  };

  const deleteCustomer = async (id: string) => {
    if (!confirm("Delete this customer and all their data?")) return;
    await fetch(`/api/customers/${id}`, { method: "DELETE" });
    fetchCustomers();
  };

  const exportCustomer = async (id: string) => {
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

  const getProgressSummary = (progress: { status: string }[]) => {
    const total = progress.length;
    const completed = progress.filter((p) => p.status === "completed").length;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, pct };
  };

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Customers</h2>
          <p className="text-sm text-gray-400">
            {customers.length} customer{customers.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-2">
          {customers.length > 0 && (
            <button
              onClick={bulkExport}
              className="flex items-center gap-2 border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" /> Export All
            </button>
          )}
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> New Customer
          </button>
        </div>
      </div>

      {/* Create customer modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Create Customer
            </h3>
            <form onSubmit={createCustomer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name *
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mindbody Studio ID
                </label>
                <input
                  type="text"
                  value={newStudioId}
                  onChange={(e) => setNewStudioId(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Optional"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customers..."
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Customer list */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <TableSkeleton rows={4} />
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-sm">
            {customers.length === 0
              ? "No customers yet. Create one to get started!"
              : "No customers match your search."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          {filtered.map((customer) => {
            const { completed, total, pct } = getProgressSummary(
              customer.progress
            );
            return (
              <div
                key={customer.id}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/admin/customers/${customer.id}`}
                    className="text-sm font-semibold text-gray-900 hover:text-blue-600"
                  >
                    {customer.name}
                  </Link>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {customer.studioId
                      ? `Studio #${customer.studioId}`
                      : "No studio ID"}{" "}
                    &middot; Created{" "}
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="w-32">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>
                      {completed}/{total}
                    </span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        pct === 100 ? "bg-green-500" : "bg-blue-500"
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <Link
                    href={`/chat/${customer.workspaceSlug}`}
                    target="_blank"
                    className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                    title="Open chat workspace"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => exportCustomer(customer.id)}
                    className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50"
                    title="Export data"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteCustomer(customer.id)}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                    title="Delete customer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
