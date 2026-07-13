import { useState } from "react";
import { Search, ChevronDown, ChevronRight, Copy, Check } from "lucide-react";
import { toast } from "react-hot-toast";
import { settingsData } from "../data/settingsData";

export default function SettingsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedSections, setExpandedSections] = useState({});
  const [copiedKey, setCopiedKey] = useState(null);

  // Get all sections and their keys
  const sections = Object.keys(settingsData);

  // Filter sections based on search
  const filterSection = (section, data) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    // Check section name
    if (section.toLowerCase().includes(term)) return true;
    // Check keys and values
    for (const [key, value] of Object.entries(data)) {
      if (key.toLowerCase().includes(term) || String(value).toLowerCase().includes(term)) {
        return true;
      }
    }
    return false;
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const copyToClipboard = (key, value) => {
    navigator.clipboard.writeText(`${key}=${value}`);
    setCopiedKey(key);
    toast.success(`Copied: ${key}`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const renderValue = (value) => {
    if (value === "" || value === null || value === undefined) {
      return <span className="text-[var(--color-faint)] italic">(empty)</span>;
    }
    // Check if it looks like a sensitive value
    const isSensitive = value.includes("********") || 
                       value.includes("secret") ||
                       value.includes("password") ||
                       value.includes("token") ||
                       value.includes("key");
    return (
      <span className={isSensitive ? "text-[var(--color-warn)] font-mono" : "text-[var(--color-text)] font-mono"}>
        {value}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Settings</h1>
          <p className="text-sm text-[var(--color-muted)]">
            View the settings defined in your Grafana config. These system settings are defined in grafana.ini or custom.ini.
          </p>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-faint)]" />
          <input
            type="text"
            placeholder="Search settings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64 pl-9 pr-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent text-sm"
          />
        </div>
      </div>

      <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg overflow-hidden">
        <div className="text-xs text-[var(--color-muted)] px-4 py-2 border-b border-[var(--color-border)] bg-[var(--color-panel-alt)]">
          ⚠️ To change these settings you currently need to restart Grafana.
        </div>

        <div className="divide-y divide-[var(--color-border)]">
          {sections.map((section) => {
            const data = settingsData[section];
            if (!filterSection(section, data)) return null;
            const isExpanded = expandedSections[section] || !!searchTerm;
            const entries = Object.entries(data);

            return (
              <div key={section}>
                {/* Section header */}
                <button
                  onClick={() => toggleSection(section)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-[var(--color-panel-alt)] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[var(--color-text)] font-mono text-sm font-medium">
                      {section}
                    </span>
                    <span className="text-[var(--color-faint)] text-xs bg-[var(--color-panel-alt)] px-2 py-0.5 rounded">
                      {entries.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {isExpanded ? (
                      <ChevronDown size={16} className="text-[var(--color-muted)]" />
                    ) : (
                      <ChevronRight size={16} className="text-[var(--color-muted)]" />
                    )}
                  </div>
                </button>

                {/* Section content */}
                {isExpanded && (
                  <div className="px-4 pb-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
                      {entries.map(([key, value]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between py-1 hover:bg-[var(--color-panel-alt)] px-2 rounded transition-colors group"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-[var(--color-muted)] text-xs font-mono truncate">
                              {key}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-xs font-mono max-w-[200px] truncate">
                              {renderValue(value)}
                            </span>
                            <button
                              onClick={() => copyToClipboard(key, value)}
                              className="opacity-0 group-hover:opacity-100 transition p-1 rounded hover:bg-[var(--color-border)]"
                              title="Copy key=value"
                            >
                              {copiedKey === key ? (
                                <Check size={12} className="text-[var(--color-ok)]" />
                              ) : (
                                <Copy size={12} className="text-[var(--color-muted)]" />
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {sections.filter((s) => filterSection(s, settingsData[s])).length === 0 && (
          <div className="flex items-center justify-center py-16 text-center">
            <div>
              <Search size={32} className="text-[var(--color-faint)] mx-auto mb-3" />
              <p className="text-[var(--color-muted)]">No settings found matching "{searchTerm}"</p>
            </div>
          </div>
        )}
      </div>

      <div className="text-xs text-[var(--color-muted)] text-center">
        Showing {sections.filter((s) => filterSection(s, settingsData[s])).length} of {sections.length} sections
      </div>
    </div>
  );
}