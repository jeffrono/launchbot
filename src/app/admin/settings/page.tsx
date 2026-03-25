"use client";

import { useState, useEffect } from "react";
import { Save, Check } from "lucide-react";

export default function SettingsPage() {
  const [globalPrompt, setGlobalPrompt] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load settings");
        return res.json();
      })
      .then((data) => {
        setGlobalPrompt(data.globalPromptOverride || "");
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Load failed"))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ globalPromptOverride: globalPrompt }),
      });
      if (!res.ok) throw new Error("Failed to save");
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
          <p className="text-sm text-gray-400">
            Configure global bot behavior and personality
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">
          Global System Prompt Override
        </h3>
        <p className="text-xs text-gray-400 mb-3">
          This text is prepended to all conversations. Leave empty to use the
          default personality.
        </p>
        {loading ? (
          <div className="animate-pulse h-48 bg-gray-100 rounded-lg" />
        ) : (
          <textarea
            value={globalPrompt}
            onChange={(e) => setGlobalPrompt(e.target.value)}
            rows={12}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Optional: Add custom instructions that will be included in every conversation..."
          />
        )}
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4" /> Saved
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Settings"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
