import { useState } from "react";
import { Search, Edit2, Plus, X } from "lucide-react";
import { toast } from "react-hot-toast";
import Card from "../components/common/Card";
import { useUsers } from "../hooks/useUsers";
import { isAdmin } from "../services/authService";

export default function UsersPage() {
  const { users, addUser, updateUser, deleteUser } = useUsers();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // all, org
  const [editingUser, setEditingUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const admin = isAdmin();

  // Filter users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    // For "Organization users" we filter by org (in this demo all are Main Org.)
    const matchesOrg = activeTab === "all" || true;
    return matchesSearch && matchesOrg;
  });

  // Modal form state
  const [formData, setFormData] = useState({ username: "", email: "", role: "Viewer" });

  const resetForm = () => {
    setFormData({ username: "", email: "", role: "Viewer" });
    setEditingUser(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email) {
      toast.error("Username and email are required");
      return;
    }
    if (editingUser) {
      updateUser(editingUser.id, formData);
      toast.success("User updated");
    } else {
      addUser(formData);
      toast.success("User added");
    }
    setShowModal(false);
    resetForm();
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({ username: user.username, email: user.email, role: user.role || "Viewer" });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUser(id);
      toast.success("User deleted");
    }
  };

  // Role badge style
  const roleBadge = (role) => {
    const colors = {
      "Admin": "bg-[var(--color-accent)] text-[#06222A]",
      "Editor": "bg-[var(--color-warn)] text-[#06222A]",
      "Viewer": "bg-[var(--color-border)] text-[var(--color-muted)]",
      "Admin/editor": "bg-[var(--color-accent)] text-[#06222A]",
      "Not assigned": "bg-[var(--color-faint)]/30 text-[var(--color-faint)]",
    };
    return colors[role] || colors["Viewer"];
  };

  // Mock additional fields for demo (since useUsers only has username, email, role)
  // We'll extend the mock data in useUsers to include these fields.
  // For now, we'll generate them.
  const getExtendedUser = (user) => {
    const origins = ["LDAP", "Local", "OAuth", "Google"];
    const lastActive = ["10 days", "6 minutes", "5 days", "Never", "11 days", "6 days"];
    const names = ["Aditya G G", "Admin", "Dileep Bammidi", "Muniraja", "PAM Admin", "Raja Rao"];
    const index = user.id % 6;
    return {
      ...user,
      name: names[index] || user.username,
      belongsTo: "Main Org.",
      lastActive: lastActive[index % lastActive.length],
      origin: origins[index % origins.length],
      provisioned: (index % 2 === 0) ? "true" : "false",
      licensedRole: user.role === "admin" ? "Admin/editor" : "Viewer",
    };
  };

  const usersWithExtras = filteredUsers.map(getExtendedUser);

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Users</h1>
          <p className="text-sm text-[var(--color-muted)]">Manage users in Grafana</p>
        </div>
        {admin && (
          <button
            onClick={() => { resetForm(); setShowModal(true); }}
            className="flex items-center gap-2 px-3 py-1.5 bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90 transition text-sm"
          >
            <Plus size={16} />
            Add user
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-[var(--color-border)]">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
            activeTab === "all"
              ? "border-[var(--color-accent)] text-[var(--color-accent)]"
              : "border-transparent text-[var(--color-muted)] hover:text-[var(--color-text)]"
          }`}
        >
          All users
        </button>
        <button
          onClick={() => setActiveTab("org")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
            activeTab === "org"
              ? "border-[var(--color-accent)] text-[var(--color-accent)]"
              : "border-transparent text-[var(--color-muted)] hover:text-[var(--color-text)]"
          }`}
        >
          Organization users
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-faint)]" />
        <input
          type="text"
          placeholder="Search user by login, email, or name."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent text-sm"
        />
      </div>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-[var(--color-muted)] text-xs uppercase tracking-wider">
                <th className="py-2 px-3 font-medium">Login</th>
                <th className="py-2 px-3 font-medium">Email</th>
                <th className="py-2 px-3 font-medium">Name</th>
                <th className="py-2 px-3 font-medium">Belongs to</th>
                <th className="py-2 px-3 font-medium">Licensed role</th>
                <th className="py-2 px-3 font-medium">Last active</th>
                <th className="py-2 px-3 font-medium">Origin</th>
                <th className="py-2 px-3 font-medium">Provisioned</th>
                {admin && <th className="py-2 px-3 font-medium">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {usersWithExtras.length === 0 ? (
                <tr>
                  <td colSpan={admin ? 9 : 8} className="text-center py-8 text-[var(--color-muted)]">
                    No users found.
                  </td>
                </tr>
              ) : (
                usersWithExtras.map((user) => (
                  <tr key={user.id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-panel-alt)] transition-colors">
                    <td className="py-2 px-3 text-[var(--color-text)] font-mono text-xs">{user.username}</td>
                    <td className="py-2 px-3 text-[var(--color-text)]">{user.email}</td>
                    <td className="py-2 px-3 text-[var(--color-text)]">{user.name}</td>
                    <td className="py-2 px-3 text-[var(--color-muted)]">{user.belongsTo}</td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${roleBadge(user.licensedRole)}`}>
                        {user.licensedRole}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-[var(--color-faint)]">{user.lastActive}</td>
                    <td className="py-2 px-3 text-[var(--color-muted)]">{user.origin}</td>
                    <td className="py-2 px-3 text-[var(--color-muted)]">{user.provisioned}</td>
                    {admin && (
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(user)}
                            className="p-1 rounded hover:bg-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-text)] transition"
                            title="Edit"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="p-1 rounded hover:bg-[var(--color-border)] text-[var(--color-crit)] hover:text-[var(--color-crit)]/80 transition"
                            title="Delete"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-[var(--color-text)] mb-4">
              {editingUser ? "Edit User" : "Add User"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[var(--color-muted)] text-sm mb-1">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-[var(--color-muted)] text-sm mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
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
                  <option value="Admin/editor">Admin/editor</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="px-4 py-2 text-[var(--color-muted)] hover:text-[var(--color-text)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90"
                >
                  {editingUser ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}