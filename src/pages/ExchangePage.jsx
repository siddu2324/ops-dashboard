// src/pages/ExchangePage.jsx
import { useState } from "react";
import { toast } from "react-hot-toast";
import { X, Edit2, Power } from "lucide-react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip
} from "recharts";
import Card from "../components/common/Card";

// Mock data
const applications = [
  { name: "Microsoft Exchange on EASTEXCH01v", status: "Up" },
  { name: "Microsoft Exchange on EASTEXCH02v", status: "Up" },
  { name: "Microsoft Exchange on WESTEXCH01v", status: "Up" },
  { name: "Microsoft Exchange on WESTEXCH02v", status: "Critical" },
];

const appStatusCounts = {
  Up: applications.filter(a => a.status === "Up").length,
  Warning: applications.filter(a => a.status === "Warning").length,
  Down: applications.filter(a => a.status === "Down").length,
  Critical: applications.filter(a => a.status === "Critical").length,
  Unknown: applications.filter(a => a.status === "Unknown").length,
  Other: applications.filter(a => a.status === "Other").length,
};

const hardwareStatusCounts = {
  Up: 39,
  Warning: 9,
  Critical: 5,
  Undefined: 3,
};

const statusColors = {
  Up: "#34D399",
  Warning: "#FBBF24",
  Down: "#F87171",
  Critical: "#F87171",
  Unknown: "#9CA3AF",
  Other: "#6B7280",
  Undefined: "#9CA3AF",
};

