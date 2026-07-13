// src/components/ComparisonView.jsx
import { useState } from "react";
import { Search, Eye, EyeOff } from "lucide-react";

// Generate mock comparison data
const generateMockData = () => {
  const baseAttributes = [
    "instrumentation:name",
    "resource.host.arch",
    "resource.host.id",
    "resource.host.name",
    "resource.os.description",
    "resource.os.name",
    "resource.os.type",
    "resource.os.version",
    "resource.process.executable.path",
    "resource.process.runtime.name",
    "resource.process.runtime.version",
    "resource.service.name",
    "resource.telemetry.sdk.language",
    "resource.telemetry.sdk.name",
    "resource.telemetry.sdk.version",
    "span.kind",
    "span.name",
    "span.status",
    "resource.process.pid",
  ];

  return baseAttributes.map((name) => {
    // Randomize values between 0-100
    const baseline = Math.floor(Math.random() * 60) + 20;
    const selection = Math.floor(Math.random() * 60) + 20;
    const diff = Math.round(((selection - baseline) / Math.max(baseline, 1)) * 100);
    return { name, baseline, selection, diff };
  });
};

export default function ComparisonView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [hideBaselineOnly, setHideBaselineOnly] = useState(false);
  const [data, setData] = useState(generateMockData);

  const filteredData = data
    .filter((attr) =>
      attr.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((attr) => {
      if (hideBaselineOnly) {
        // Hide attributes where both baseline and selection are 100%
        return !(attr.baseline === 100 && attr.selection === 100);
      }
      return true;
    });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-[var(--color-text)]">Comparison</span>
          <span className="text-xs text-[var(--color-muted)]">
            Attributes are ordered by the difference between the baseline and selection values for each value.
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--color-muted)]">Baseline</span>
            <div className="w-4 h-4 bg-[var(--color-accent)] rounded" />
            <span className="text-xs text-[var(--color-muted)]">Selection</span>
            <div className="w-4 h-4 bg-[var(--color-warn)] rounded" />
          </div>
          <button
            onClick={() => setHideBaselineOnly(!hideBaselineOnly)}
            className="flex items-center gap-1 px-2 py-1 text-xs rounded border border-[var(--color-border)] hover:bg-[var(--color-panel-alt)] transition"
          >
            {hideBaselineOnly ? <EyeOff size={12} /> : <Eye size={12} />}
            {hideBaselineOnly ? "Show baseline-only" : "Hide baseline-only"}
          </button>
        </div>
      </div>

      {/* Search and selected */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-faint)]" />
          <input
            type="text"
            placeholder="Search attributes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-faint)] text-sm focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-1 text-xs">
          <span className="text-[var(--color-muted)]">Selected:</span>
          <span className="text-[var(--color-accent)]">All</span>
        </div>
      </div>

      {/* Attribute list with bars */}
      <div className="space-y-1 max-h-[500px] overflow-y-auto pr-2">
        {filteredData.length === 0 ? (
          <div className="text-center py-8 text-[var(--color-muted)]">No attributes match your search.</div>
        ) : (
          filteredData.map((attr) => {
            const maxVal = Math.max(attr.baseline, attr.selection);
            const barWidth = maxVal > 0 ? maxVal : 1;
            return (
              <div
                key={attr.name}
                className="group flex items-center gap-3 py-1 hover:bg-[var(--color-panel-alt)] rounded px-2 transition"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[var(--color-text)] truncate">{attr.name}</span>
                    <button className="text-[10px] text-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition">
                      Inspect
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex-1 h-2 bg-[var(--color-border)] rounded-full overflow-hidden relative">
                      {/* Baseline bar */}
                      <div
                        className="absolute left-0 top-0 h-full bg-[var(--color-accent)] rounded-full transition-all"
                        style={{ width: `${(attr.baseline / 100) * 100}%` }}
                      />
                      {/* Selection bar */}
                      <div
                        className="absolute left-0 top-0 h-full bg-[var(--color-warn)] rounded-full transition-all opacity-60"
                        style={{ width: `${(attr.selection / 100) * 100}%` }}
                      />
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono flex-shrink-0">
                      <span className="text-[var(--color-text)]">{attr.baseline}%</span>
                      <span className="text-[var(--color-muted)]">vs</span>
                      <span className="text-[var(--color-text)]">{attr.selection}%</span>
                      {Math.abs(attr.diff) > 0 && (
                        <span
                          className={`text-[10px] ${
                            attr.diff > 0 ? "text-[var(--color-ok)]" : "text-[var(--color-crit)]"
                          }`}
                        >
                          {attr.diff > 0 ? "+" : ""}
                          {attr.diff}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-[var(--color-muted)]">Highest difference</span>
                  <button className="px-2 py-0.5 text-xs rounded border border-[var(--color-border)] hover:bg-[var(--color-panel-alt)] transition">
                    Include
                  </button>
                  <button className="px-2 py-0.5 text-xs rounded border border-[var(--color-border)] hover:bg-[var(--color-panel-alt)] transition">
                    Exclude
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}