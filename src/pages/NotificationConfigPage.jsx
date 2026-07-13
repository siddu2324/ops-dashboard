import { useState } from "react";
import {
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  ChevronDown,
  ChevronRight,
  Clock,
  Calendar,
  Globe,
  AlertCircle,
  CheckCircle,
  X,
  Copy,
  Send,
  FileText, // ✅ Added missing import
} from "lucide-react";
import { toast } from "react-hot-toast";
import Card from "../components/common/Card";
import StatusDot from "../components/common/StatusDot";

// ---------- Mock Data ----------
const contactPoints = [
  {
    id: 1,
    name: "Email-Alerts",
    usedBy: 1,
    type: "Email",
    config: "muniraja.g@quantanxt.com",
    status: "failed",
    lastDelivery: "Last delivery attempt failed",
  },
  {
    id: 2,
    name: "empty",
    usedBy: 1,
    type: "No integrations",
    config: "No integrations configured",
    status: "idle",
  },
  {
    id: 3,
    name: "Loki",
    usedBy: 12,
    type: "Email",
    config: "Secops-team@asplinfo.com",
    status: "failed",
    lastDelivery: "Last delivery attempt failed",
  },
  {
    id: 4,
    name: "Test",
    usedBy: 0,
    type: "Email",
    config: "No delivery attempts",
    status: "idle",
  },
  {
    id: 5,
    name: "Alertmanager",
    usedBy: 0,
    type: "Alertmanager",
    config: "Sends notifications to Alertmanager",
    status: "idle",
    lastDelivery: "No delivery attempts",
  },
  {
    id: 6,
    name: "Zabbix monitoring",
    usedBy: 4,
    type: "Email",
    config: "Secops-team@asplinfo.com",
    status: "failed",
    lastDelivery: "Last delivery attempt failed",
  },
];

const defaultPolicy = {
  id: "default",
  name: "Default policy",
  routes: 0,
  deliveredTo: "empty",
  groupedBy: ["grafana_folder", "alertname"],
  groupWait: "30s",
  groupInterval: "5m",
  repeatInterval: "4h",
};

const timeRanges = [
  { id: "weekdays", label: "Weekdays", start: "09:00", end: "17:00" },
];

// ---------- Subcomponents ----------
const StatusBadge = ({ status }) => {
  const styles = {
    failed: "text-[var(--color-crit)] bg-[var(--color-crit)]/10 border border-[var(--color-crit)]/30",
    idle: "text-[var(--color-muted)] bg-[var(--color-border)]/30 border border-[var(--color-border)]",
    delivered: "text-[var(--color-ok)] bg-[var(--color-ok)]/10 border border-[var(--color-ok)]/30",
  };
  return (
    <span className={`px-2 py-0.5 text-xs rounded-full ${styles[status] || styles.idle}`}>
      {status === "failed" ? "Failed" : status === "delivered" ? "Delivered" : "Idle"}
    </span>
  );
};

