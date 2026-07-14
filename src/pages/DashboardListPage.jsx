import { useState, useEffect } from "react";
import { LayoutDashboard, Eye, Code2, Copy, Check } from "lucide-react";
import { toast } from "react-hot-toast";
import { defaultDashboards, CURRENT_VERSION } from "../data/defaultDashboards";

const STORAGE_KEY = "dashboards";
const VERSION_KEY = "dashboards_version";

// ---- Load with version check ----
const loadDashboards = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  const storedVersion = parseInt(localStorage.getItem(VERSION_KEY) || "0");

  if (stored && storedVersion === CURRENT_VERSION) {
    try {
      return JSON.parse(stored);
    } catch {}
  }

  let existing = [];
  if (stored) {
    try {
      existing = JSON.parse(stored);
    } catch {}
  }

  // Merge: add default dashboards that don't already exist (by name)
  const merged = [...existing];
  const existingNames = new Set(existing.map(d => d.name));
  defaultDashboards.forEach(def => {
    if (!existingNames.has(def.name)) {
      merged.push(def);
    }
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  localStorage.setItem(VERSION_KEY, String(CURRENT_VERSION));
  return merged;
};

export default function DashboardListPage({ go }) {
  const [dashboards, setDashboards] = useState([]);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setDashboards(loadDashboards());
  }, []);

  const viewDashboard = (id) => {
    localStorage.setItem("selectedDashboard", String(id));
    go("DashboardView");
  };

  // ---- Export as default code ----
  const handleExportCode = () => {
    setShowCodeModal(true);
  };

  const copyCode = () => {
    const code = generateCode();
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Code copied to clipboard");
  };

  const generateCode = () => {
    const currentDashboards = dashboards.map(d => ({
      ...d,
      createdAt: new Date().toISOString()
    }));
    const arrStr = JSON.stringify(currentDashboards, null, 2)
      .replace(/"([^"]+)":/g, '$1:')
      .replace(/"([^"]+)"/g, '"$1"');
    return `export const defaultDashboards = ${arrStr};`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Dashboards</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCode}
            className="flex items-center gap-1 px-3 py-1.5 border border-[var(--color-border)] text-[var(--color-muted)] rounded-lg hover:bg-[var(--color-panel-alt)] transition text-sm"
            title="Export as default code for sharing"
          >
            <Code2 size={14} />
            Export as Code
          </button>
        </div>
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

      {/* Code Export Modal */}
      {showCodeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-xl p-6 w-full max-w-3xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-[var(--color-text)]">Export as Default Code</h3>
              <button onClick={() => setShowCodeModal(false)} className="text-[var(--color-muted)] hover:text-[var(--color-text)]">
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-[var(--color-muted)] mb-3">
              Copy the code below and replace the entire content of <code className="bg-[var(--color-panel-alt)] px-1 py-0.5 rounded">src/data/defaultDashboards.js</code>.
              Then bump <code className="bg-[var(--color-panel-alt)] px-1 py-0.5 rounded">CURRENT_VERSION</code> and commit.
            </p>
            <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg p-4 font-mono text-xs overflow-x-auto">
              <pre className="whitespace-pre-wrap text-[var(--color-text)]">{generateCode()}</pre>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowCodeModal(false)}
                className="px-4 py-2 text-[var(--color-muted)] hover:text-[var(--color-text)]"
              >
                Cancel
              </button>
              <button
                onClick={copyCode}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90 transition"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? "Copied!" : "Copy Code"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}