import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronDown,
  ChevronRight,
  Clock,
  Calendar,
  Globe,
  X,
  Send,
  FileText,
} from "lucide-react";
import { toast } from "react-hot-toast";

// ---------- Default Data ----------
const defaultContactPoints = [
  {
    id: 1,
    name: "Email-Alerts",
    usedBy: 1,
    type: "email",
    config: { email: "muniraja.g@quantanxt.com" },
    status: "failed",
    lastDelivery: "Last delivery attempt failed",
  },
  {
    id: 2,
    name: "empty",
    usedBy: 1,
    type: "no-integrations",
    config: {},
    status: "idle",
  },
  {
    id: 3,
    name: "Loki",
    usedBy: 12,
    type: "email",
    config: { email: "Secops-team@asplinfo.com" },
    status: "failed",
    lastDelivery: "Last delivery attempt failed",
  },
  {
    id: 4,
    name: "Test",
    usedBy: 0,
    type: "email",
    config: { email: "test@example.com" },
    status: "idle",
  },
  {
    id: 5,
    name: "Alertmanager",
    usedBy: 0,
    type: "alertmanager",
    config: { url: "https://alertmanager.example.com" },
    status: "idle",
    lastDelivery: "No delivery attempts",
  },
  {
    id: 6,
    name: "Zabbix monitoring",
    usedBy: 4,
    type: "email",
    config: { email: "Secops-team@asplinfo.com" },
    status: "failed",
    lastDelivery: "Last delivery attempt failed",
  },
];

const defaultPolicies = [
  {
    id: "default",
    name: "Default policy",
    isDefault: true,
    contactPoint: "empty",
    groupBy: ["grafana_folder", "alertname"],
    groupWait: "30s",
    groupInterval: "5m",
    repeatInterval: "4h",
  },
];

const defaultTimeIntervals = [];

// Storage keys
const STORAGE_KEY_CONTACTS = "contactPoints";
const STORAGE_KEY_POLICIES = "notificationPolicies";
const STORAGE_KEY_INTERVALS = "timeIntervals";

// Helpers
const loadData = (key, defaultVal) => {
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {}
  }
  return defaultVal;
};

const saveData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const generateId = () => Date.now() + Math.random() * 1000;

