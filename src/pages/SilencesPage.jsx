import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Clock,
  Edit,
  Trash2,
  X,
  ChevronDown,
  Calendar,
} from "lucide-react";
import { toast } from "react-hot-toast";
import Card from "../components/common/Card";

// Default silences
const defaultSilences = [
  {
    id: 1,
    name: "Maintenance window",
    matchers: [{ label: "alertname", value: "CPU" }],
    starts: new Date(Date.now() - 3600000 * 2).toISOString(),
    ends: new Date(Date.now() + 3600000 * 4).toISOString(),
    status: "active",
    comment: "Scheduled maintenance",
  },
  {
    id: 2,
    name: "Database downtime",
    matchers: [{ label: "service", value: "database" }],
    starts: new Date(Date.now() - 86400000).toISOString(),
    ends: new Date(Date.now() + 86400000 * 2).toISOString(),
    status: "active",
    comment: "Planned upgrade",
  },
];

const STORAGE_KEY = "silences";

// Helpers
const loadSilences = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {}
  }
  return defaultSilences;
};

const saveSilences = (silences) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(silences));
};

const generateId = () => Date.now() + Math.random() * 1000;

const formatDate = (iso) => {
  if (!iso) return "N/A";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
};

const getStatusBadge = (status) => {
  const colors = {
    active: "bg-[var(--color-ok)] text-[#06222A]",
    expired: "bg-[var(--color-muted)] text-white",
    pending: "bg-[var(--color-warn)] text-[#06222A]",
  };
  return colors[status] || colors.pending;
};

