import { useState } from "react";
import { Search, ChevronDown, ExternalLink, PlusCircle } from "lucide-react";
import { plugins } from "../data/pluginsData";

const getInitials = (name) => name.charAt(0).toUpperCase();
const getColor = (name) => {
  const colors = {
    "Alert list": "#FF6B6B",
    "Alertmanager": "#FF9F43",
    "Annotations": "#FECA57",
    "Azure Monitor": "#0078D4",
    "Bar chart": "#54A0FF",
    "Bar gauge": "#5F27CD",
    "Candlestick": "#1DD1A1",
    "Canvas": "#10AC84",
    "CloudWatch": "#FF9900",
    "Dashboard": "#6C5CE7",
    "Elasticsearch": "#005571",
    "Flame Graph": "#F58025",
    "Gauge": "#00D2D3",
    "Geomap": "#3B3B98",
    "Getting Started": "#2E86DE",
    "Google Cloud Monitoring": "#4285F4",
  };
  return colors[name] || "#6B7280";
};

export default function PluginsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showStateDropdown, setShowStateDropdown] = useState(false);

  const filteredPlugins = plugins
    .filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === "all" || p.type === typeFilter;
      const matchesState = stateFilter === "all" ||
        (stateFilter === "installed" && p.installed) ||
        (stateFilter === "updates" && p.installed); // for demo
      return matchesSearch && matchesType && matchesState;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Plugins</h1>
          <p className="text-sm text-[var(--color-muted)]">
            Extend the Grafana experience with panel plugins and apps. To find more data sources go to Connections.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-faint)]" />
            <input
              type="text"
              placeholder="Search Grafana plugins"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-48 pl-9 pr-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent text-xs"
            />
          </div>
          <span className="text-xs text-[var(--color-muted)] bg-[var(--color-panel-alt)] px-2 py-1 rounded border border-[var(--color-border)]">
            ctrl+k
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setShowTypeDropdown(!showTypeDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] text-[var(--color-text)] text-sm hover:bg-[var(--color-panel-alt)] transition"
          >
            Type
            <ChevronDown size={14} className="text-[var(--color-muted)]" />
          </button>
          {showTypeDropdown && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowTypeDropdown(false)} />
              <div className="absolute left-0 top-full mt-1 bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg shadow-lg z-20 w-40 py-1">
                {["all", "Data source", "Panel", "App"].map((type) => (
                  <button
                    key={type}
                    onClick={() => { setTypeFilter(type); setShowTypeDropdown(false); }}
                    className={`w-full text-left px-3 py-1.5 text-sm hover:bg-[var(--color-panel-alt)] transition ${
                      typeFilter === type ? "text-[var(--color-accent)]" : "text-[var(--color-text)]"
                    }`}
                  >
                    {type === "all" ? "All" : type}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowStateDropdown(!showStateDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] text-[var(--color-text)] text-sm hover:bg-[var(--color-panel-alt)] transition"
          >
            State
            <ChevronDown size={14} className="text-[var(--color-muted)]" />
          </button>
          {showStateDropdown && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowStateDropdown(false)} />
              <div className="absolute left-0 top-full mt-1 bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg shadow-lg z-20 w-40 py-1">
                {["all", "installed", "updates"].map((state) => (
                  <button
                    key={state}
                    onClick={() => { setStateFilter(state); setShowStateDropdown(false); }}
                    className={`w-full text-left px-3 py-1.5 text-sm hover:bg-[var(--color-panel-alt)] transition ${
                      stateFilter === state ? "text-[var(--color-accent)]" : "text-[var(--color-text)]"
                    }`}
                  >
                    {state.charAt(0).toUpperCase() + state.slice(1)}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        <span className="text-xs text-[var(--color-muted)]">No updates available</span>
      </div>

      {/* Plugin grid */}
      {filteredPlugins.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-[var(--color-border)] rounded-lg bg-[var(--color-panel)]">
          <div className="w-16 h-16 rounded-full bg-[var(--color-panel-alt)] border border-[var(--color-border)] flex items-center justify-center mb-4">
            <Search size={24} className="text-[var(--color-faint)]" />
          </div>
          <h3 className="text-[var(--color-text)] font-medium text-lg">No plugins found</h3>
          <p className="text-[var(--color-muted)] text-sm max-w-sm mt-1">
            Try adjusting your search or filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPlugins.map((plugin) => (
            <div
              key={plugin.id}
              className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4 hover:border-[var(--color-accent)] hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: getColor(plugin.name) }}
                  >
                    {getInitials(plugin.name)}
                  </div>
                  <div>
                    <div className="text-[var(--color-text)] font-medium text-sm">{plugin.name}</div>
                    <div className="text-[var(--color-muted)] text-xs">{plugin.type}</div>
                    <div className="text-[var(--color-faint)] text-[10px]">By {plugin.author}</div>
                  </div>
                </div>
                {plugin.status && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    plugin.status === "Core" ? "bg-[var(--color-accent)]/20 text-[var(--color-accent)]" :
                    plugin.status === "Signed" ? "bg-[var(--color-ok)]/20 text-[var(--color-ok)]" :
                    "bg-[var(--color-warn)]/20 text-[var(--color-warn)]"
                  }`}>
                    {plugin.status}
                  </span>
                )}
              </div>
              <div className="mt-3 flex justify-end">
                <button className="text-xs text-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition">
                  {plugin.installed ? "Configure" : "Install"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-[var(--color-muted)] pt-4 border-t border-[var(--color-border)]">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 hover:text-[var(--color-text)] transition">
            <PlusCircle size={16} />
            Request a new data source
          </button>
          <button className="flex items-center gap-2 hover:text-[var(--color-text)] transition">
            <ExternalLink size={16} />
            View roadmap
          </button>
        </div>
        <span className="text-xs">Showing {filteredPlugins.length} plugins</span>
      </div>
    </div>
  );
}