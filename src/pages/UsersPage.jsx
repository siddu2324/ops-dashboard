import { useState } from "react";
import { toast } from "react-hot-toast";
import Card from "../components/common/Card";
import { useUsers } from "../hooks/useUsers";
import { isAdmin } from "../services/authService";
import { logAction } from "../services/auditService"; // ✅ Added import

export default function UsersPage() {
  const { users, addUser, updateUser, deleteUser } = useUsers();
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ username: "", email: "", role: "user" });

  const admin = isAdmin();

  const resetForm = () => {
    setFormData({ username: "", email: "", role: "user" });
    setEditingUser(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email) {
      toast.error("Username and email are required");
      return;
    }
    if (editingUser) {
      // Update existing user
      updateUser(editingUser.id, formData);
      // ✅ Log user update
      logAction("user_updated", { 
        id: editingUser.id, 
        changes: { ...formData } 
      });
      toast.success("User updated");
    } else {
      // Add new user
      addUser(formData);
      // ✅ Log user creation
      logAction("user_created", { 
        username: formData.username, 
        email: formData.email, 
        role: formData.role 
      });
      toast.success("User added");
    }
    setShowModal(false);
    resetForm();
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({ username: user.username, email: user.email, role: user.role });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure?")) {
      deleteUser(id);
      // ✅ Log user deletion
      logAction("user_deleted", { id });
      toast.success("User deleted");
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <Card
        title="Users"
        right={
          admin && (
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="px-3 py-1 bg-[var(--color-accent)] text-[#06222A] rounded-lg text-sm font-medium hover:opacity-90"
            >
              + Add User
            </button>
          )
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-[var(--color-muted)] text-sm">
                <th className="py-2 px-3">Username</th>
                <th className="py-2 px-3">Email</th>
                <th className="py-2 px-3">Role</th>
                {admin && <th className="py-2 px-3">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-[var(--color-border)]">
                  <td className="py-2 px-3 text-[var(--color-text)]">{user.username}</td>
                  <td className="py-2 px-3 text-[var(--color-text)]">{user.email}</td>
                  <td className="py-2 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      user.role === "admin" ? "bg-[var(--color-accent)] text-[#06222A]" : "bg-[var(--color-border)] text-[var(--color-muted)]"
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  {admin && (
                    <td className="py-2 px-3 space-x-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-[var(--color-muted)] hover:text-[var(--color-text)] text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-[var(--color-crit)] hover:text-[var(--color-crit)]/80 text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal */}
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
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
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