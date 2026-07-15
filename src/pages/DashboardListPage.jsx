// src/pages/DashboardListPage.jsx
import { useState, useEffect } from "react";
import { LayoutDashboard, Eye } from "lucide-react"; // ✅ removed Code2, Copy, Check
import { toast } from "react-hot-toast";
import { defaultDashboards, CURRENT_VERSION } from "../data/defaultDashboards";

const STORAGE_KEY = "dashboards";
const VERSION_KEY = "dashboards_version";

// ---- Load with version check and removal ----
const loadDashboards = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  const storedVersion = parseInt(localStorage.getItem(VERSION_KEY) || "0");

  let existing = [];
  if (stored) {
    try {
      existing = JSON.parse(stored);
    } catch {}
  }

  // Get current default names and IDs
  const defaultNames = new Set(defaultDashboards.map(d => d.name));
  const maxDefaultId = Math.max(...defaultDashboards.map(d => d.id));

  // Filter existing: keep custom dashboards (id > maxDefaultId) OR default dashboards that still exist
  const filteredExisting = existing.filter(d => {
    if (d.id <= maxDefaultId) {
      return defaultNames.has(d.name);
    }
    return true; // keep custom
  });

  // Merge: add any missing default dashboards (by name)
  const existingNames = new Set(filteredExisting.map(d => d.name));
  const merged = [...filteredExisting];
  defaultDashboards.forEach(def => {
    if (!existingNames.has(def.name)) {
      merged.push(def);
    }
  });

  // Save merged and version
  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  localStorage.setItem(VERSION_KEY, String(CURRENT_VERSION));
  return merged;
};

export default function DashboardListPage({ go }) {
  const [dashboards, setDashboards] = useState([]);
  // ❌ removed showCodeModal, copied state

  useEffect(() => {
    setDashboards(loadDashboards());
  }, []);

  const viewDashboard = (id) => {
    localStorage.setItem("selectedDashboard", String(id));
    go("DashboardView");
  };

  // ❌ removed handleExportCode, copyCode, generateCode functions

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {/* ✅ Header without the Export button */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Dashboards</h1>
      </div>

      {dashboards.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-[var(--color-border)] rounded-lg bg-[var(--color-panel)]">
          <LayoutDashboard size={32} className="text-[var(--color-faint)] mb-4" />
          <h3 className="text-[var(--color-text)] font-medium text-lg">No dashboards</h3>
          <p className="text-[var(--color-muted)] text-sm max-w-sm mt-1">
            Dashboards are defined in code. Check with your administrator.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dashboards.map((dash) => (
            <div
              key={dash.id}
              className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4 hover:border-[var(--color-accent)] transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <LayoutDashboard size={16} className="text-[var(--color-accent)]" />
                    <span className="text-[var(--color-text)] font-medium">{dash.name}</span>
                  </div>
                  {dash.description && (
                    <div className="text-xs text-[var(--color-muted)] mt-1">{dash.description}</div>
                  )}
                  <div className="text-xs text-[var(--color-faint)] mt-1">
                    Created {new Date(dash.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <button
                  onClick={() => viewDashboard(dash.id)}
                  className="p-1.5 rounded hover:bg-[var(--color-panel-alt)] text-[var(--color-accent)] hover:text-[var(--color-accent)]/80 transition"
                  title="View"
                >
                  <Eye size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ❌ Removed the Code Export Modal */}
    </div>
  );
}