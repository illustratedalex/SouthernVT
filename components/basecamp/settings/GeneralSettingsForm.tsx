"use client";

import { GeneralSettings } from "@/types/Settings";
import { useState } from "react";

interface GeneralSettingsFormProps {
  settings: GeneralSettings;
}

export function GeneralSettingsForm({ settings }: GeneralSettingsFormProps) {
  const [formData, setFormData] = useState(settings);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Site Information */}
      <section className="rounded-2xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Site Information</h3>
        <p className="mt-1 text-sm text-slate-600">General settings for your SouthernVT instance</p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-800">Site Name</label>
            <input
              type="text"
              value={formData.siteName}
              onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
              className="mt-2 w-full rounded-lg border border-[#d7cbb3] bg-[#fcfaf6] px-4 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-[#1f3b2f] focus:outline-none focus:ring-1 focus:ring-[#1f3b2f]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800">Theme</label>
            <select
              value={formData.theme}
              onChange={(e) => setFormData({ ...formData, theme: e.target.value as any })}
              className="mt-2 w-full rounded-lg border border-[#d7cbb3] bg-[#fcfaf6] px-4 py-2 text-sm text-slate-900 focus:border-[#1f3b2f] focus:outline-none focus:ring-1 focus:ring-[#1f3b2f]"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>
        </div>
      </section>

      {/* Editorial Defaults */}
      <section className="rounded-2xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Editorial Defaults</h3>
        <p className="mt-1 text-sm text-slate-600">Default requirements for new content</p>

        <div className="mt-6 space-y-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.editorial.defaultVerificationRequired}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  editorial: { ...formData.editorial, defaultVerificationRequired: e.target.checked },
                })
              }
              className="h-5 w-5 rounded border-[#d7cbb3] text-[#1f3b2f] focus:ring-[#1f3b2f]"
            />
            <span className="text-sm font-semibold text-slate-800">Require verification for all new places</span>
          </label>

          <div>
            <label className="block text-sm font-semibold text-slate-800">Default Publication Window (days)</label>
            <input
              type="number"
              min="1"
              max="30"
              value={formData.editorial.defaultPublicationWindow}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  editorial: { ...formData.editorial, defaultPublicationWindow: parseInt(e.target.value) },
                })
              }
              className="mt-2 w-full rounded-lg border border-[#d7cbb3] bg-[#fcfaf6] px-4 py-2 text-sm text-slate-900 focus:border-[#1f3b2f] focus:outline-none focus:ring-1 focus:ring-[#1f3b2f]"
            />
            <p className="mt-1 text-xs text-slate-600">Days between verification and publication</p>
          </div>
        </div>
      </section>

      {/* Verification Defaults */}
      <section className="rounded-2xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Verification Defaults</h3>
        <p className="mt-1 text-sm text-slate-600">Default verification requirements</p>

        <div className="mt-6 space-y-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.verification.autoApprovePhotos}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  verification: { ...formData.verification, autoApprovePhotos: e.target.checked },
                })
              }
              className="h-5 w-5 rounded border-[#d7cbb3] text-[#1f3b2f] focus:ring-[#1f3b2f]"
            />
            <span className="text-sm font-semibold text-slate-800">Auto-approve photos from trusted sources</span>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.verification.requireVerificationBadge}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  verification: { ...formData.verification, requireVerificationBadge: e.target.checked },
                })
              }
              className="h-5 w-5 rounded border-[#d7cbb3] text-[#1f3b2f] focus:ring-[#1f3b2f]"
            />
            <span className="text-sm font-semibold text-slate-800">Require verification badge for published places</span>
          </label>
        </div>
      </section>

      {/* Save Button */}
      <div className="flex items-center justify-between rounded-2xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
        <div>
          {saved ? (
            <div className="flex items-center gap-2 text-sm text-green-700">
              <span>✓</span>
              <span>Settings saved successfully</span>
            </div>
          ) : (
            <p className="text-sm text-slate-600">Make changes above and save them</p>
          )}
        </div>
        <button
          onClick={handleSave}
          className="rounded-lg bg-[#1f3b2f] px-6 py-2 text-sm font-semibold text-white hover:bg-[#2a4a3f] transition"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}
