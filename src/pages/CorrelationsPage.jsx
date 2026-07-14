import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  X,
  Link,
  Database,
  ArrowRight,
} from "lucide-react";
import { toast } from "react-hot-toast";

// ---------- Default Data ----------
const defaultCorrelations = [
  {
    id: 1,
    name: "Loki → Tempo",
    source: "Loki",
    target: "Tempo",
    label: "traceID",
    description: "Link logs to traces",
  },
  {
    id: 2,
    name: "Prometheus → Loki",
    source: "Prometheus",
    target: "Loki",
    label: "job",
    description: "Link metrics to logs",
  },
];

const STORAGE_KEY = "correlations";

const loadCorrelations = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {}
  }
  return defaultCorrelations;
};

const saveCorrelations = (correlations) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(correlations));
};

const generateId = () => Date.now() + Math.random() * 1000;

// ---------- Modal ----------
const CorrelationModal = ({ isOpen, onClose, onSave, editingCorrelation }) => {
  const [formData, setFormData] = useState({
    name: "",
    source: "",
    target: "",
    label: "",
    description: "",
  });

  // Mock data sources for dropdown
  const dataSources = ["Loki", "Tempo", "Prometheus", "Graphite", "InfluxDB", "MySQL", "PostgreSQL", "Elasticsearch"];

  useEffect(() => {
    if (editingCorrelation) {
      setFormData({
        name: editingCorrelation.name || "",
        source: editingCorrelation.source || "",
        target: editingCorrelation.target || "",
        label: editingCorrelation.label || "",
        description: editingCorrelation.description || "",
      });
    } else {
      setFormData({
        name: "",
        source: "",
        target: "",
        label: "",
        description: "",
      });
    }
  }, [editingCorrelation, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.source || !formData.target) {
      toast.error("Name, source, and target are required");
      return;
    }
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-[var(--color-text)]">
            {editingCorrelation ? "Edit Correlation" : "New Correlation"}
          </h3>
          <button onClick={onClose} className="text-[var(--color-muted)] hover:text-[var(--color-text)]">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[var(--color-muted)] text-sm mb-1">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
              placeholder="e.g. Loki → Tempo"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[var(--color-muted)] text-sm mb-1">Source *</label>
              <select
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
              >
                <option value="">Select source</option>
                {dataSources.map((ds) => (
                  <option key={ds} value={ds}>{ds}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[var(--color-muted)] text-sm mb-1">Target *</label>
              <select
                value={formData.target}
                onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
              >
                <option value="">Select target</option>
                {dataSources.map((ds) => (
                  <option key={ds} value={ds}>{ds}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[var(--color-muted)] text-sm mb-1">Label</label>
            <input
              type="text"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
              placeholder="e.g. traceID"
            />
          </div>
          <div>
            <label className="block text-[var(--color-muted)] text-sm mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
              rows="2"
              placeholder="Optional description"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
            <button type="button" onClick={onClose} className="px-4 py-2 text-[var(--color-muted)] hover:text-[var(--color-text)]">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90">
              {editingCorrelation ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ---------- Main Component ----------
export default function CorrelationsPage() {
  const [correlations, setCorrelations] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCorrelation, setEditingCorrelation] = useState(null);

  useEffect(() => {
    setCorrelations(loadCorrelations());
  }, []);

  useEffect(() => {
    let result = correlations;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter((c) =>
        c.name.toLowerCase().includes(term) ||
        c.source.toLowerCase().includes(term) ||
        c.target.toLowerCase().includes(term) ||
        c.description?.toLowerCase().includes(term)
      );
    }
    setFiltered(result);
  }, [searchTerm, correlations]);

  useEffect(() => {
    if (correlations.length > 0) {
      saveCorrelations(correlations);
    }
  }, [correlations]);

  const handleAdd = (data) => {
    const newCorrelation = { ...data, id: generateId() };
    setCorrelations([...correlations, newCorrelation]);
    toast.success(`Correlation "${newCorrelation.name}" created`);
    setIsModalOpen(false);
  };

  const handleEdit = (updated) => {
    setCorrelations(
      correlations.map((c) => (c.id === updated.id ? { ...updated } : c))
    );
    toast.success(`Correlation "${updated.name}" updated`);
    setIsModalOpen(false);
    setEditingCorrelation(null);
  };

  const handleDelete = (id) => {
    const corr = correlations.find((c) => c.id === id);
    if (!corr) return;
    if (window.confirm(`Delete correlation "${corr.name}"?`)) {
      setCorrelations(correlations.filter((c) => c.id !== id));
      toast.success(`Correlation "${corr.name}" deleted`);
    }
  };

  const openCreate = () => {
    setEditingCorrelation(null);
    setIsModalOpen(true);
  };

  const openEdit = (corr) => {
    setEditingCorrelation(corr);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCorrelation(null);
  };

  const handleSave = (data) => {
    if (editingCorrelation) {
      handleEdit({ ...data, id: editingCorrelation.id });
    } else {
      handleAdd(data);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Correlations</h1>
          <p className="text-sm text-[var(--color-muted)]">
            Define correlations between data sources
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90 transition text-sm"
        >
          <Plus size={16} />
          Add Correlation
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-faint)]" />
        <input
          type="text"
          placeholder="Search correlations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-faint)] text-sm focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
        />
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-[var(--color-border)] rounded-lg bg-[var(--color-panel)]">
          <Link size={32} className="text-[var(--color-faint)] mb-4" />
          <h3 className="text-[var(--color-text)] font-medium text-lg">No correlations defined</h3>
          <p className="text-[var(--color-muted)] text-sm max-w-sm mt-1">
            Create correlations between data sources to enable cross‑data exploration.
          </p>
          <button
            onClick={openCreate}
            className="mt-4 px-4 py-2 bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90 transition"
          >
            <Plus size={14} className="inline mr-1" />
            Add Correlation
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((corr) => (
            <div
              key={corr.id}
              className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4 hover:border-[var(--color-accent)] transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[var(--color-text)] font-medium">{corr.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[var(--color-muted)] mt-1">
                    <Database size={14} />
                    {corr.source}
                    <ArrowRight size={14} />
                    <Database size={14} />
                    {corr.target}
                  </div>
                  {corr.label && (
                    <div className="text-xs text-[var(--color-faint)] mt-1">
                      Label: <span className="font-mono">{corr.label}</span>
                    </div>
                  )}
                  {corr.description && (
                    <div className="text-xs text-[var(--color-muted)] mt-1">
                      {corr.description}
                    </div>
                  )}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => openEdit(corr)}
                    className="p-1 rounded hover:bg-[var(--color-panel-alt)] text-[var(--color-muted)] hover:text-[var(--color-text)] transition"
                    title="Edit"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(corr.id)}
                    className="p-1 rounded hover:bg-[var(--color-panel-alt)] text-[var(--color-muted)] hover:text-[var(--color-crit)] transition"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <CorrelationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
        editingCorrelation={editingCorrelation}
      />
    </div>
  );
}