import { useState } from "react";
import { Search, ChevronDown, CheckCircle, PlusCircle, ExternalLink, Plus } from "lucide-react";
import { plugins } from "../data/plugins";

const getPluginColor = (name) => {
  const colors = {
    Alertmanager: "#F97316",
    "Azure Monitor": "#0078D4",
    CloudWatch: "#FF9900",
    Elasticsearch: "#005571",
    "Google Cloud Monitoring": "#4285F4",
    "Grafana Pyroscope": "#F58025",
    Graphite: "#1B2E35",
    InfluxDB: "#22ADF6",
    Jaeger: "#60B0F4",
    Loki: "#F58C40",
    "Microsoft SQL Server": "#CC2927",
    MySQL: "#00758F",
    PostgreSQL: "#336791",
    Prometheus: "#E6522C",
    Tempo: "#F58025",
    Zabbix: "#E94F37",
    Datadog: "#632CA6",
    "New Relic": "#008C99",
    Splunk: "#F17B2A",
    OpenSearch: "#005EB8",
  };
  return colors[name] || "#6B7280";
};

export default function ConnectionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [stateFilter, setStateFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const filteredPlugins = plugins
    .filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesState =
        stateFilter === "all" ||
        (stateFilter === "installed" && p.installed) ||
        (stateFilter === "updates" && p.installed);
      return matchesSearch && matchesState;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <div className="flex flex-col max-w-7xl mx-auto space-y-4">
      {/* Header with "Add new connection" button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Connections</h1>
          <p className="text-sm text-[var(--color-muted)]">Browse and create new connections</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90 transition">
          <Plus size={16} />
          Add new connection
        </button>
      </div>

      {/* Search and filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-faint)]" />
          <input
            type="text"
            placeholder="Search Grafana plugins"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent text-sm"
          />
        </div>

        {/* State filter */}
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
                    onClick={() => {
                      setStateFilter(state);
                      setShowStateDropdown(false);
                    }}
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

        {/* Sort */}
        <div className="relative">
          <button
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] text-[var(--color-text)] text-sm hover:bg-[var(--color-panel-alt)] transition"
          >
            Sort
            <ChevronDown size={14} className="text-[var(--color-muted)]" />
          </button>
          {showSortDropdown && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowSortDropdown(false)} />
              <div className="absolute left-0 top-full mt-1 bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg shadow-lg z-20 w-48 py-1">
                <button
                  onClick={() => {
                    setSortBy("name");
                    setShowSortDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-sm hover:bg-[var(--color-panel-alt)] transition ${
                    sortBy === "name" ? "text-[var(--color-accent)]" : "text-[var(--color-text)]"
                  }`}
                >
                  By name (A-Z)
                </button>
                <button
                  onClick={() => {
                    setSortBy("recently-added");
                    setShowSortDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-sm hover:bg-[var(--color-panel-alt)] transition ${
                    sortBy === "recently-added" ? "text-[var(--color-accent)]" : "text-[var(--color-text)]"
                  }`}
                >
                  Recently added
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Plugin grid or empty state */}
      {filteredPlugins.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-[var(--color-border)] rounded-lg bg-[var(--color-panel)]">
          <div className="w-16 h-16 rounded-full bg-[var(--color-panel-alt)] border border-[var(--color-border)] flex items-center justify-center mb-4">
            <Search size={24} className="text-[var(--color-faint)]" />
          </div>
          <h3 className="text-[var(--color-text)] font-medium text-lg">No connections found</h3>
          <p className="text-[var(--color-muted)] text-sm max-w-sm mt-1">
            Try adjusting your search or filters to find what you're looking for.
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
                    style={{ backgroundColor: getPluginColor(plugin.name) }}
                  >
                    {plugin.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-[var(--color-text)] font-medium text-sm">{plugin.name}</div>
                    <div className="text-[var(--color-muted)] text-xs">{plugin.category}</div>
                  </div>
                </div>
                {plugin.installed && (
                  <span className="flex items-center gap-1 text-[10px] text-[var(--color-ok)] bg-[var(--color-ok)]/10 px-2 py-0.5 rounded-full">
                    <CheckCircle size={12} />
                    Installed
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

      {/* Footer links */}
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
        <span className="text-xs">No updates available</span>
      </div>
    </div>
  );
}