// ---------- Modal Components ----------
const PolicyModal = ({ isOpen, onClose, onSave, editingPolicy, contactPoints }) => {
  const [formData, setFormData] = useState({
    name: "",
    contactPoint: "",
    groupBy: ["grafana_folder", "alertname"],
    groupWait: "30s",
    groupInterval: "5m",
    repeatInterval: "4h",
  });

  useEffect(() => {
    if (editingPolicy && editingPolicy.id !== "default") {
      setFormData({
        name: editingPolicy.name,
        contactPoint: editingPolicy.contactPoint || "",
        groupBy: editingPolicy.groupBy || ["grafana_folder", "alertname"],
        groupWait: editingPolicy.groupWait || "30s",
        groupInterval: editingPolicy.groupInterval || "5m",
        repeatInterval: editingPolicy.repeatInterval || "4h",
      });
    } else {
      setFormData({
        name: "",
        contactPoint: "",
        groupBy: ["grafana_folder", "alertname"],
        groupWait: "30s",
        groupInterval: "5m",
        repeatInterval: "4h",
      });
    }
  }, [editingPolicy, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Policy name is required");
      return;
    }
    if (!formData.contactPoint) {
      toast.error("Contact point is required");
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
            {editingPolicy && editingPolicy.id !== "default" ? "Edit Policy" : "New Policy"}
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
              placeholder="e.g. Critical Alerts"
            />
          </div>
          <div>
            <label className="block text-[var(--color-muted)] text-sm mb-1">Contact Point *</label>
            <select
              value={formData.contactPoint}
              onChange={(e) => setFormData({ ...formData, contactPoint: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
            >
              <option value="">Choose a contact point</option>
              {contactPoints.map((cp) => (
                <option key={cp.id} value={cp.name}>{cp.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[var(--color-muted)] text-sm mb-1">Group By</label>
            <div className="flex flex-wrap gap-2">
              {formData.groupBy.map((label) => (
                <span key={label} className="flex items-center gap-1 px-2 py-1 bg-[var(--color-panel-alt)] border border-[var(--color-border)] rounded text-xs">
                  {label}
                  <button
                    type="button"
                    onClick={() => setFormData({
                      ...formData,
                      groupBy: formData.groupBy.filter((g) => g !== label)
                    })}
                    className="text-[var(--color-muted)] hover:text-[var(--color-crit)]"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
              <button
                type="button"
                onClick={() => {
                  const newLabel = prompt("Enter label name:");
                  if (newLabel) setFormData({
                    ...formData,
                    groupBy: [...formData.groupBy, newLabel]
                  });
                }}
                className="px-2 py-1 text-xs border border-dashed border-[var(--color-border)] rounded text-[var(--color-muted)] hover:text-[var(--color-text)]"
              >
                + Add label
              </button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[var(--color-muted)] text-xs mb-1">Group Wait</label>
              <input
                type="text"
                value={formData.groupWait}
                onChange={(e) => setFormData({ ...formData, groupWait: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] text-sm focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                placeholder="30s"
              />
            </div>
            <div>
              <label className="block text-[var(--color-muted)] text-xs mb-1">Group Interval</label>
              <input
                type="text"
                value={formData.groupInterval}
                onChange={(e) => setFormData({ ...formData, groupInterval: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] text-sm focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                placeholder="5m"
              />
            </div>
            <div>
              <label className="block text-[var(--color-muted)] text-xs mb-1">Repeat Interval</label>
              <input
                type="text"
                value={formData.repeatInterval}
                onChange={(e) => setFormData({ ...formData, repeatInterval: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] text-sm focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                placeholder="4h"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
            <button type="button" onClick={onClose} className="px-4 py-2 text-[var(--color-muted)] hover:text-[var(--color-text)]">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90">
              {editingPolicy && editingPolicy.id !== "default" ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const TimeIntervalModal = ({ isOpen, onClose, onSave, editingInterval }) => {
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const [formData, setFormData] = useState({
    name: "",
    timeRanges: [{ start: "09:00", end: "17:00" }],
    location: "",
    daysOfWeek: [],
    daysOfMonth: "",
    months: "",
    years: "",
  });

  useEffect(() => {
    if (editingInterval) {
      setFormData({
        name: editingInterval.name,
        timeRanges: editingInterval.timeRanges || [{ start: "09:00", end: "17:00" }],
        location: editingInterval.location || "",
        daysOfWeek: editingInterval.daysOfWeek || [],
        daysOfMonth: editingInterval.daysOfMonth || "",
        months: editingInterval.months || "",
        years: editingInterval.years || "",
      });
    } else {
      setFormData({
        name: "",
        timeRanges: [{ start: "09:00", end: "17:00" }],
        location: "",
        daysOfWeek: [],
        daysOfMonth: "",
        months: "",
        years: "",
      });
    }
  }, [editingInterval, isOpen]);

  const toggleDay = (day) => {
    setFormData((prev) => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(day)
        ? prev.daysOfWeek.filter((d) => d !== day)
        : [...prev.daysOfWeek, day],
    }));
  };

  const addTimeRange = () => {
    setFormData((prev) => ({
      ...prev,
      timeRanges: [...prev.timeRanges, { start: "09:00", end: "17:00" }],
    }));
  };

  const removeTimeRange = (idx) => {
    if (formData.timeRanges.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      timeRanges: prev.timeRanges.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-[var(--color-text)]">
            {editingInterval ? "Edit Time Interval" : "New Time Interval"}
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
              placeholder="A unique name for the time interval"
            />
          </div>

          <div>
            <div className="text-sm font-medium text-[var(--color-text)] mb-2">Time intervals</div>
            <p className="text-xs text-[var(--color-muted)] mb-3">
              A time interval item is a definition for a moment in time. All fields are lists, and at least one list element must be a moment of time will match the field. For an instant of time to match a complete time interval, all fields must match.
            </p>
            {formData.timeRanges.map((tr, idx) => (
              <div key={idx} className="flex items-center gap-3 mb-2">
                <div className="flex items-center gap-2 flex-1">
                  <div>
                    <label className="text-xs text-[var(--color-muted)]">Start time</label>
                    <input
                      type="time"
                      value={tr.start}
                      onChange={(e) => {
                        const updated = [...formData.timeRanges];
                        updated[idx].start = e.target.value;
                        setFormData({ ...formData, timeRanges: updated });
                      }}
                      className="w-28 px-2 py-1 rounded border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[var(--color-muted)]">End time</label>
                    <input
                      type="time"
                      value={tr.end}
                      onChange={(e) => {
                        const updated = [...formData.timeRanges];
                        updated[idx].end = e.target.value;
                        setFormData({ ...formData, timeRanges: updated });
                      }}
                      className="w-28 px-2 py-1 rounded border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] text-sm"
                    />
                  </div>
                </div>
                {formData.timeRanges.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTimeRange(idx)}
                    className="text-[var(--color-crit)] hover:text-[var(--color-crit)]/80"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addTimeRange}
              className="text-sm text-[var(--color-accent)] hover:underline"
            >
              + Add another time range
            </button>
          </div>

          <div>
            <label className="block text-[var(--color-text)] font-medium text-sm mb-1">Location</label>
            <div className="flex items-center gap-2">
              <Globe size={16} className="text-[var(--color-muted)]" />
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Location (e.g. UTC, America/New_York)"
                className="flex-1 px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-[var(--color-text)] font-medium text-sm mb-1">Days of the week</label>
            <div className="flex flex-wrap gap-2">
              {weekDays.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`px-3 py-1 text-sm rounded-full border transition ${
                    formData.daysOfWeek.includes(day)
                      ? "bg-[var(--color-accent)] text-[#06222A] border-[var(--color-accent)]"
                      : "bg-transparent text-[var(--color-muted)] border-[var(--color-border)] hover:border-[var(--color-text)]"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[var(--color-text)] font-medium text-sm mb-1">Days of the month</label>
            <p className="text-xs text-[var(--color-muted)] mb-1">
              The days of the month, 1-31, of a month. Negative values can be used to represent days which begin at the end of the month
            </p>
            <input
              type="text"
              value={formData.daysOfMonth}
              onChange={(e) => setFormData({ ...formData, daysOfMonth: e.target.value })}
              placeholder="Example: 1, 14:16, -1"
              className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-[var(--color-text)] font-medium text-sm mb-1">Months</label>
            <p className="text-xs text-[var(--color-muted)] mb-1">
              The months of the year in either numerical or the full calendar month
            </p>
            <input
              type="text"
              value={formData.months}
              onChange={(e) => setFormData({ ...formData, months: e.target.value })}
              placeholder="Example: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12"
              className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-[var(--color-text)] font-medium text-sm mb-1">Years</label>
            <p className="text-xs text-[var(--color-muted)] mb-1">Example: 2021:2022, 2030</p>
            <input
              type="text"
              value={formData.years}
              onChange={(e) => setFormData({ ...formData, years: e.target.value })}
              placeholder="Example: 2021:2022, 2030"
              className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
            />
          </div>

          <button
            type="button"
            className="text-sm text-[var(--color-crit)] hover:underline"
          >
            Remove time interval
          </button>

          <button
            type="button"
            className="text-sm text-[var(--color-accent)] hover:underline block"
          >
            + Add another time interval item
          </button>

          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
            <button type="button" onClick={onClose} className="px-4 py-2 text-[var(--color-muted)] hover:text-[var(--color-text)]">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90">
              {editingInterval ? "Update" : "Save time interval"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ---------- Main Component ----------
export default function NotificationConfigPage() {
  const [activeTab, setActiveTab] = useState("contact-points");
  const [contactPoints, setContactPoints] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [timeIntervals, setTimeIntervals] = useState([]);
  const [filteredContactPoints, setFilteredContactPoints] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [isIntervalModalOpen, setIsIntervalModalOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [editingInterval, setEditingInterval] = useState(null);

  // Load data
  useEffect(() => {
    setContactPoints(loadData(STORAGE_KEY_CONTACTS, defaultContactPoints));
    setPolicies(loadData(STORAGE_KEY_POLICIES, defaultPolicies));
    setTimeIntervals(loadData(STORAGE_KEY_INTERVALS, defaultTimeIntervals));
  }, []);

  // Filter contacts
  useEffect(() => {
    let result = contactPoints;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter((p) =>
        p.name.toLowerCase().includes(term) ||
        p.type.toLowerCase().includes(term)
      );
    }
    setFilteredContactPoints(result);
  }, [searchTerm, contactPoints]);

  // Save on change
  useEffect(() => {
    if (contactPoints.length > 0) saveData(STORAGE_KEY_CONTACTS, contactPoints);
  }, [contactPoints]);

  useEffect(() => {
    if (policies.length > 0) saveData(STORAGE_KEY_POLICIES, policies);
  }, [policies]);

  useEffect(() => {
    if (timeIntervals.length > 0) saveData(STORAGE_KEY_INTERVALS, timeIntervals);
  }, [timeIntervals]);

  // ---- Contact Points CRUD (simplified) ----
  const handleDeleteContactPoint = (id) => {
    const point = contactPoints.find((p) => p.id === id);
    if (!point) return;
    if (window.confirm(`Are you sure you want to delete "${point.name}"?`)) {
      setContactPoints(contactPoints.filter((p) => p.id !== id));
      toast.success(`Contact point "${point.name}" deleted`);
    }
  };

  // ---- Policies CRUD ----
  const handleAddPolicy = (data) => {
    const policy = { ...data, id: generateId(), isDefault: false };
    setPolicies([...policies, policy]);
    toast.success(`Policy "${policy.name}" created`);
    setIsPolicyModalOpen(false);
  };

  const handleEditPolicy = (updated) => {
    setPolicies(policies.map((p) => (p.id === updated.id ? { ...updated } : p)));
    toast.success(`Policy "${updated.name}" updated`);
    setIsPolicyModalOpen(false);
    setEditingPolicy(null);
  };

  const handleDeletePolicy = (id) => {
    const policy = policies.find((p) => p.id === id);
    if (!policy || policy.isDefault) {
      toast.error("Cannot delete the default policy");
      return;
    }
    if (window.confirm(`Delete policy "${policy.name}"?`)) {
      setPolicies(policies.filter((p) => p.id !== id));
      toast.success(`Policy "${policy.name}" deleted`);
    }
  };

  const openPolicyModal = (policy = null) => {
    setEditingPolicy(policy);
    setIsPolicyModalOpen(true);
  };

  const closePolicyModal = () => {
    setIsPolicyModalOpen(false);
    setEditingPolicy(null);
  };

  const handleSavePolicy = (data) => {
    if (editingPolicy && editingPolicy.id !== "default") {
      handleEditPolicy({ ...data, id: editingPolicy.id });
    } else {
      handleAddPolicy(data);
    }
  };

  // ---- Time Intervals CRUD ----
  const handleAddInterval = (data) => {
    const interval = { ...data, id: generateId() };
    setTimeIntervals([...timeIntervals, interval]);
    toast.success(`Time interval "${interval.name}" created`);
    setIsIntervalModalOpen(false);
  };

  const handleEditInterval = (updated) => {
    setTimeIntervals(timeIntervals.map((i) => (i.id === updated.id ? { ...updated } : i)));
    toast.success(`Time interval "${updated.name}" updated`);
    setIsIntervalModalOpen(false);
    setEditingInterval(null);
  };

  const handleDeleteInterval = (id) => {
    const interval = timeIntervals.find((i) => i.id === id);
    if (!interval) return;
    if (window.confirm(`Delete time interval "${interval.name}"?`)) {
      setTimeIntervals(timeIntervals.filter((i) => i.id !== id));
      toast.success(`Time interval "${interval.name}" deleted`);
    }
  };

  const openIntervalModal = (interval = null) => {
    setEditingInterval(interval);
    setIsIntervalModalOpen(true);
  };

  const closeIntervalModal = () => {
    setIsIntervalModalOpen(false);
    setEditingInterval(null);
  };

  const handleSaveInterval = (data) => {
    if (editingInterval) {
      handleEditInterval({ ...data, id: editingInterval.id });
    } else {
      handleAddInterval(data);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Notification configuration</h1>
        <p className="text-sm text-[var(--color-muted)]">
          Manage contact points, notification policies, templates, and time intervals
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-[var(--color-border)]">
        <button
          onClick={() => setActiveTab("contact-points")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
            activeTab === "contact-points"
              ? "border-[var(--color-accent)] text-[var(--color-accent)]"
              : "border-transparent text-[var(--color-muted)] hover:text-[var(--color-text)]"
          }`}
        >
          Contact points
        </button>
        <button
          onClick={() => setActiveTab("notification-policies")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
            activeTab === "notification-policies"
              ? "border-[var(--color-accent)] text-[var(--color-accent)]"
              : "border-transparent text-[var(--color-muted)] hover:text-[var(--color-text)]"
          }`}
        >
          Notification policies
        </button>
        <button
          onClick={() => setActiveTab("templates")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
            activeTab === "templates"
              ? "border-[var(--color-accent)] text-[var(--color-accent)]"
              : "border-transparent text-[var(--color-muted)] hover:text-[var(--color-text)]"
          }`}
        >
          Templates
        </button>
        <button
          onClick={() => setActiveTab("time-intervals")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
            activeTab === "time-intervals"
              ? "border-[var(--color-accent)] text-[var(--color-accent)]"
              : "border-transparent text-[var(--color-muted)] hover:text-[var(--color-text)]"
          }`}
        >
          Time intervals
        </button>
      </div>

      {/* ---- CONTACT POINTS ---- */}
      {activeTab === "contact-points" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-faint)]" />
              <input
                type="text"
                placeholder="Search by name or type"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-faint)] text-sm focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
              />
            </div>
            <button
              onClick={() => toast.info("New contact point form coming soon")}
              className="flex items-center gap-1 px-3 py-1.5 bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90 transition text-sm"
            >
              <Plus size={14} />
              New contact point
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContactPoints.map((cp) => (
              <div key={cp.id} className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium text-[var(--color-text)]">{cp.name}</div>
                    <div className="text-xs text-[var(--color-muted)] capitalize">{cp.type}</div>
                    <div className="text-xs text-[var(--color-text)] font-mono truncate">
                      {cp.config.email || cp.config.url || "No config"}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => toast.info(`Edit ${cp.name}`)}
                      className="p-1 text-[var(--color-muted)] hover:text-[var(--color-text)]"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteContactPoint(cp.id)}
                      className="p-1 text-[var(--color-muted)] hover:text-[var(--color-crit)]"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---- NOTIFICATION POLICIES ---- */}
      {activeTab === "notification-policies" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-faint)]" />
              <input
                type="text"
                placeholder="Search policies..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-faint)] text-sm focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
              />
            </div>
            <button
              onClick={() => openPolicyModal()}
              className="flex items-center gap-1 px-3 py-1.5 bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90 transition text-sm"
            >
              <Plus size={14} />
              New notification policy
            </button>
          </div>

          {/* Default Policy Card */}
          <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[var(--color-text)] font-medium">Default policy</span>
                  <span className="text-xs bg-[var(--color-accent)]/20 text-[var(--color-accent)] px-2 py-0.5 rounded-full">Built-in</span>
                </div>
                <div className="text-xs text-[var(--color-muted)] mt-1 flex items-center gap-2">
                  <Send size={12} />
                  Delivered to <span className="text-[var(--color-text)]">empty</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-xs text-[var(--color-muted)] flex items-center gap-1">
                    <Clock size={12} />
                    Grouped by grafana_folder, alertname
                  </span>
                  <span className="text-xs text-[var(--color-muted)] flex items-center gap-1">
                    <Clock size={12} />
                    Wait 30s to group instances
                  </span>
                  <span className="text-xs text-[var(--color-muted)] flex items-center gap-1">
                    <Clock size={12} />
                    Wait 5m before sending updates
                  </span>
                  <span className="text-xs text-[var(--color-muted)] flex items-center gap-1">
                    <Clock size={12} />
                    Repeated every 4h
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="text-sm text-[var(--color-accent)] hover:underline">+ Add route</button>
              </div>
            </div>
          </div>

          {/* Custom Policies List */}
          {policies.filter(p => !p.isDefault).length === 0 ? (
            <div className="text-center py-8 text-[var(--color-muted)]">No custom policies created</div>
          ) : (
            policies.filter(p => !p.isDefault).map((policy) => (
              <div key={policy.id} className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[var(--color-text)] font-medium">{policy.name}</span>
                    </div>
                    <div className="text-xs text-[var(--color-muted)] mt-1 flex items-center gap-2">
                      <Send size={12} />
                      Delivered to <span className="text-[var(--color-text)]">{policy.contactPoint}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-xs text-[var(--color-muted)] flex items-center gap-1">
                        <Clock size={12} />
                        Grouped by {policy.groupBy.join(", ")}
                      </span>
                      <span className="text-xs text-[var(--color-muted)] flex items-center gap-1">
                        <Clock size={12} />
                        Wait {policy.groupWait} to group instances
                      </span>
                      <span className="text-xs text-[var(--color-muted)] flex items-center gap-1">
                        <Clock size={12} />
                        Wait {policy.groupInterval} before sending updates
                      </span>
                      <span className="text-xs text-[var(--color-muted)] flex items-center gap-1">
                        <Clock size={12} />
                        Repeated every {policy.repeatInterval}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openPolicyModal(policy)}
                      className="p-1 text-[var(--color-muted)] hover:text-[var(--color-text)]"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDeletePolicy(policy.id)}
                      className="p-1 text-[var(--color-muted)] hover:text-[var(--color-crit)]"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}

          <PolicyModal
            isOpen={isPolicyModalOpen}
            onClose={closePolicyModal}
            onSave={handleSavePolicy}
            editingPolicy={editingPolicy}
            contactPoints={contactPoints}
          />
        </div>
      )}

      {/* ---- TEMPLATES ---- */}
      {activeTab === "templates" && (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-[var(--color-border)] rounded-lg bg-[var(--color-panel)]">
          <FileText size={32} className="text-[var(--color-faint)] mb-4" />
          <h3 className="text-[var(--color-text)] font-medium text-lg">No templates created</h3>
          <p className="text-[var(--color-muted)] text-sm max-w-sm mt-1">You haven't created any notification templates yet.</p>
        </div>
      )}

      {/* ---- TIME INTERVALS ---- */}
      {activeTab === "time-intervals" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-faint)]" />
              <input
                type="text"
                placeholder="Search time intervals..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-faint)] text-sm focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 border border-[var(--color-border)] text-[var(--color-text)] rounded-lg hover:bg-[var(--color-panel-alt)] transition text-sm">
                Export all
              </button>
              <button
                onClick={() => openIntervalModal()}
                className="flex items-center gap-1 px-3 py-1.5 bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90 transition text-sm"
              >
                <Plus size={14} />
                New time interval
              </button>
            </div>
          </div>

          {timeIntervals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center border border-[var(--color-border)] rounded-lg bg-[var(--color-panel)]">
              <Calendar size={32} className="text-[var(--color-faint)] mb-4" />
              <h3 className="text-[var(--color-text)] font-medium text-lg">You haven't created any time intervals yet</h3>
              <button
                onClick={() => openIntervalModal()}
                className="mt-4 px-4 py-2 bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90 transition"
              >
                + New time interval
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {timeIntervals.map((interval) => (
                <div key={interval.id} className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium text-[var(--color-text)]">{interval.name}</div>
                      <div className="text-xs text-[var(--color-muted)] mt-1">
                        {interval.timeRanges.map((tr, i) => (
                          <span key={i}>
                            {tr.start}–{tr.end}
                            {i < interval.timeRanges.length - 1 && ", "}
                          </span>
                        ))}
                        {interval.location && ` (${interval.location})`}
                      </div>
                      {interval.daysOfWeek.length > 0 && (
                        <div className="text-xs text-[var(--color-muted)] mt-1">
                          Days: {interval.daysOfWeek.join(", ")}
                        </div>
                      )}
                      {interval.daysOfMonth && (
                        <div className="text-xs text-[var(--color-muted)] mt-1">
                          Month days: {interval.daysOfMonth}
                        </div>
                      )}
                      {interval.months && (
                        <div className="text-xs text-[var(--color-muted)] mt-1">
                          Months: {interval.months}
                        </div>
                      )}
                      {interval.years && (
                        <div className="text-xs text-[var(--color-muted)] mt-1">
                          Years: {interval.years}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => openIntervalModal(interval)}
                        className="p-1 text-[var(--color-muted)] hover:text-[var(--color-text)]"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteInterval(interval.id)}
                        className="p-1 text-[var(--color-muted)] hover:text-[var(--color-crit)]"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <TimeIntervalModal
            isOpen={isIntervalModalOpen}
            onClose={closeIntervalModal}
            onSave={handleSaveInterval}
            editingInterval={editingInterval}
          />
        </div>
      )}
    </div>
  );
}