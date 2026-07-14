import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  X,
  Users,
  User,
  UserPlus,
  UserMinus,
} from "lucide-react";
import { toast } from "react-hot-toast";

const defaultTeams = [
  {
    id: 1,
    name: "Frontend Team",
    description: "UI/UX and frontend developers",
    members: ["alice", "bob", "charlie"],
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 2,
    name: "Backend Team",
    description: "API and database engineers",
    members: ["dave", "eve", "frank"],
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
];

const STORAGE_KEY = "teams";

const loadTeams = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {}
  }
  return defaultTeams;
};

const saveTeams = (teams) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(teams));
};

const generateId = () => Date.now() + Math.random() * 1000;

const TeamModal = ({ isOpen, onClose, onSave, editingTeam }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    members: [],
  });
  const [memberInput, setMemberInput] = useState("");

  useEffect(() => {
    if (editingTeam) {
      setFormData({
        name: editingTeam.name || "",
        description: editingTeam.description || "",
        members: editingTeam.members || [],
      });
    } else {
      setFormData({ name: "", description: "", members: [] });
    }
  }, [editingTeam, isOpen]);

  const handleAddMember = () => {
    if (!memberInput.trim()) return;
    if (formData.members.includes(memberInput.trim())) {
      toast.error("Member already added");
      return;
    }
    setFormData({
      ...formData,
      members: [...formData.members, memberInput.trim()],
    });
    setMemberInput("");
  };

  const handleRemoveMember = (member) => {
    setFormData({
      ...formData,
      members: formData.members.filter((m) => m !== member),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Team name is required");
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
            {editingTeam ? "Edit Team" : "New Team"}
          </h3>
          <button onClick={onClose} className="text-[var(--color-muted)] hover:text-[var(--color-text)]">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[var(--color-muted)] text-sm mb-1">Team Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
              placeholder="e.g. Frontend Team"
            />
          </div>
          <div>
            <label className="block text-[var(--color-muted)] text-sm mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
              rows="2"
              placeholder="Team description"
            />
          </div>
          <div>
            <label className="block text-[var(--color-muted)] text-sm mb-1">Members</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={memberInput}
                onChange={(e) => setMemberInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddMember())}
                className="flex-1 px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] text-sm focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                placeholder="Add member username"
              />
              <button
                type="button"
                onClick={handleAddMember}
                className="px-3 py-1.5 bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90 transition"
              >
                <UserPlus size={14} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.members.map((member) => (
                <span
                  key={member}
                  className="flex items-center gap-1 px-2 py-1 bg-[var(--color-panel-alt)] border border-[var(--color-border)] rounded text-xs"
                >
                  <User size={12} />
                  {member}
                  <button
                    type="button"
                    onClick={() => handleRemoveMember(member)}
                    className="text-[var(--color-muted)] hover:text-[var(--color-crit)]"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
              {formData.members.length === 0 && (
                <span className="text-xs text-[var(--color-muted)]">No members added</span>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
            <button type="button" onClick={onClose} className="px-4 py-2 text-[var(--color-muted)] hover:text-[var(--color-text)]">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90">
              {editingTeam ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);

  useEffect(() => {
    setTeams(loadTeams());
  }, []);

  useEffect(() => {
    let result = teams;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter((t) =>
        t.name.toLowerCase().includes(term) ||
        t.description?.toLowerCase().includes(term) ||
        t.members.some((m) => m.toLowerCase().includes(term))
      );
    }
    setFiltered(result);
  }, [searchTerm, teams]);

  useEffect(() => {
    if (teams.length > 0) saveTeams(teams);
  }, [teams]);

  const handleAddTeam = (data) => {
    const newTeam = { ...data, id: generateId(), createdAt: new Date().toISOString() };
    setTeams([...teams, newTeam]);
    toast.success(`Team "${newTeam.name}" created`);
    setIsModalOpen(false);
  };

  const handleEditTeam = (updated) => {
    setTeams(teams.map((t) => (t.id === updated.id ? { ...updated } : t)));
    toast.success(`Team "${updated.name}" updated`);
    setIsModalOpen(false);
    setEditingTeam(null);
  };

  const handleDeleteTeam = (id) => {
    const team = teams.find((t) => t.id === id);
    if (!team) return;
    if (window.confirm(`Delete team "${team.name}"?`)) {
      setTeams(teams.filter((t) => t.id !== id));
      toast.success(`Team "${team.name}" deleted`);
    }
  };

  const openCreate = () => { setEditingTeam(null); setIsModalOpen(true); };
  const openEdit = (team) => { setEditingTeam(team); setIsModalOpen(true); };
  const closeModal = () => { setIsModalOpen(false); setEditingTeam(null); };

  const handleSave = (data) => {
    if (editingTeam) {
      handleEditTeam({ ...data, id: editingTeam.id, createdAt: editingTeam.createdAt });
    } else {
      handleAddTeam(data);
    }
  };

  const formatDate = (iso) => {
    if (!iso) return "N/A";
    try { return new Date(iso).toLocaleDateString(); } catch { return iso; }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      {/* HEADER WITH BUTTON */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Teams</h1>
          <p className="text-sm text-[var(--color-muted)]">Manage teams and their members.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90 transition text-sm"
        >
          <Plus size={16} />
          New Team
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-faint)]" />
        <input
          type="text"
          placeholder="Search teams..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-faint)] text-sm focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
        />
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-[var(--color-border)] rounded-lg bg-[var(--color-panel)]">
          <Users size={32} className="text-[var(--color-faint)] mb-4" />
          <h3 className="text-[var(--color-text)] font-medium text-lg">No teams created</h3>
          <p className="text-[var(--color-muted)] text-sm max-w-sm mt-1">
            Create a team to organize users and manage permissions.
          </p>
          <button
            onClick={openCreate}
            className="mt-4 px-4 py-2 bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90 transition"
          >
            <Plus size={14} className="inline mr-1" />
            New Team
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((team) => (
            <div key={team.id} className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
              {/* ... card content ... */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[var(--color-text)] font-medium">{team.name}</span>
                    <span className="text-xs bg-[var(--color-panel-alt)] text-[var(--color-muted)] px-2 py-0.5 rounded-full">
                      {team.members.length} members
                    </span>
                  </div>
                  {team.description && <div className="text-xs text-[var(--color-muted)] mt-1">{team.description}</div>}
                  <div className="text-xs text-[var(--color-faint)] mt-1">Created {formatDate(team.createdAt)}</div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {team.members.slice(0, 4).map((member) => (
                      <span key={member} className="text-xs bg-[var(--color-border)] px-2 py-0.5 rounded-full text-[var(--color-text)]">
                        {member}
                      </span>
                    ))}
                    {team.members.length > 4 && <span className="text-xs text-[var(--color-muted)]">+{team.members.length - 4} more</span>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(team)} className="p-1 rounded hover:bg-[var(--color-panel-alt)] text-[var(--color-muted)] hover:text-[var(--color-text)]">
                    <Edit size={14} />
                  </button>
                  <button onClick={() => handleDeleteTeam(team.id)} className="p-1 rounded hover:bg-[var(--color-panel-alt)] text-[var(--color-muted)] hover:text-[var(--color-crit)]">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <TeamModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
        editingTeam={editingTeam}
      />
    </div>
  );
}