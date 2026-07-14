import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Plus,
  Grid,
  List,
  Bell,
  X,
  ChevronDown,
  Edit,
  Trash2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import Card from "../components/common/Card";
import StatusDot from "../components/common/StatusDot";

// Default initial rules (fallback if localStorage is empty)
const defaultRules = [
  {
    id: 1,
    name: "CPU Usage High",
    state: "Firing",
    severity: "critical",
    folder: "Infrastructure",
    evaluationGroup: "CPU Alerts",
    source: "Grafana managed",
    dataSource: "Prometheus",
    contactPoint: "Slack",
    health: "OK",
    threshold: "80%",
    lastTriggered: "2 min ago",
  },
  {
    id: 2,
    name: "Memory Usage Warning",
    state: "Normal",
    severity: "warning",
    folder: "Infrastructure",
    evaluationGroup: "Memory Alerts",
    source: "Grafana managed",
    dataSource: "Prometheus",
    contactPoint: "Email",
    health: "OK",
    threshold: "90%",
    lastTriggered: "15 min ago",
  },
  {
    id: 3,
    name: "Service Down",
    state: "Firing",
    severity: "critical",
    folder: "Applications",
    evaluationGroup: "Service Health",
    source: "Data source managed",
    dataSource: "Loki",
    contactPoint: "PagerDuty",
    health: "Error",
    threshold: "N/A",
    lastTriggered: "5 min ago",
  },
];

const STORAGE_KEY = "alertRules";

// Helper to load rules from localStorage
const loadRules = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {}
  }
  return defaultRules;
};

// Helper to save rules to localStorage
const saveRules = (rules) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rules));
};

// Helper to generate a new ID
const generateId = () => Date.now() + Math.random() * 1000;