// Modal Component
const SilenceModal = ({ isOpen, onClose, onSave, editingSilence }) => {
  const [formData, setFormData] = useState({
    name: "",
    matchers: [{ label: "", value: "" }],
    starts: new Date().toISOString().slice(0, 16),
    ends: new Date(Date.now() + 3600000 * 24).toISOString().slice(0, 16),
    comment: "",
  });

  useEffect(() => {
    if (editingSilence) {
      setFormData({
        ...editingSilence,
        starts: editingSilence.starts ? editingSilence.starts.slice(0, 16) : "",
        ends: editingSilence.ends ? editingSilence.ends.slice(0, 16) : "",
        matchers: editingSilence.matchers && editingSilence.matchers.length > 0
          ? editingSilence.matchers
          : [{ label: "", value: "" }],
      });
    } else {
      setFormData({
        name: "",
        matchers: [{ label: "", value: "" }],
        starts: new Date().toISOString().slice(0, 16),
        ends: new Date(Date.now() + 3600000 * 24).toISOString().slice(0, 16),
        comment: "",
      });
    }
  }, [editingSilence, isOpen]);

  const handleMatcherChange = (index, field, value) => {
    const updated = [...formData.matchers];
    updated[index][field] = value;
    setFormData({ ...formData, matchers: updated });
  };

  const addMatcher = () => {
    setFormData({
      ...formData,
      matchers: [...formData.matchers, { label: "", value: "" }],
    });
  };

  const removeMatcher = (index) => {
    if (formData.matchers.length <= 1) return;
    const updated = formData.matchers.filter((_, i) => i !== index);
    setFormData({ ...formData, matchers: updated });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Silence name is required");
      return;
    }
    const validMatchers = formData.matchers.filter((m) => m.label.trim() && m.value.trim());
    if (validMatchers.length === 0) {
      toast.error("At least one matcher (label=value) is required");
      return;
    }
    if (!formData.starts || !formData.ends) {
      toast.error("Start and end times are required");
      return;
    }
    const now = new Date();
    const startDate = new Date(formData.starts);
    const endDate = new Date(formData.ends);
    if (startDate >= endDate) {
      toast.error("End time must be after start time");
      return;
    }
    const status = startDate <= now && endDate >= now ? "active" : "pending";
    onSave({
      ...formData,
      matchers: validMatchers,
      status,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-[var(--color-text)]">
            {editingSilence ? "Edit Silence" : "New Silence"}
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
              placeholder="e.g. Maintenance window"
            />
          </div>

          <div>
            <label className="block text-[var(--color-muted)] text-sm mb-1">Matchers *</label>
            {formData.matchers.map((matcher, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Label"
                  value={matcher.label}
                  onChange={(e) => handleMatcherChange(idx, "label", e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] text-sm focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                />
                <span className="text-[var(--color-muted)]">=</span>
                <input
                  type="text"
                  placeholder="Value"
                  value={matcher.value}
                  onChange={(e) => handleMatcherChange(idx, "value", e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] text-sm focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                />
                {formData.matchers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMatcher(idx)}
                    className="text-[var(--color-crit)] hover:text-[var(--color-crit)]/80"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addMatcher}
              className="text-sm text-[var(--color-accent)] hover:underline"
            >
              + Add matcher
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[var(--color-muted)] text-sm mb-1">Start Time *</label>
              <input
                type="datetime-local"
                value={formData.starts}
                onChange={(e) => setFormData({ ...formData, starts: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-[var(--color-muted)] text-sm mb-1">End Time *</label>
              <input
                type="datetime-local"
                value={formData.ends}
                onChange={(e) => setFormData({ ...formData, ends: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-[var(--color-muted)] text-sm mb-1">Comment</label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
              rows="2"
              placeholder="Optional comment..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
            <button type="button" onClick={onClose} className="px-4 py-2 text-[var(--color-muted)] hover:text-[var(--color-text)]">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90">
              {editingSilence ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ---------- Main Component ----------
export default function SilencesPage() {
  const [silences, setSilences] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSilence, setEditingSilence] = useState(null);

  useEffect(() => {
    const loaded = loadSilences();
    setSilences(loaded);
  }, []);

  useEffect(() => {
    let result = silences;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter((s) =>
        s.name.toLowerCase().includes(term) ||
        s.comment?.toLowerCase().includes(term) ||
        s.matchers.some((m) => m.label.toLowerCase().includes(term) || m.value.toLowerCase().includes(term))
      );
    }
    setFiltered(result);
  }, [searchTerm, silences]);

  useEffect(() => {
    if (silences.length > 0) {
      saveSilences(silences);
    }
  }, [silences]);

  const handleAddSilence = (newSilence) => {
    const silence = {
      ...newSilence,
      id: generateId(),
    };
    setSilences([...silences, silence]);
    toast.success(`Silence "${silence.name}" created`);
    setIsModalOpen(false);
  };

  const handleEditSilence = (updatedSilence) => {
    setSilences(
      silences.map((s) =>
        s.id === updatedSilence.id ? { ...updatedSilence } : s
      )
    );
    toast.success(`Silence "${updatedSilence.name}" updated`);
    setIsModalOpen(false);
    setEditingSilence(null);
  };

  const handleDeleteSilence = (id) => {
    const silence = silences.find((s) => s.id === id);
    if (!silence) return;
    if (window.confirm(`Are you sure you want to delete silence "${silence.name}"?`)) {
      setSilences(silences.filter((s) => s.id !== id));
      toast.success(`Silence "${silence.name}" deleted`);
    }
  };

  const openCreateModal = () => {
    setEditingSilence(null);
    setIsModalOpen(true);
  };

  const openEditModal = (silence) => {
    setEditingSilence(silence);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSilence(null);
  };

  const handleSave = (data) => {
    if (editingSilence) {
      handleEditSilence({ ...data, id: editingSilence.id });
    } else {
      handleAddSilence(data);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Silences</h1>
        <p className="text-sm text-[var(--color-muted)]">Manage alert silences</p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-faint)]" />
          <input
            type="text"
            placeholder="Search silences..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-faint)] text-sm focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
          />
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-1 px-3 py-1.5 bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90 transition text-sm"
        >
          <Plus size={14} />
          Create silence
        </button>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-[var(--color-border)] rounded-lg bg-[var(--color-panel)]">
          <Clock size={32} className="text-[var(--color-faint)] mb-4" />
          <h3 className="text-[var(--color-text)] font-medium text-lg">No silences configured</h3>
          <p className="text-[var(--color-muted)] text-sm max-w-sm mt-1">
            Create a silence to temporarily mute notifications.
          </p>
          <button
            onClick={openCreateModal}
            className="mt-4 px-4 py-2 bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90 transition"
          >
            <Plus size={14} className="inline mr-1" />
            Create silence
          </button>
        </div>
      ) : (
        <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--color-panel-alt)] border-b border-[var(--color-border)]">
                <tr>
                  <th className="px-3 py-2 text-[var(--color-muted)] text-xs font-medium">Name</th>
                  <th className="px-3 py-2 text-[var(--color-muted)] text-xs font-medium">Matchers</th>
                  <th className="px-3 py-2 text-[var(--color-muted)] text-xs font-medium">Starts</th>
                  <th className="px-3 py-2 text-[var(--color-muted)] text-xs font-medium">Ends</th>
                  <th className="px-3 py-2 text-[var(--color-muted)] text-xs font-medium">Status</th>
                  <th className="px-3 py-2 text-[var(--color-muted)] text-xs font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((silence) => (
                  <tr key={silence.id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-panel-alt)] transition-colors">
                    <td className="px-3 py-2 text-[var(--color-text)] font-medium">{silence.name}</td>
                    <td className="px-3 py-2 text-[var(--color-muted)] font-mono text-xs">
                      {silence.matchers.map((m) => `${m.label}=${m.value}`).join(", ")}
                    </td>
                    <td className="px-3 py-2 text-[var(--color-faint)] text-xs">{formatDate(silence.starts)}</td>
                    <td className="px-3 py-2 text-[var(--color-faint)] text-xs">{formatDate(silence.ends)}</td>
                    <td className="px-3 py-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(silence.status)}`}>
                        {silence.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(silence)}
                          className="p-1 rounded hover:bg-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-text)] transition"
                          title="Edit"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteSilence(silence.id)}
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

      {/* Modal */}
      <SilenceModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
        editingSilence={editingSilence}
      />
    </div>
  );
}