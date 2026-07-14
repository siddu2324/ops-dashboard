import { useState, useEffect } from "react";
import {
  Search,
  ChevronDown,
  CheckCircle,
  PlusCircle,
  ExternalLink,
  Plus,
  Settings,
  X,
  Save,
} from "lucide-react";
import { toast } from "react-hot-toast";

// Initial plugin data
const defaultPlugins = [
  { id: 1, name: "Alertmanager", category: "Data Sources", installed: true },
  { id: 2, name: "Azure Monitor", category: "Data Sources", installed: true },
  { id: 3, name: "CloudWatch", category: "Data Sources", installed: true },
  { id: 4, name: "Elasticsearch", category: "Data Sources", installed: true },
  { id: 5, name: "Google Cloud Monitoring", category: "Data Sources", installed: true },
  { id: 6, name: "Grafana Pyroscope", category: "Data Sources", installed: true },
  { id: 7, name: "Graphite", category: "Data Sources", installed: true },
  { id: 8, name: "InfluxDB", category: "Data Sources", installed: true },
  { id: 9, name: "Jaeger", category: "Data Sources", installed: true },
  { id: 10, name: "Loki", category: "Data Sources", installed: true },
  { id: 11, name: "Microsoft SQL Server", category: "Data Sources", installed: true },
  { id: 12, name: "MySQL", category: "Data Sources", installed: true },
  { id: 13, name: "PostgreSQL", category: "Data Sources", installed: false },
  { id: 14, name: "Prometheus", category: "Data Sources", installed: false },
  { id: 15, name: "Tempo", category: "Data Sources", installed: false },
  { id: 16, name: "Zabbix", category: "Data Sources", installed: false },
  { id: 17, name: "Datadog", category: "Data Sources", installed: false },
  { id: 18, name: "New Relic", category: "Data Sources", installed: false },
  { id: 19, name: "Splunk", category: "Data Sources", installed: false },
  { id: 20, name: "OpenSearch", category: "Data Sources", installed: false },
];

const STORAGE_KEY = "connections";

const loadPlugins = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {}
  }
  return defaultPlugins;
};

const savePlugins = (plugins) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plugins));
};

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

// ---------- Config Modal ----------
const ConfigModal = ({ isOpen, onClose, plugin, onSave }) => {
  const [config, setConfig] = useState({ url: "", apiKey: "", username: "", password: "" });

  useEffect(() => {
    if (plugin && plugin.config) {
      setConfig(plugin.config);
    } else {
      setConfig({ url: "", apiKey: "", username: "", password: "" });
    }
  }, [plugin, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!config.url.trim()) {
      toast.error("URL is required");
      return;
    }
    onSave(config);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-[var(--color-text)]">
            Configure {plugin?.name}
          </h3>
          <button onClick={onClose} className="text-[var(--color-muted)] hover:text-[var(--color-text)]">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[var(--color-muted)] text-sm mb-1">URL *</label>
            <input
              type="url"
              value={config.url}
              onChange={(e) => setConfig({ ...config, url: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
              placeholder="https://your-server.com"
            />
          </div>
          <div>
            <label className="block text-[var(--color-muted)] text-sm mb-1">API Key</label>
            <input
              type="password"
              value={config.apiKey}
              onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
              placeholder="API key (optional)"
            />
          </div>
          <div>
            <label className="block text-[var(--color-muted)] text-sm mb-1">Username</label>
            <input
              type="text"
              value={config.username}
              onChange={(e) => setConfig({ ...config, username: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
              placeholder="Username"
            />
          </div>
          <div>
            <label className="block text-[var(--color-muted)] text-sm mb-1">Password</label>
            <input
              type="password"
              value={config.password}
              onChange={(e) => setConfig({ ...config, password: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
              placeholder="Password"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
            <button type="button" onClick={onClose} className="px-4 py-2 text-[var(--color-muted)] hover:text-[var(--color-text)]">
              Cancel
            </button>
            <button type="submit" className="flex items-center gap-1 px-4 py-2 bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90">
              <Save size={14} />
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ---------- Main Component ----------
export default function ConnectionsPage() {
  const [plugins, setPlugins] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [stateFilter, setStateFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [selectedPlugin, setSelectedPlugin] = useState(null);

  // Load data
  useEffect(() => {
    const loaded = loadPlugins();
    setPlugins(loaded);
  }, []);

  // Save
  useEffect(() => {
    if (plugins.length > 0) {
      savePlugins(plugins);
    }
  }, [plugins]);

  // Filter and sort
  useEffect(() => {
    let result = plugins;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(term));
    }
    if (stateFilter !== "all") {
      result = result.filter((p) =>
        stateFilter === "installed" ? p.installed : !p.installed
      );
    }
    if (sortBy === "name") {
      result = result.sort((a, b) => a.name.localeCompare(b.name));
    }
    setFiltered(result);
  }, [searchTerm, stateFilter, sortBy, plugins]);

  const handleInstall = (id) => {
    setPlugins(
      plugins.map((p) =>
        p.id === id ? { ...p, installed: true, config: p.config || {} } : p
      )
    );
    toast.success("Plugin installed");
  };

  const handleUninstall = (id) => {
    if (window.confirm("Are you sure you want to uninstall this plugin?")) {
      setPlugins(
        plugins.map((p) =>
          p.id === id ? { ...p, installed: false, config: undefined } : p
        )
      );
      toast.success("Plugin uninstalled");
    }
  };

  const handleConfigure = (plugin) => {
    setSelectedPlugin(plugin);
    setConfigModalOpen(true);
  };

  const handleSaveConfig = (config) => {
    setPlugins(
      plugins.map((p) =>
        p.id === selectedPlugin.id ? { ...p, config } : p
      )
    );
    toast.success(`Configuration saved for ${selectedPlugin.name}`);
    setConfigModalOpen(false);
    setSelectedPlugin(null);
  };

  const closeConfigModal = () => {
    setConfigModalOpen(false);
    setSelectedPlugin(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      {/* Header */}
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
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-faint)] text-sm focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
          />
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

      {/* Grid */}
      {filtered.length === 0 ? (
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
          {filtered.map((plugin) => (
            <div
              key={plugin.id}
              className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4 hover:border-[var(--color-accent)] hover:shadow-lg transition-all group"
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
              <div className="mt-3 flex justify-end gap-2">
                {plugin.installed ? (
                  <>
                    <button
                      onClick={() => handleConfigure(plugin)}
                      className="text-xs text-[var(--color-accent)] hover:underline opacity-0 group-hover:opacity-100 transition"
                    >
                      <Settings size={14} className="inline mr-1" />
                      Configure
                    </button>
                    <button
                      onClick={() => handleUninstall(plugin.id)}
                      className="text-xs text-[var(--color-crit)] hover:underline opacity-0 group-hover:opacity-100 transition"
                    >
                      Uninstall
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleInstall(plugin.id)}
                    className="text-xs text-[var(--color-accent)] hover:underline opacity-0 group-hover:opacity-100 transition"
                  >
                    <Plus size={14} className="inline mr-1" />
                    Install
                  </button>
                )}
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

      {/* Config Modal */}
      <ConfigModal
        isOpen={configModalOpen}
        onClose={closeConfigModal}
        plugin={selectedPlugin}
        onSave={handleSaveConfig}
      />
    </div>
  );
}