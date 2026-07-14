import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, LayoutDashboard, Eye } from "lucide-react";
import { toast } from "react-hot-toast";

const STORAGE_KEY = "dashboards";
const defaultDashboards = [
  { id: 1, name: "Main Dashboard", description: "Default dashboard", createdAt: new Date().toISOString() },
];

const loadDashboards = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {}
  }
  return defaultDashboards;
};

const saveDashboards = (dashboards) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dashboards));
};

const generateId = () => Date.now() + Math.random() * 1000;

export default function DashboardListPage({ go }) {
  const [dashboards, setDashboards] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });

  useEffect(() => {
    setDashboards(loadDashboards());
  }, []);

  useEffect(() => {
    if (dashboards.length > 0) {
      saveDashboards(dashboards);
    }
  }, [dashboards]);

  const handleAdd = (data) => {
    const newDash = { ...data, id: generateId(), createdAt: new Date().toISOString() };
    setDashboards([...dashboards, newDash]);
    toast.success(`Dashboard "${newDash.name}" created`);
    setShowModal(false);
    setFormData({ name: "", description: "" });
  };

  const handleEdit = (data) => {
    setDashboards(
      dashboards.map((d) =>
        d.id === editing.id ? { ...d, name: data.name, description: data.description } : d
      )
    );
    toast.success(`Dashboard "${data.name}" updated`);
    setShowModal(false);
    setEditing(null);
    setFormData({ name: "", description: "" });
  };

  const handleDelete = (id) => {
    const dash = dashboards.find((d) => d.id === id);
    if (!dash) return;
    if (window.confirm(`Delete dashboard "${dash.name}"?`)) {
      setDashboards(dashboards.filter((d) => d.id !== id));
      toast.success(`Dashboard "${dash.name}" deleted`);
    }
  };

  const viewDashboard = (id) => {
    localStorage.setItem("selectedDashboard", id);
    go("DashboardView");
  };

  const openCreate = () => {
    setEditing(null);
    setFormData({ name: "", description: "" });
    setShowModal(true);
  };

  const openEdit = (dash) => {
    setEditing(dash);
    setFormData({ name: dash.name, description: dash.description || "" });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
    setFormData({ name: "", description: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Dashboard name is required");
      return;
    }
    if (editing) {
      handleEdit(formData);
    } else {
      handleAdd(formData);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Dashboards</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90 transition"
        >
          <Plus size={16} />
          Add Dashboard
        </button>
      </div>

      {dashboards.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-[var(--color-border)] rounded-lg bg-[var(--color-panel)]">
          <LayoutDashboard size={32} className="text-[var(--color-faint)] mb-4" />
          <h3 className="text-[var(--color-text)] font-medium text-lg">No dashboards</h3>
          <p className="text-[var(--color-muted)] text-sm max-w-sm mt-1">
            Create a dashboard to get started.
          </p>
          <button
            onClick={openCreate}
            className="mt-4 px-4 py-2 bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90 transition"
          >
            <Plus size={14} className="inline mr-1" />
            Add Dashboard
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dashboards.map((dash) => (
            <div
              key={dash.id}
              className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4 hover:border-[var(--color-accent)] transition"
            >
              <div className="flex items-start justify-between">
                <div>
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
                <div className="flex gap-1">
                  <button
                    onClick={() => viewDashboard(dash.id)}
                    className="p-1 rounded hover:bg-[var(--color-panel-alt)] text-[var(--color-accent)] hover:text-[var(--color-accent)]/80 transition"
                    title="View"
                  >
                    <Eye size={14} />
                  </button>
                  <button
                    onClick={() => openEdit(dash)}
                    className="p-1 rounded hover:bg-[var(--color-panel-alt)] text-[var(--color-muted)] hover:text-[var(--color-text)] transition"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(dash.id)}
                    className="p-1 rounded hover:bg-[var(--color-panel-alt)] text-[var(--color-muted)] hover:text-[var(--color-crit)] transition"
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
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-[var(--color-text)] mb-4">
              {editing ? "Edit Dashboard" : "New Dashboard"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[var(--color-muted)] text-sm mb-1">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                  placeholder="e.g. Production Dashboard"
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
                <button type="button" onClick={closeModal} className="px-4 py-2 text-[var(--color-muted)] hover:text-[var(--color-text)]">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90">
                  {editing ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}