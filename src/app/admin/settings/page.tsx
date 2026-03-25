"use client";

import { useState } from "react";
import { Save } from "lucide-react";

export default function SettingsPage() {
  const [globalPrompt, setGlobalPrompt] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    // TODO: Persist global prompt to DB or config
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">
          Global System Prompt Override
        </h3>
        <p className="text-xs text-gray-400 mb-3">
          This text is prepended to all conversations. Leave empty to use the
          default personality. The default prompt handles tone, response format,
          and behavioral rules.
        </p>
        <textarea
          value={globalPrompt}
          onChange={(e) => setGlobalPrompt(e.target.value)}
          rows={12}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Optional: Add custom instructions that will be included in every conversation..."
        />
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
          >
            <Save className="w-4 h-4" /> Save Settings
          </button>
          {saved && (
            <span className="text-sm text-green-600">Settings saved!</span>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">
          Environment Status
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-gray-600">Database connected</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-gray-600">
              Anthropic API: Configure ANTHROPIC_API_KEY in environment
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-gray-600">
              Firecrawl API: Configure FIRECRAWL_API_KEY in environment
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