// Modal component
const RuleModal = ({ isOpen, onClose, onSave, editingRule }) => {
  const [formData, setFormData] = useState({
    name: "",
    state: "Normal",
    severity: "warning",
    folder: "Infrastructure",
    evaluationGroup: "",
    source: "Grafana managed",
    dataSource: "",
    contactPoint: "",
    health: "OK",
    threshold: "",
    lastTriggered: "",
  });

  useEffect(() => {
    if (editingRule) {
      setFormData(editingRule);
    } else {
      setFormData({
        name: "",
        state: "Normal",
        severity: "warning",
        folder: "Infrastructure",
        evaluationGroup: "",
        source: "Grafana managed",
        dataSource: "",
        contactPoint: "",
        health: "OK",
        threshold: "",
        lastTriggered: "",
      });
    }
  }, [editingRule, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Rule name is required");
      return;
    }
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-[var(--color-text)]">
            {editingRule ? "Edit Alert Rule" : "New Alert Rule"}
          </h3>
          <button onClick={onClose} className="text-[var(--color-muted)] hover:text-[var(--color-text)]">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[var(--color-muted)] text-sm mb-1">Rule Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
              placeholder="e.g. CPU Usage High"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[var(--color-muted)] text-sm mb-1">State</label>
              <select
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
              >
                <option value="Firing">Firing</option>
                <option value="Normal">Normal</option>
                <option value="Pending">Pending</option>
                <option value="Recovering">Recovering</option>
              </select>
            </div>
            <div>
              <label className="block text-[var(--color-muted)] text-sm mb-1">Severity</label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
              >
                <option value="critical">Critical</option>
                <option value="warning">Warning</option>
                <option value="info">Info</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[var(--color-muted)] text-sm mb-1">Folder / Namespace</label>
              <input
                type="text"
                value={formData.folder}
                onChange={(e) => setFormData({ ...formData, folder: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                placeholder="e.g. Infrastructure"
              />
            </div>
            <div>
              <label className="block text-[var(--color-muted)] text-sm mb-1">Evaluation Group</label>
              <input
                type="text"
                value={formData.evaluationGroup}
                onChange={(e) => setFormData({ ...formData, evaluationGroup: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                placeholder="e.g. CPU Alerts"
              />
            </div>
          </div>
          <div>
            <label className="block text-[var(--color-muted)] text-sm mb-1">Data Source</label>
            <input
              type="text"
              value={formData.dataSource}
              onChange={(e) => setFormData({ ...formData, dataSource: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
              placeholder="e.g. Prometheus"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[var(--color-muted)] text-sm mb-1">Contact Point</label>
              <input
                type="text"
                value={formData.contactPoint}
                onChange={(e) => setFormData({ ...formData, contactPoint: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                placeholder="e.g. Slack"
              />
            </div>
            <div>
              <label className="block text-[var(--color-muted)] text-sm mb-1">Health</label>
              <select
                value={formData.health}
                onChange={(e) => setFormData({ ...formData, health: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
              >
                <option value="OK">OK</option>
                <option value="No data">No data</option>
                <option value="Error">Error</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[var(--color-muted)] text-sm mb-1">Threshold</label>
              <input
                type="text"
                value={formData.threshold}
                onChange={(e) => setFormData({ ...formData, threshold: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                placeholder="e.g. 80%"
              />
            </div>
            <div>
              <label className="block text-[var(--color-muted)] text-sm mb-1">Source</label>
              <select
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
              >
                <option value="Grafana managed">Grafana managed</option>
                <option value="Data source managed">Data source managed</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
            <button type="button" onClick={onClose} className="px-4 py-2 text-[var(--color-muted)] hover:text-[var(--color-text)]">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90">
              {editingRule ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ---------- Main Component ----------
export default function AlertRulesPage() {
  const [rules, setRules] = useState([]);
  const [filteredRules, setFilteredRules] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("list");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState(null);

  // Load rules on mount
  useEffect(() => {
    const loaded = loadRules();
    setRules(loaded);
  }, []);

  // Filter rules whenever search or rules change
  useEffect(() => {
    let result = rules;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter((r) =>
        r.name.toLowerCase().includes(term) ||
        r.folder.toLowerCase().includes(term)
      );
    }
    setFilteredRules(result);
  }, [searchTerm, rules]);

  // Save to localStorage whenever rules change
  useEffect(() => {
    if (rules.length > 0) {
      saveRules(rules);
    }
  }, [rules]);

  const handleAddRule = (newRule) => {
    const rule = {
      ...newRule,
      id: generateId(),
      lastTriggered: "Just now",
    };
    setRules([...rules, rule]);
    toast.success(`Rule "${rule.name}" created`);
    setIsModalOpen(false);
  };

  const handleEditRule = (updatedRule) => {
    setRules(
      rules.map((r) =>
        r.id === updatedRule.id ? { ...updatedRule } : r
      )
    );
    toast.success(`Rule "${updatedRule.name}" updated`);
    setIsModalOpen(false);
    setEditingRule(null);
  };

  const handleDeleteRule = (id) => {
    const rule = rules.find((r) => r.id === id);
    if (!rule) return;
    if (window.confirm(`Are you sure you want to delete rule "${rule.name}"?`)) {
      setRules(rules.filter((r) => r.id !== id));
      toast.success(`Rule "${rule.name}" deleted`);
    }
  };

  const openCreateModal = () => {
    setEditingRule(null);
    setIsModalOpen(true);
  };

  const openEditModal = (rule) => {
    setEditingRule(rule);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRule(null);
  };

  const handleSave = (data) => {
    if (editingRule) {
      handleEditRule({ ...data, id: editingRule.id });
    } else {
      handleAddRule(data);
    }
  };

  const stateColors = {
    Firing: "bg-[var(--color-crit)] text-white",
    Normal: "bg-[var(--color-ok)] text-[#06222A]",
    Pending: "bg-[var(--color-warn)] text-[#06222A]",
    Recovering: "bg-[var(--color-accent)] text-[#06222A]",
  };

  const severityColors = {
    critical: "bg-[var(--color-crit)] text-white",
    warning: "bg-[var(--color-warn)] text-[#06222A]",
    info: "bg-[var(--color-accent)] text-[#06222A]",
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Alert rules</h1>
        <p className="text-sm text-[var(--color-muted)]">Rules that determine whether an alert will fire</p>
      </div>

      {/* Sub-header with "New alert rule" button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-[var(--color-text)]">Alert rules</span>
          <span className="text-xs text-[var(--color-muted)] hover:text-[var(--color-text)] cursor-pointer">
            Recently deleted
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={openCreateModal}
            className="flex items-center gap-1 px-3 py-1.5 bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90 transition text-sm"
          >
            <Plus size={14} />
            New alert rule
          </button>
          <span className="text-xs text-[var(--color-muted)] bg-[var(--color-panel-alt)] px-2 py-1 rounded border border-[var(--color-border)]">
            ctrl+k
          </span>
        </div>
      </div>

      {/* Search and filter bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-faint)]" />
          <input
            type="text"
            placeholder="Search by name or enter filter query..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-faint)] text-sm focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] text-[var(--color-text)] hover:bg-[var(--color-panel-alt)] transition text-sm"
        >
          <Filter size={14} />
          Filters
          <ChevronDown size={12} className={showFilters ? "rotate-180" : ""} />
        </button>
        <button className="px-3 py-1.5 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] transition">
          Clear filters
        </button>
        <button className="text-sm text-[var(--color-accent)] hover:underline">
          Saved searches
        </button>
        <div className="flex items-center gap-1 ml-auto">
          <button
            onClick={() => setViewMode("list")}
            className={`p-1.5 rounded transition ${
              viewMode === "list" ? "bg-[var(--color-panel-alt)] text-[var(--color-accent)]" : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
            }`}
          >
            <List size={16} />
          </button>
          <button
            onClick={() => setViewMode("grouped")}
            className={`p-1.5 rounded transition ${
              viewMode === "grouped" ? "bg-[var(--color-panel-alt)] text-[var(--color-accent)]" : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
            }`}
          >
            <Grid size={16} />
          </button>
        </div>
      </div>

      {/* Filters panel (collapsible) */}
      {showFilters && (
        <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--color-text)]">Filter</span>
            <button onClick={() => setShowFilters(false)} className="text-[var(--color-muted)] hover:text-[var(--color-text)]">
              <X size={16} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-[var(--color-muted)] block mb-1">Rule name</label>
              <input
                type="text"
                placeholder="Filter by name..."
                className="w-full px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] text-sm focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
              />
            </div>
            <div>
              <label className="text-xs text-[var(--color-muted)] block mb-1">State</label>
              <select className="w-full px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] text-sm">
                <option>All</option>
                <option>Firing</option>
                <option>Normal</option>
                <option>Pending</option>
                <option>Recovering</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-[var(--color-muted)] block mb-1">Folder / Namespace</label>
              <select className="w-full px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] text-sm">
                <option>Select namespace</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Empty state or rule list */}
      {filteredRules.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-[var(--color-border)] rounded-lg bg-[var(--color-panel)]">
          <div className="w-16 h-16 rounded-full bg-[var(--color-panel-alt)] border border-[var(--color-border)] flex items-center justify-center mb-4">
            <Bell size={24} className="text-[var(--color-faint)]" />
          </div>
          <h3 className="text-[var(--color-text)] font-medium text-lg">You haven't created any rules yet</h3>
          <p className="text-[var(--color-muted)] text-sm max-w-sm mt-1">
            You can also define rules through file provisioning or Terraform.{" "}
            <button className="text-[var(--color-accent)] hover:underline">Learn more</button>
          </p>
          <div className="flex gap-3 mt-4">
            <button
              onClick={openCreateModal}
              className="flex items-center gap-1 px-4 py-2 bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90 transition"
            >
              <Plus size={16} />
              New alert rule
            </button>
            <button
              onClick={() => toast.info("Recording rule creation form would open here")}
              className="flex items-center gap-1 px-4 py-2 border border-[var(--color-border)] text-[var(--color-text)] font-semibold rounded-lg hover:bg-[var(--color-panel-alt)] transition"
            >
              <Plus size={16} />
              New recording rule
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--color-panel-alt)] border-b border-[var(--color-border)]">
                <tr>
                  <th className="px-3 py-2 text-[var(--color-muted)] text-xs font-medium">Rule name</th>
                  <th className="px-3 py-2 text-[var(--color-muted)] text-xs font-medium">State</th>
                  <th className="px-3 py-2 text-[var(--color-muted)] text-xs font-medium">Severity</th>
                  <th className="px-3 py-2 text-[var(--color-muted)] text-xs font-medium">Folder</th>
                  <th className="px-3 py-2 text-[var(--color-muted)] text-xs font-medium">Source</th>
                  <th className="px-3 py-2 text-[var(--color-muted)] text-xs font-medium">Health</th>
                  <th className="px-3 py-2 text-[var(--color-muted)] text-xs font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRules.map((rule) => (
                  <tr key={rule.id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-panel-alt)] transition-colors">
                    <td className="px-3 py-2 text-[var(--color-text)] font-medium">{rule.name}</td>
                    <td className="px-3 py-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${stateColors[rule.state] || "bg-[var(--color-border)] text-[var(--color-muted)]"}`}>
                        {rule.state}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${severityColors[rule.severity] || "bg-[var(--color-border)] text-[var(--color-muted)]"}`}>
                        {rule.severity}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-[var(--color-muted)]">{rule.folder}</td>
                    <td className="px-3 py-2 text-[var(--color-muted)]">{rule.source}</td>
                    <td className="px-3 py-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        rule.health === "OK" ? "bg-[var(--color-ok)] text-[#06222A]" :
                        rule.health === "Error" ? "bg-[var(--color-crit)] text-white" :
                        "bg-[var(--color-warn)] text-[#06222A]"
                      }`}>
                        {rule.health}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(rule)}
                          className="p-1 rounded hover:bg-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-text)] transition"
                          title="Edit"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteRule(rule.id)}
                          className="p-1 rounded hover:bg-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-crit)] transition"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      <RuleModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
        editingRule={editingRule}
      />
    </div>
  );
}