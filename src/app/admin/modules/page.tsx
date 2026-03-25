"use client";

import { useState, useEffect } from "react";
import { Plus, GripVertical, Pencil, Trash2 } from "lucide-react";

interface Module {
  id: string;
  slug: string;
  title: string;
  description: string;
  displayOrder: number;
  dependencyGroup: string | null;
  systemPromptFragment: string;
  content: Record<string, unknown>;
}

export default function ModulesPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Module | null>(null);
  const [creating, setCreating] = useState(false);

  const fetchModules = async () => {
    const res = await fetch("/api/modules");
    const data = await res.json();
    setModules(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const deleteModule = async (id: string) => {
    if (!confirm("Delete this module?")) return;
    await fetch(`/api/modules/${id}`, { method: "DELETE" });
    fetchModules();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Modules</h2>
          <p className="text-sm text-gray-400">
            Manage onboarding modules and their prompts
          </p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" /> New Module
        </button>
      </div>

      {/* Module editor modal */}
      {(editing || creating) && (
        <ModuleEditor
          module={editing}
          onClose={() => {
            setEditing(null);
            setCreating(false);
          }}
          onSave={() => {
            setEditing(null);
            setCreating(false);
            fetchModules();
          }}
        />
      )}

      {/* Module list */}
      {loading ? (
        <p className="text-gray-400 text-sm">Loading...</p>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-50">
          {modules.map((mod) => (
            <div
              key={mod.id}
              className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
            >
              <GripVertical className="w-4 h-4 text-gray-300 cursor-grab" />
              <span className="text-xs text-gray-400 w-8 text-right font-mono">
                #{mod.displayOrder}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">
                  {mod.title}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {mod.slug}
                  {mod.dependencyGroup &&
                    ` \u00b7 group: ${mod.dependencyGroup}`}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setEditing(mod)}
                  className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteModule(mod.id)}
                  className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ModuleEditor({
  module,
  onClose,
  onSave,
}: {
  module: Module | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const [form, setForm] = useState({
    slug: module?.slug || "",
    title: module?.title || "",
    description: module?.description || "",
    displayOrder: module?.displayOrder || 0,
    dependencyGroup: module?.dependencyGroup || "",
    systemPromptFragment: module?.systemPromptFragment || "",
    content: module?.content ? JSON.stringify(module.content, null, 2) : "{}",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    let parsedContent = {};
    try {
      parsedContent = JSON.parse(form.content);
    } catch {
      alert("Invalid JSON in content field");
      setSaving(false);
      return;
    }

    const url = module ? `/api/modules/${module.id}` : "/api/modules";
    const method = module ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        displayOrder: Number(form.displayOrder),
        dependencyGroup: form.dependencyGroup || null,
        content: parsedContent,
      }),
    });

    setSaving(false);
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">
            {module ? "Edit Module" : "Create Module"}
          </h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug *
              </label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Display Order
              </label>
              <input
                type="number"
                value={form.displayOrder}
                onChange={(e) =>
                  setForm({ ...form, displayOrder: Number(e.target.value) })
                }
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dependency Group
              </label>
              <input
                type="text"
                value={form.dependencyGroup}
                onChange={(e) =>
                  setForm({ ...form, dependencyGroup: e.target.value })
                }
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Optional"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              System Prompt Fragment
            </label>
            <textarea
              value={form.systemPromptFragment}
              onChange={(e) =>
                setForm({ ...form, systemPromptFragment: e.target.value })
              }
              rows={8}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Instructions for the LLM when this module is active..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content (JSON)
            </label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={6}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="{}"
            />
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : module ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
