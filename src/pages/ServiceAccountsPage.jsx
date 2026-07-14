import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  X,
  Key,
  Copy,
  Eye,
  EyeOff,
  Calendar,
  User,
  Clock,
} from "lucide-react";
import { toast } from "react-hot-toast";

// Default data
const defaultServiceAccounts = [];

const STORAGE_KEY = "serviceAccounts";

// Helpers
const loadAccounts = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {}
  }
  return defaultServiceAccounts;
};

const saveAccounts = (accounts) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
};

const generateId = () => Date.now() + Math.random() * 1000;

const generateToken = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "sa_";
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};

// ---------- Modal ----------
const ServiceAccountModal = ({ isOpen, onClose, onSave, editingAccount }) => {
  const [formData, setFormData] = useState({
    name: "",
    role: "Viewer",
    expiration: "",
    description: "",
  });
  const [showToken, setShowToken] = useState(false);
  const [generatedToken, setGeneratedToken] = useState("");

  useEffect(() => {
    if (editingAccount) {
      setFormData({
        name: editingAccount.name || "",
        role: editingAccount.role || "Viewer",
        expiration: editingAccount.expiration || "",
        description: editingAccount.description || "",
      });
      setGeneratedToken(editingAccount.token || "");
    } else {
      setFormData({
        name: "",
        role: "Viewer",
        expiration: "",
        description: "",
      });
      setGeneratedToken("");
    }
  }, [editingAccount, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    // If creating new, generate a token
    let token = generatedToken;
    if (!editingAccount) {
      token = generateToken();
    }
    onSave({ ...formData, token });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-[var(--color-text)]">
            {editingAccount ? "Edit Service Account" : "New Service Account"}
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
              placeholder="e.g. CI/CD Automation"
            />
          </div>
          <div>
            <label className="block text-[var(--color-muted)] text-sm mb-1">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
            >
              <option value="Viewer">Viewer</option>
              <option value="Editor">Editor</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-[var(--color-muted)] text-sm mb-1">Expiration (optional)</label>
            <input
              type="datetime-local"
              value={formData.expiration}
              onChange={(e) => setFormData({ ...formData, expiration: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-[var(--color-muted)] text-sm mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
              rows="2"
              placeholder="Optional description..."
            />
          </div>

          {!editingAccount && generatedToken && (
            <div>
              <label className="block text-[var(--color-muted)] text-sm mb-1">Generated Token</label>
              <div className="flex items-center gap-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg p-2">
                <span className="text-xs font-mono text-[var(--color-text)] truncate flex-1">
                  {showToken ? generatedToken : "•".repeat(32)}
                </span>
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="p-1 text-[var(--color-muted)] hover:text-[var(--color-text)]"
                >
                  {showToken ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(generatedToken);
                    toast.success("Token copied");
                  }}
                  className="p-1 text-[var(--color-muted)] hover:text-[var(--color-text)]"
                >
                  <Copy size={14} />
                </button>
              </div>
              <p className="text-xs text-[var(--color-warn)] mt-1">Copy this token now – it won't be shown again.</p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
            <button type="button" onClick={onClose} className="px-4 py-2 text-[var(--color-muted)] hover:text-[var(--color-text)]">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90">
              {editingAccount ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ---------- Main Component ----------
export default function ServiceAccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);

  useEffect(() => {
    const loaded = loadAccounts();
    setAccounts(loaded);
  }, []);

  useEffect(() => {
    let result = accounts;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter((a) =>
        a.name.toLowerCase().includes(term) ||
        a.description?.toLowerCase().includes(term)
      );
    }
    setFiltered(result);
  }, [searchTerm, accounts]);

  useEffect(() => {
    if (accounts.length > 0) {
      saveAccounts(accounts);
    }
  }, [accounts]);

  const handleAdd = (data) => {
    const newAccount = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
      token: data.token || generateToken(),
    };
    setAccounts([...accounts, newAccount]);
    toast.success(`Service account "${newAccount.name}" created`);
    setIsModalOpen(false);
  };

  const handleEdit = (updated) => {
    setAccounts(
      accounts.map((a) => (a.id === updated.id ? { ...updated } : a))
    );
    toast.success(`Service account "${updated.name}" updated`);
    setIsModalOpen(false);
    setEditingAccount(null);
  };

  const handleDelete = (id) => {
    const account = accounts.find((a) => a.id === id);
    if (!account) return;
    if (window.confirm(`Delete service account "${account.name}"? This will revoke its token.`)) {
      setAccounts(accounts.filter((a) => a.id !== id));
      toast.success(`Service account "${account.name}" deleted`);
    }
  };

  const openCreate = () => {
    setEditingAccount(null);
    setIsModalOpen(true);
  };

  const openEdit = (account) => {
    setEditingAccount(account);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAccount(null);
  };

  const handleSave = (data) => {
    if (editingAccount) {
      handleEdit({ ...data, id: editingAccount.id });
    } else {
      handleAdd(data);
    }
  };

  const formatDate = (iso) => {
    if (!iso) return "Never";
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso;
    }
  };

  const getStatus = (account) => {
    if (!account.expiration) return "active";
    const now = new Date();
    const exp = new Date(account.expiration);
    return exp > now ? "active" : "expired";
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Service accounts</h1>
        <p className="text-sm text-[var(--color-muted)]">
          Service accounts and their tokens can be used to authenticate against the Grafana API.
          <button className="text-[var(--color-accent)] hover:underline ml-1">
            Find out more in our documentation.
          </button>
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-faint)]" />
          <input
            type="text"
            placeholder="Search service account by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-faint)] text-sm focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={openCreate}
            className="flex items-center gap-1 px-3 py-1.5 bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90 transition text-sm"
          >
            <Plus size={14} />
            Add service account
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <button className="px-3 py-1 text-sm rounded-full bg-[var(--color-accent)] text-[#06222A] border border-[var(--color-accent)]">
          All
        </button>
        <button className="px-3 py-1 text-sm rounded-full bg-transparent text-[var(--color-muted)] border border-[var(--color-border)] hover:border-[var(--color-text)]">
          With expired tokens
        </button>
        <button className="px-3 py-1 text-sm rounded-full bg-transparent text-[var(--color-muted)] border border-[var(--color-border)] hover:border-[var(--color-text)]">
          Disabled
        </button>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-[var(--color-border)] rounded-lg bg-[var(--color-panel)]">
          <div className="w-16 h-16 rounded-full bg-[var(--color-panel-alt)] border border-[var(--color-border)] flex items-center justify-center mb-4">
            <Key size={24} className="text-[var(--color-faint)]" />
          </div>
          <h3 className="text-[var(--color-text)] font-medium text-lg">You haven't created any service accounts yet</h3>
          <p className="text-[var(--color-muted)] text-sm max-w-sm mt-1">
            Remember, you can provide specific permissions for API access to other applications
          </p>
          <button
            onClick={openCreate}
            className="mt-4 px-4 py-2 bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90 transition"
          >
            <Plus size={14} className="inline mr-1" />
            Add service account
          </button>
        </div>
      ) : (
        <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--color-panel-alt)] border-b border-[var(--color-border)]">
                <tr>
                  <th className="px-3 py-2 text-[var(--color-muted)] text-xs font-medium">Name</th>
                  <th className="px-3 py-2 text-[var(--color-muted)] text-xs font-medium">Role</th>
                  <th className="px-3 py-2 text-[var(--color-muted)] text-xs font-medium">Status</th>
                  <th className="px-3 py-2 text-[var(--color-muted)] text-xs font-medium">Created</th>
                  <th className="px-3 py-2 text-[var(--color-muted)] text-xs font-medium">Expires</th>
                  <th className="px-3 py-2 text-[var(--color-muted)] text-xs font-medium">Token</th>
                  <th className="px-3 py-2 text-[var(--color-muted)] text-xs font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((account) => {
                  const status = getStatus(account);
                  return (
                    <tr key={account.id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-panel-alt)] transition-colors">
                      <td className="px-3 py-2 text-[var(--color-text)] font-medium">{account.name}</td>
                      <td className="px-3 py-2 text-[var(--color-muted)]">{account.role || "Viewer"}</td>
                      <td className="px-3 py-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          status === "active"
                            ? "bg-[var(--color-ok)] text-[#06222A]"
                            : "bg-[var(--color-crit)] text-white"
                        }`}>
                          {status}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-[var(--color-faint)] text-xs">{formatDate(account.createdAt)}</td>
                      <td className="px-3 py-2 text-[var(--color-faint)] text-xs">{formatDate(account.expiration)}</td>
                      <td className="px-3 py-2">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(account.token);
                            toast.success("Token copied");
                          }}
                          className="text-xs font-mono text-[var(--color-text)] hover:text-[var(--color-accent)] flex items-center gap-1"
                        >
                          <Key size={12} />
                          {account.token.slice(0, 12)}...
                        </button>
                      </td>
                      <td className="px-3 py-2 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(account)}
                            className="p-1 rounded hover:bg-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-text)] transition"
                            title="Edit"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(account.id)}
                            className="p-1 rounded hover:bg-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-crit)] transition"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      <ServiceAccountModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
        editingAccount={editingAccount}
      />
    </div>
  );
}