// ---------- Modal Components ----------
const NewPolicyModal = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState("");
  const [contactPoint, setContactPoint] = useState("");
  const [groupBy, setGroupBy] = useState(["grafana_folder", "alertname"]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !contactPoint) {
      toast.error("Name and contact point are required");
      return;
    }
    onSave({ name, contactPoint, groupBy });
    toast.success(`Policy "${name}" created`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-[var(--color-text)]">New notification policy</h3>
          <button onClick={onClose} className="text-[var(--color-muted)] hover:text-[var(--color-text)]">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[var(--color-text)] font-medium text-sm mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="A unique name for the routing tree"
              className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-[var(--color-text)] font-medium text-sm mb-1">Default contact point</label>
            <div className="flex gap-2">
              <select
                value={contactPoint}
                onChange={(e) => setContactPoint(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
              >
                <option value="">Choose a contact point</option>
                {contactPoints.map((cp) => (
                  <option key={cp.id} value={cp.name}>{cp.name}</option>
                ))}
              </select>
              <button type="button" className="px-3 py-2 text-sm text-[var(--color-accent)] hover:underline whitespace-nowrap">
                Create a contact point
              </button>
            </div>
          </div>
          <div>
            <label className="block text-[var(--color-text)] font-medium text-sm mb-1">Group by</label>
            <p className="text-xs text-[var(--color-muted)] mb-2">
              Combine multiple alerts into a single notification by grouping them by the same label values.
            </p>
            <div className="flex flex-wrap gap-2">
              {groupBy.map((label) => (
                <span key={label} className="flex items-center gap-1 px-2 py-1 bg-[var(--color-panel-alt)] border border-[var(--color-border)] rounded text-xs">
                  {label}
                  <button
                    type="button"
                    onClick={() => setGroupBy(groupBy.filter((g) => g !== label))}
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
                  if (newLabel) setGroupBy([...groupBy, newLabel]);
                }}
                className="px-2 py-1 text-xs border border-dashed border-[var(--color-border)] rounded text-[var(--color-muted)] hover:text-[var(--color-text)]"
              >
                + Add label
              </button>
            </div>
          </div>
          <div>
            <button type="button" className="text-sm text-[var(--color-accent)] hover:underline">
              Timing options &gt;
            </button>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
            <button type="button" onClick={onClose} className="px-4 py-2 text-[var(--color-muted)] hover:text-[var(--color-text)]">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const NewTimeIntervalModal = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState("");
  const [timeRanges, setTimeRanges] = useState([{ start: "09:00", end: "17:00" }]);
  const [location, setLocation] = useState("");
  const [daysOfWeek, setDaysOfWeek] = useState([]);
  const [daysOfMonth, setDaysOfMonth] = useState("");
  const [months, setMonths] = useState("");
  const [years, setYears] = useState("");

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const toggleDay = (day) => {
    setDaysOfWeek((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const addTimeRange = () => {
    setTimeRanges([...timeRanges, { start: "09:00", end: "17:00" }]);
  };

  const removeTimeRange = (idx) => {
    setTimeRanges(timeRanges.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      toast.error("Name is required");
      return;
    }
    onSave({ name, timeRanges, location, daysOfWeek, daysOfMonth, months, years });
    toast.success(`Time interval "${name}" created`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-[var(--color-text)]">New time interval</h3>
          <button onClick={onClose} className="text-[var(--color-muted)] hover:text-[var(--color-text)]">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[var(--color-text)] font-medium text-sm mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="A unique name for the time interval"
              className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
            />
          </div>

          <div>
            <div className="text-sm font-medium text-[var(--color-text)] mb-2">Time intervals</div>
            <p className="text-xs text-[var(--color-muted)] mb-3">
              A time interval item is a definition for a moment in time. All fields are lists, and at least one list element must be a moment of time will match the field. For an instant of time to match a complete time interval, all fields must match.
            </p>
            {timeRanges.map((tr, idx) => (
              <div key={idx} className="flex items-center gap-3 mb-2">
                <div className="flex items-center gap-2 flex-1">
                  <div>
                    <label className="text-xs text-[var(--color-muted)]">Start time</label>
                    <input
                      type="time"
                      value={tr.start}
                      onChange={(e) => {
                        const updated = [...timeRanges];
                        updated[idx].start = e.target.value;
                        setTimeRanges(updated);
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
                        const updated = [...timeRanges];
                        updated[idx].end = e.target.value;
                        setTimeRanges(updated);
                      }}
                      className="w-28 px-2 py-1 rounded border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] text-sm"
                    />
                  </div>
                </div>
                {timeRanges.length > 1 && (
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
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
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
                    daysOfWeek.includes(day)
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
              value={daysOfMonth}
              onChange={(e) => setDaysOfMonth(e.target.value)}
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
              value={months}
              onChange={(e) => setMonths(e.target.value)}
              placeholder="Example: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12"
              className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-[var(--color-text)] font-medium text-sm mb-1">Years</label>
            <p className="text-xs text-[var(--color-muted)] mb-1">Example: 2021:2022, 2030</p>
            <input
              type="text"
              value={years}
              onChange={(e) => setYears(e.target.value)}
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
              Save time interval
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
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewPolicy, setShowNewPolicy] = useState(false);
  const [showNewTimeInterval, setShowNewTimeInterval] = useState(false);

  const tabs = [
    { id: "contact-points", label: "Contact points" },
    { id: "notification-policies", label: "Notification policies" },
    { id: "templates", label: "Templates" },
    { id: "time-intervals", label: "Time intervals" },
  ];

  const filteredContactPoints = contactPoints.filter((cp) =>
    cp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddContactPoint = () => {
    toast.success("New contact point form would open here");
  };

  const handleEdit = (name) => {
    toast.info(`Editing "${name}"`);
  };

  const handleMore = (name) => {
    toast.info(`More options for "${name}"`);
  };

  const handleNewPolicy = (data) => {
    // In real app, save to state/backend
    console.log("New policy:", data);
  };

  const handleNewTimeInterval = (data) => {
    console.log("New time interval:", data);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Notification configuration</h1>
        <p className="text-sm text-[var(--color-muted)]">
          Manage contact points, notification policies, templates, and time intervals
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-[var(--color-border)]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
              activeTab === tab.id
                ? "border-[var(--color-accent)] text-[var(--color-accent)]"
                : "border-transparent text-[var(--color-muted)] hover:text-[var(--color-text)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
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
            <div className="flex items-center gap-2">
              <button
                onClick={handleAddContactPoint}
                className="flex items-center gap-1 px-3 py-1.5 bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90 transition text-sm"
              >
                <Plus size={14} />
                New contact point
              </button>
              <button className="px-3 py-1.5 border border-[var(--color-border)] text-[var(--color-text)] rounded-lg hover:bg-[var(--color-panel-alt)] transition text-sm">
                Export all
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContactPoints.map((cp) => (
              <div
                key={cp.id}
                className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4 hover:border-[var(--color-accent)] transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[var(--color-text)] font-medium text-sm">{cp.name}</span>
                      {cp.usedBy > 0 && (
                        <span className="text-xs text-[var(--color-muted)] bg-[var(--color-panel-alt)] px-2 py-0.5 rounded-full">
                          Used by {cp.usedBy} alert rules
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[var(--color-muted)] mt-1">{cp.type}</div>
                    <div className="text-xs text-[var(--color-text)] font-mono mt-1">{cp.config}</div>
                    {(cp.status === "failed" || cp.lastDelivery) && (
                      <div className="flex items-center gap-2 mt-1">
                        <StatusBadge status={cp.status} />
                        {cp.lastDelivery && (
                          <span className="text-xs text-[var(--color-faint)]">{cp.lastDelivery}</span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(cp.name)}
                      className="p-1 rounded hover:bg-[var(--color-panel-alt)] text-[var(--color-muted)] hover:text-[var(--color-text)] transition"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleMore(cp.name)}
                      className="p-1 rounded hover:bg-[var(--color-panel-alt)] text-[var(--color-muted)] hover:text-[var(--color-text)] transition"
                    >
                      <MoreVertical size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "notification-policies" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-faint)]" />
                <input
                  type="text"
                  placeholder="Search by matchers"
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-faint)] text-sm focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                />
              </div>
              <select className="px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] text-sm">
                <option>Contact point</option>
                {contactPoints.map((cp) => (
                  <option key={cp.id} value={cp.name}>{cp.name}</option>
                ))}
              </select>
              <select className="px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] text-sm">
                <option>Select policy trees</option>
              </select>
            </div>
            <button
              onClick={() => setShowNewPolicy(true)}
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
                  <span className="text-[var(--color-text)] font-medium">{defaultPolicy.name}</span>
                  <span className="text-xs text-[var(--color-muted)] bg-[var(--color-panel-alt)] px-2 py-0.5 rounded-full">
                    {defaultPolicy.routes} routes
                  </span>
                </div>
                <div className="text-xs text-[var(--color-muted)] mt-1 flex items-center gap-2">
                  <Send size={12} />
                  Delivered to <span className="text-[var(--color-text)]">{defaultPolicy.deliveredTo}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-xs text-[var(--color-muted)] flex items-center gap-1">
                    <Clock size={12} />
                    Grouped by {defaultPolicy.groupedBy.join(", ")}
                  </span>
                  <span className="text-xs text-[var(--color-muted)] flex items-center gap-1">
                    <Clock size={12} />
                    Wait {defaultPolicy.groupWait} to group instances
                  </span>
                  <span className="text-xs text-[var(--color-muted)] flex items-center gap-1">
                    <Clock size={12} />
                    Wait {defaultPolicy.groupInterval} before sending updates
                  </span>
                  <span className="text-xs text-[var(--color-muted)] flex items-center gap-1">
                    <Clock size={12} />
                    Repeated every {defaultPolicy.repeatInterval}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="text-sm text-[var(--color-accent)] hover:underline">+ Add route</button>
                <button className="text-sm text-[var(--color-muted)] hover:text-[var(--color-text)]">More</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "templates" && (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-[var(--color-border)] rounded-lg bg-[var(--color-panel)]">
          <div className="w-16 h-16 rounded-full bg-[var(--color-panel-alt)] border border-[var(--color-border)] flex items-center justify-center mb-4">
            <FileText size={24} className="text-[var(--color-faint)]" />
          </div>
          <h3 className="text-[var(--color-text)] font-medium text-lg">No templates created</h3>
          <p className="text-[var(--color-muted)] text-sm max-w-sm mt-1">
            You haven't created any notification templates yet.
          </p>
          <button
            onClick={() => toast.success("Create template form would open here")}
            className="mt-4 px-4 py-2 bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90 transition"
          >
            Create template
          </button>
        </div>
      )}

      {activeTab === "time-intervals" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[var(--color-muted)]">
              Enter specific time intervals when not to send notifications or freeze notifications for recurring periods of time.
            </p>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 border border-[var(--color-border)] text-[var(--color-text)] rounded-lg hover:bg-[var(--color-panel-alt)] transition text-sm">
                Export all
              </button>
              <button
                onClick={() => setShowNewTimeInterval(true)}
                className="flex items-center gap-1 px-3 py-1.5 bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90 transition text-sm"
              >
                <Plus size={14} />
                New time interval
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center py-16 text-center border border-[var(--color-border)] rounded-lg bg-[var(--color-panel)]">
            <div className="w-16 h-16 rounded-full bg-[var(--color-panel-alt)] border border-[var(--color-border)] flex items-center justify-center mb-4">
              <Calendar size={24} className="text-[var(--color-faint)]" />
            </div>
            <h3 className="text-[var(--color-text)] font-medium text-lg">You haven't created any time intervals yet</h3>
            <button
              onClick={() => setShowNewTimeInterval(true)}
              className="mt-4 px-4 py-2 bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90 transition"
            >
              + New time interval
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <NewPolicyModal
        isOpen={showNewPolicy}
        onClose={() => setShowNewPolicy(false)}
        onSave={handleNewPolicy}
      />
      <NewTimeIntervalModal
        isOpen={showNewTimeInterval}
        onClose={() => setShowNewTimeInterval(false)}
        onSave={handleNewTimeInterval}
      />
    </div>
  );
}