// ---- Detail Modal ----
const DetailModal = ({ isOpen, onClose, data, onAcknowledge }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");

  if (!isOpen || !data) return null;

  const isAlert = data.isAlert !== undefined ? data.isAlert : true;
  const isAcknowledged = data.acknowledgedBy === "Acknowledged";
  const displayStatus = isAcknowledged ? "Acknowledged" : (isAlert ? "Triggered" : "Healthy");

  const handleAcknowledge = () => {
    onAcknowledge(data.title);
    toast.success("Alert acknowledged ✓");
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditName(data.title || "");
  };

  const handleSaveEdit = () => {
    if (editName.trim()) {
      data.title = editName;
      toast.success("Alert definition updated");
    }
    setIsEditing(false);
  };

  const handleTurnOff = () => {
    if (window.confirm("Are you sure you want to turn off this alert definition?")) {
      data.isAlert = false;
      data.status = "Disabled";
      toast.success("Alert turned off");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)] bg-[var(--color-bg)] shrink-0">
          <div className="flex items-center gap-3">
            <span className={isAlert ? "text-[var(--color-crit)]" : "text-[var(--color-ok)]"}>
              {isAlert ? "🔴" : "✅"}
            </span>
            <h3 className="text-xl font-bold text-[var(--color-text)]">
              Active Alert Details – {data.title || "Application"}
            </h3>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-xl hover:bg-[var(--color-border)]/10 transition flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-text)]">
            <X size={22} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          <div className="text-base text-[var(--color-text)]">
            Application "<span className="font-semibold">{data.title}</span>" is{" "}
            {isAlert ? data.status?.toLowerCase() : "up"} – Microsoft Exchange
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleAcknowledge}
              disabled={isAcknowledged}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                isAcknowledged
                  ? "bg-[var(--color-ok)] text-[#06222A] cursor-default"
                  : "bg-[var(--color-accent)] text-[#06222A] hover:opacity-90"
              }`}
            >
              {isAcknowledged ? "✔ Acknowledged" : "Acknowledge Alert"}
            </button>
            <button
              onClick={handleEdit}
              className="px-4 py-2 border border-[var(--color-border)] text-[var(--color-text)] rounded-lg hover:bg-[var(--color-panel-alt)] transition flex items-center gap-1"
            >
              <Edit2 size={14} />
              Edit Alert Definition
            </button>
            <button
              onClick={handleTurnOff}
              className="px-4 py-2 border border-[var(--color-border)] text-[var(--color-text)] rounded-lg hover:bg-[var(--color-panel-alt)] transition flex items-center gap-1"
            >
              <Power size={14} />
              Turn Off this alert definition
            </button>
          </div>

          {isEditing && (
            <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl p-4 space-y-2">
              <label className="text-sm text-[var(--color-muted)]">Edit Alert Definition Name</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                />
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90 transition"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-[var(--color-border)] text-[var(--color-muted)] rounded-lg hover:bg-[var(--color-panel-alt)] transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-xl p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-[var(--color-muted)] text-xs uppercase tracking-wider">Current Status</div>
                <div className={`text-lg font-bold ${displayStatus === "Healthy" ? "text-[var(--color-ok)]" : displayStatus === "Acknowledged" ? "text-[var(--color-accent)]" : "text-[var(--color-crit)]"}`}>
                  {displayStatus}
                </div>
              </div>
              <div>
                <div className="text-[var(--color-muted)] text-xs uppercase tracking-wider">Active Time</div>
                <div className="text-lg font-bold text-[var(--color-text)]">
                  {data.activeTime || "N/A"}
                </div>
              </div>
              <div>
                <div className="text-[var(--color-muted)] text-xs uppercase tracking-wider">Severity</div>
                <div className={`text-lg font-bold ${
                  data.severity === "Critical" ? "text-[var(--color-crit)]" :
                  data.severity === "Warning" ? "text-[var(--color-warn)]" :
                  data.severity === "High" ? "text-[var(--color-crit)]" :
                  "text-[var(--color-ok)]"
                }`}>
                  {data.severity || "Information"}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-xl p-4">
            <div className="text-[var(--color-muted)] text-xs uppercase tracking-wider mb-1">Message</div>
            <p className="text-[var(--color-text)]">{data.message || "Alert message"}</p>
          </div>

          <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-xl p-4">
            <div className="text-[var(--color-muted)] text-xs uppercase tracking-wider mb-2">More Details</div>
            <div className="space-y-1 text-sm">
              <div className="flex flex-wrap gap-2">
                <span className="text-[var(--color-muted)] w-36">Trigger time:</span>
                <span className="text-[var(--color-text)]">{data.triggerTime || "N/A"}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="text-[var(--color-muted)] w-36">Triggered by:</span>
                <span className="text-[var(--color-text)]">{data.triggeredBy || "Unknown"}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="text-[var(--color-muted)] w-36">Alert Definition:</span>
                <span className="text-[var(--color-text)]">{data.alertDefinition || "Alert"}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="text-[var(--color-muted)] w-36">Escalation:</span>
                <span className="text-[var(--color-text)]">{data.escalation || "Level 1"}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="text-[var(--color-muted)] w-36">Acknowledged by:</span>
                <span className="text-[var(--color-text)]">
                  {data.acknowledgedBy || "Not yet..."}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="text-[var(--color-muted)] w-36">Acknowledge:</span>
                <button
                  onClick={handleAcknowledge}
                  disabled={isAcknowledged}
                  className={`text-[var(--color-accent)] hover:underline ${isAcknowledged ? "opacity-50 cursor-default" : ""}`}
                >
                  {isAcknowledged ? "✔ Acknowledged" : "Acknowledge"}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-xl p-4">
            <div className="text-[var(--color-muted)] text-xs uppercase tracking-wider mb-1">Alert Definition Details</div>
            <p className="text-sm text-[var(--color-text)]">HELP – Contact administrator for details.</p>
          </div>
        </div>

        <div className="flex items-center justify-end p-4 border-t border-[var(--color-border)] bg-[var(--color-bg)] shrink-0 px-6">
          <button onClick={onClose} className="px-6 py-2 text-sm bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90 transition shadow-lg shadow-[var(--color-accent)]/20">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ---- Main Component ----
export default function ExchangePage({ go }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [acknowledgedApps, setAcknowledgedApps] = useState(new Set());

  const handleHelp = () => {
    toast.info("Help: Contact administrator for Exchange support.");
  };

  const handleAcknowledge = (appName) => {
    setAcknowledgedApps(prev => new Set(prev).add(appName));
    setModalData(prev => ({
      ...prev,
      acknowledgedBy: "Acknowledged",
      status: "Acknowledged",
    }));
  };

  // ✅ Updated handleRowClick with early return for Up status
  const handleRowClick = (app) => {
    if (app.status === "Up") {
      toast.info(`${app.name} is healthy. No details available.`);
      return;
    }

    // Rest of the function as before (only for non‑Up statuses)
    const isHealthy = false; // since we already know it's not Up
    const severity = app.status === "Critical" ? "Critical" :
                     app.status === "Warning" ? "Warning" :
                     app.status === "Down" ? "High" : "Information";

    const isAcknowledged = acknowledgedApps.has(app.name);
    const acknowledgedBy = isAcknowledged ? "Acknowledged" : "Not yet...";

    const data = {
      title: app.name,
      status: isAcknowledged ? "Acknowledged" : app.status,
      severity: severity,
      activeTime: `${Math.floor(Math.random() * 100) + 1}d ${Math.floor(Math.random() * 24)}h`,
      message: `Application "${app.name}" is ${app.status.toLowerCase()}`,
      triggerTime: new Date(Date.now() - Math.random() * 86400000 * 30).toLocaleString(),
      triggeredBy: "Microsoft Exchange",
      escalation: "Level 1",
      acknowledgedBy: acknowledgedBy,
      alertDefinition: `Alert: ${app.name} is ${app.status.toLowerCase()}`,
      isAlert: true,
    };
    setModalData(data);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalData(null);
  };

  const statusColor = {
    Up: "bg-[var(--color-ok)] text-[#06222A]",
    Warning: "bg-[var(--color-warn)] text-[#06222A]",
    Down: "bg-[var(--color-crit)] text-white",
    Critical: "bg-[var(--color-crit)] text-white",
    Unknown: "bg-[var(--color-faint)] text-white",
    Other: "bg-[var(--color-border)] text-[var(--color-muted)]",
  };

  const appChartData = [
    { name: "Up", value: appStatusCounts.Up },
    { name: "Warning", value: appStatusCounts.Warning },
    { name: "Down", value: appStatusCounts.Down },
    { name: "Critical", value: appStatusCounts.Critical },
    { name: "Unknown", value: appStatusCounts.Unknown },
    { name: "Other", value: appStatusCounts.Other },
  ].filter(d => d.value > 0);

  const hardwareChartData = [
    { name: "Up", value: hardwareStatusCounts.Up },
    { name: "Warning", value: hardwareStatusCounts.Warning },
    { name: "Critical", value: hardwareStatusCounts.Critical },
    { name: "Undefined", value: hardwareStatusCounts.Undefined },
  ].filter(d => d.value > 0);

  const problems = applications.filter(a => a.status !== "Up");

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Exchange Application Summary</h1>
          <p className="text-sm text-[var(--color-muted)]">
            {new Date().toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <button
          onClick={handleHelp}
          className="px-3 py-1.5 text-sm border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-panel-alt)] transition text-[var(--color-muted)] hover:text-[var(--color-text)]"
        >
          Help
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="Application Health Overview">
          <div className="flex items-center gap-4">
            <div className="flex-1 space-y-1 text-sm">
              <div className="text-[var(--color-muted)]">Application Count: {applications.length}</div>
              <div className="flex flex-wrap gap-2">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[var(--color-ok)]"></span> Up {appStatusCounts.Up}</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[var(--color-warn)]"></span> Warning {appStatusCounts.Warning}</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[var(--color-crit)]"></span> Down {appStatusCounts.Down}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[var(--color-crit)]"></span> Critical {appStatusCounts.Critical}</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[var(--color-faint)]"></span> Unknown {appStatusCounts.Unknown}</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[var(--color-border)]"></span> Other {appStatusCounts.Other}</span>
              </div>
            </div>
            <div style={{ width: 120, height: 120 }} className="shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={appChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={50}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {appChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={statusColors[entry.name] || "#6B7280"} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-panel)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "6px",
                      fontSize: "10px",
                      color: "var(--color-text)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        <Card title="Hardware Health Overview">
          <div className="flex items-center gap-4">
            <div className="flex-1 space-y-1 text-sm">
              <div className="text-[var(--color-muted)]">Nodes Count: 56</div>
              <div className="flex flex-wrap gap-2">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[var(--color-ok)]"></span> Up {hardwareStatusCounts.Up}</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[var(--color-warn)]"></span> Warning {hardwareStatusCounts.Warning}</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[var(--color-crit)]"></span> Critical {hardwareStatusCounts.Critical}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[var(--color-faint)]"></span> Undefined {hardwareStatusCounts.Undefined}</span>
              </div>
            </div>
            <div style={{ width: 120, height: 120 }} className="shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={hardwareChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={50}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {hardwareChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={statusColors[entry.name] || "#6B7280"} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-panel)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "6px",
                      fontSize: "10px",
                      color: "var(--color-text)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      </div>

      <Card title="All Applications">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-[var(--color-muted)] text-xs uppercase tracking-wider">
                <th className="py-2 px-3 font-medium">Application Name</th>
                <th className="py-2 px-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr
                  key={app.name}
                  onClick={() => handleRowClick(app)}
                  className="border-b border-[var(--color-border)] hover:bg-[var(--color-panel-alt)] transition cursor-pointer"
                >
                  <td className="py-2 px-3 text-[var(--color-text)]">{app.name}</td>
                  <td className="py-2 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[app.status] || statusColor.Other}`}>
                      {app.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Applications with Problems">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-[var(--color-muted)] text-xs uppercase tracking-wider">
                <th className="py-2 px-3 font-medium">Application Name</th>
                <th className="py-2 px-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {problems.length === 0 ? (
                <tr>
                  <td colSpan="2" className="text-center py-4 text-[var(--color-muted)]">All applications are healthy.</td>
                </tr>
              ) : (
                problems.map((app) => (
                  <tr
                    key={app.name}
                    onClick={() => handleRowClick(app)}
                    className="border-b border-[var(--color-border)] hover:bg-[var(--color-panel-alt)] transition cursor-pointer"
                  >
                    <td className="py-2 px-3 text-[var(--color-text)]">{app.name}</td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[app.status] || statusColor.Other}`}>
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <DetailModal
        isOpen={modalOpen}
        onClose={closeModal}
        data={modalData}
        onAcknowledge={handleAcknowledge}
      />
    </div>
  );
}