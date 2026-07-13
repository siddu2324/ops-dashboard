import { useState } from "react";
import { Search, Filter, Plus, ChevronDown, ChevronRight, Grid, List, X, Bell } from "lucide-react";
import { toast } from "react-hot-toast";
import { alertRules } from "../data/alertRulesData";

export default function AlertRulesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grouped"); // grouped, list
  const [ruleSource, setRuleSource] = useState("grafana"); // grafana, datasource
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    ruleName: "",
    labels: [],
    state: "all",
    folder: "",
    evaluationGroup: "",
    dataSource: "",
    contactPoint: "",
    type: "all",
    health: "all",
  });

  const filteredRules = alertRules.filter((rule) => {
    const matchesSearch = rule.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState = filters.state === "all" || rule.state.toLowerCase() === filters.state.toLowerCase();
    const matchesSource = ruleSource === "all" || 
      (ruleSource === "grafana" && rule.source === "Grafana managed") ||
      (ruleSource === "datasource" && rule.source === "Data source managed");
    return matchesSearch && matchesState && matchesSource;
  });

  const handleCreateRule = () => {
    toast.success("New alert rule creation form would open here");
  };

  const handleCreateRecordingRule = () => {
    toast.success("New recording rule creation form would open here");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Alert rules</h1>
          <p className="text-sm text-[var(--color-muted)]">Recently deleted</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--color-muted)] bg-[var(--color-panel-alt)] px-2 py-1 rounded border border-[var(--color-border)]">
            ctrl+k
          </span>
        </div>
      </div>

      {/* Search and actions */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-faint)]" />
          <input
            type="text"
            placeholder="Search by name or enter filter query.."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent text-sm"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] text-[var(--color-muted)] hover:text-[var(--color-text)] transition"
        >
          <Filter size={16} />
          Filter
        </button>
        <button
          onClick={() => toast.info("Saved searches would open here")}
          className="text-sm text-[var(--color-accent)] hover:underline"
        >
          Saved searches
        </button>
      </div>

      {/* View toggle and tabs */}
      <div className="flex flex-wrap items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("grouped")}
            className={`p-1.5 rounded border transition ${
              viewMode === "grouped"
                ? "border-[var(--color-accent)] text-[var(--color-accent)]"
                : "border-transparent text-[var(--color-muted)] hover:text-[var(--color-text)]"
            }`}
          >
            <Grid size={16} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-1.5 rounded border transition ${
              viewMode === "list"
                ? "border-[var(--color-accent)] text-[var(--color-accent)]"
                : "border-transparent text-[var(--color-muted)] hover:text-[var(--color-text)]"
            }`}
          >
            <List size={16} />
          </button>
          <div className="flex items-center gap-1 ml-2 border-l border-[var(--color-border)] pl-2">
            <button
              onClick={() => setRuleSource("grafana")}
              className={`px-3 py-1 text-sm rounded-full transition ${
                ruleSource === "grafana"
                  ? "bg-[var(--color-accent)] text-[#06222A]"
                  : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
              }`}
            >
              Grafana-managed
            </button>
            <button
              onClick={() => setRuleSource("datasource")}
              className={`px-3 py-1 text-sm rounded-full transition ${
                ruleSource === "datasource"
                  ? "bg-[var(--color-accent)] text-[#06222A]"
                  : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
              }`}
            >
              Data source managed
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCreateRule}
            className="flex items-center gap-1 px-3 py-1.5 bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90 transition text-sm"
          >
            <Plus size={14} />
            New alert rule
          </button>
          <button
            onClick={handleCreateRecordingRule}
            className="flex items-center gap-1 px-3 py-1.5 border border-[var(--color-border)] text-[var(--color-text)] font-semibold rounded-lg hover:bg-[var(--color-panel-alt)] transition text-sm"
          >
            <Plus size={14} />
            New recording rule
          </button>
        </div>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--color-text)]">Filters</span>
            <button onClick={() => setShowFilters(false)} className="text-[var(--color-muted)] hover:text-[var(--color-text)]">
              <X size={16} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-[var(--color-muted)]">Rule name</label>
              <input
                type="text"
                placeholder="Filter by name..."
                className="w-full px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] text-sm focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
              />
            </div>
            <div>
              <label className="text-xs text-[var(--color-muted)]">Labels</label>
              <select className="w-full px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] text-sm">
                <option>Select labels</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-[var(--color-muted)]">State</label>
              <select className="w-full px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] text-sm">
                <option>All</option>
                <option>Firing</option>
                <option>Normal</option>
                <option>Pending</option>
                <option>Recovering</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-[var(--color-muted)]">Folder / Namespace</label>
              <select className="w-full px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] text-sm">
                <option>Select namespace</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-[var(--color-muted)]">Evaluation group</label>
              <select className="w-full px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] text-sm">
                <option>Search group</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-[var(--color-muted)]">Rule source</label>
              <select className="w-full px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] text-sm">
                <option>All</option>
                <option>Grafana managed</option>
                <option>Data source managed</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-[var(--color-muted)]">Data source</label>
              <select className="w-full px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] text-sm">
                <option>Select data sources</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-[var(--color-muted)]">Contact point</label>
              <select className="w-full px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] text-sm">
                <option>Select contact point</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-[var(--color-muted)]">Notification policy</label>
              <select className="w-full px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] text-sm">
                <option>Select policy</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-[var(--color-muted)]">Type</label>
              <select className="w-full px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] text-sm">
                <option>All</option>
                <option>Alert rule</option>
                <option>Recording rule</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-[var(--color-muted)]">Health</label>
              <select className="w-full px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] text-sm">
                <option>All</option>
                <option>OK</option>
                <option>No data</option>
                <option>Error</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button className="px-3 py-1 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)]">Clear filters</button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {filteredRules.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-[var(--color-border)] rounded-lg bg-[var(--color-panel)]">
          <div className="w-16 h-16 rounded-full bg-[var(--color-panel-alt)] border border-[var(--color-border)] flex items-center justify-center mb-4">
            <Bell size={24} className="text-[var(--color-faint)]" />
          </div>
          <h3 className="text-[var(--color-text)] font-medium text-lg">You haven't created any rules yet</h3>
          <p className="text-[var(--color-muted)] text-sm max-w-sm mt-1">
            You can also define rules through file provisioning or Terraform. <button className="text-[var(--color-accent)] hover:underline">Learn more</button>
          </p>
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleCreateRule}
              className="px-4 py-2 bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90 transition"
            >
              <Plus size={14} className="inline mr-1" />
              New alert rule
            </button>
            <button
              onClick={handleCreateRecordingRule}
              className="px-4 py-2 border border-[var(--color-border)] text-[var(--color-text)] font-semibold rounded-lg hover:bg-[var(--color-panel-alt)] transition"
            >
              <Plus size={14} className="inline mr-1" />
              New recording rule
            </button>
          </div>
        </div>
      )}

      {/* Rule list */}
      {filteredRules.length > 0 && (
        <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--color-panel-alt)] border-b border-[var(--color-border)]">
              <tr>
                <th className="px-3 py-2 text-[var(--color-muted)] text-xs font-medium">Rule name</th>
                <th className="px-3 py-2 text-[var(--color-muted)] text-xs font-medium">State</th>
                <th className="px-3 py-2 text-[var(--color-muted)] text-xs font-medium">Folder</th>
                <th className="px-3 py-2 text-[var(--color-muted)] text-xs font-medium">Source</th>
              </tr>
            </thead>
            <tbody>
              {filteredRules.map((rule) => (
                <tr key={rule.id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-panel-alt)] transition-colors cursor-pointer">
                  <td className="px-3 py-2 text-[var(--color-text)]">{rule.name}</td>
                  <td className="px-3 py-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      rule.state === "Firing" ? "bg-[var(--color-crit)] text-white" :
                      rule.state === "Normal" ? "bg-[var(--color-ok)] text-[#06222A]" :
                      "bg-[var(--color-warn)] text-[#06222A]"
                    }`}>
                      {rule.state}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-[var(--color-muted)]">{rule.folder}</td>
                  <td className="px-3 py-2 text-[var(--color-muted)]">{rule.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}