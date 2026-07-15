// src/pages/dashboards/FirewallDashboard.jsx
import { useState } from "react";
import Card from "../../components/common/Card";
import { X, Clock, AlertCircle, ChevronRight } from "lucide-react";
import { toast } from "react-hot-toast";

// ---- Mock stats ----
const hostAvailability = {
  available: 0,
  notAvailable: 1,
  mixed: 0,
  unknown: 3,
};

const problemHosts = {
  withoutProblems: 0,
  withProblems: 4,
  total: 4,
};

const severityCounts = {
  Critical: 0,
  High: 3,
  Medium: 7,
  Low: 2,
  Information: 1,
  "Not classified": 0,
};

// ---- Base problems data ----
// Durations are now hour‑only and always > 10 hours.
const baseProblemsData = [
  {
    id: 1,
    time: "2026-06-20 02:34:10 PM",
    recoveryTime: "",
    status: "PROBLEM",
    info: "",
    host: "ASPL-HO-FW-01",
    problem: "Unavailable by ICMP ping",
    duration: "13h",           // was "5d 12h"
    update: "Update",
    actions: "",
  },
  {
    id: 2,
    time: "2026-06-19 11:18:36 PM",
    recoveryTime: "",
    status: "PROBLEM",
    info: "",
    host: "ASPL-HO-FW-01_TEST_DM",
    problem: "Unavailable by ICMP ping",
    duration: "14h",           // was "8d 3h"
    update: "Update",
    actions: "",
  },
  {
    id: 3,
    time: "2026-06-19 11:18:36 PM",
    recoveryTime: "",
    status: "PROBLEM",
    info: "",
    host: "ASPL-HO-FW-01_TEST_DM",
    problem: "WebServer Protection license reg status",
    duration: "15h",           // was "14d 9h"
    update: "Update",
    actions: "",
  },
  {
    id: 4,
    time: "2026-03-17 10:45:36 AM",
    recoveryTime: "",
    status: "PROBLEM",
    info: "",
    host: "ASPL-HO-FW-01_TEST_DM",
    problem: "Web Protection license reg status",
    duration: "16h",           // was "20d 1h"
    update: "Update",
    actions: "",
  },
];

// ---- Generate detail for each problem ----
const generateProblemDetail = (problem, hostname) => {
  const detailMap = {
    "Unavailable by ICMP ping": {
      title: `${hostname} · unreachable`,
      source: "Infrastructure",
      host: hostname,
      service: "Firewall",
      referenceId: `FW-${hostname}-${problem.id}`,
      ip: "10.2.1.1",
      confidence: "94%",
      rootCause: `${hostname} is under elevated network unreachability (100%). This has crossed the critical threshold (85%) and is likely impacting network traffic.`,
      metrics: [
        "Packet loss 100%",
        "Network I/O 0/0 Mbps (rx/tx)",
        "Last ping response 0ms"
      ],
      recommendation: "Check network connectivity, firewall rules, and ensure the firewall is powered on. Investigate any network outages or configuration changes."
    },
    "WebServer Protection license reg status": {
      title: `${hostname} · license issue`,
      source: "Security",
      host: hostname,
      service: "WebServer Protection",
      referenceId: `FW-${hostname}-${problem.id}`,
      ip: "10.2.1.1",
      confidence: "82%",
      rootCause: `${hostname} has a license registration issue. WebServer Protection may be degraded.`,
      metrics: [
        "License status: Expired",
        "Last successful registration: 30 days ago",
        "Protection level: Partial"
      ],
      recommendation: "Renew the license for WebServer Protection. Verify registration and restart the service."
    },
    "Web Protection license reg status": {
      title: `${hostname} · web protection license`,
      source: "Security",
      host: hostname,
      service: "Web Protection",
      referenceId: `FW-${hostname}-${problem.id}`,
      ip: "10.2.1.1",
      confidence: "78%",
      rootCause: `${hostname} has a web protection license issue. Web filtering may be impacted.`,
      metrics: [
        "License status: Expired",
        "Last successful update: 45 days ago",
        "Protection level: Limited"
      ],
      recommendation: "Renew the web protection license. Update the license key and restart the web protection service."
    }
  };

  let detail = null;
  for (const [key, value] of Object.entries(detailMap)) {
    if (problem.problem.includes(key)) {
      detail = value;
      break;
    }
  }
  if (!detail) {
    detail = {
      title: `${hostname} · ${problem.problem}`,
      source: "Infrastructure",
      host: hostname,
      service: "Firewall",
      referenceId: `FW-${hostname}-${problem.id}`,
      ip: "10.2.1.1",
      confidence: "70%",
      rootCause: `${hostname} is experiencing an issue: ${problem.problem}. This may affect network operations.`,
      metrics: [
        "Issue detected",
        "Check logs for details",
        "Investigate further"
      ],
      recommendation: "Review firewall logs and configuration. Take corrective action as needed."
    };
  }
  return { ...problem, detail };
};

// ---- Problem Detail Modal ----
const ProblemDetailModal = ({ isOpen, onClose, problem }) => {
  if (!isOpen || !problem) return null;

  const { detail } = problem;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
          <div className="flex items-center gap-3">
            <AlertCircle size={20} className="text-[var(--color-crit)]" />
            <div>
              <h3 className="text-xl font-bold text-[var(--color-text)]">{detail.title}</h3>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-xs bg-[var(--color-panel-alt)] px-2 py-0.5 rounded border border-[var(--color-border)] text-[var(--color-muted)]">
                  {detail.source}
                </span>
                <span className="text-xs text-[var(--color-muted)]">Host {detail.host}</span>
                <span className="text-xs text-[var(--color-muted)]">Service {detail.service}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl hover:bg-[var(--color-border)]/10 transition flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-text)]"
          >
            <X size={22} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <span className="text-[var(--color-muted)]">As of {new Date().toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
            <span className="text-xs font-mono text-[var(--color-faint)]">Reference ID {detail.referenceId}</span>
          </div>

          <div className="bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)] p-4">
            <p className="text-sm text-[var(--color-text)]">
              Live resource snapshot for {detail.host} ({detail.ip}).
            </p>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-2">
              <h4 className="text-sm font-semibold text-[var(--color-text)] uppercase tracking-wider">Root Cause Analysis</h4>
              <span className="text-xs font-bold text-[var(--color-accent)] bg-[var(--color-accent)]/10 px-2 py-0.5 rounded-full border border-[var(--color-accent)]/20">
                {detail.confidence} CONFIDENCE
              </span>
            </div>
            <p className="text-sm text-[var(--color-text)] leading-relaxed">{detail.rootCause}</p>
            <ul className="mt-3 space-y-1">
              {detail.metrics.map((metric, i) => (
                <li key={i} className="text-sm text-[var(--color-muted)] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]"></span>
                  {metric}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[var(--color-text)] uppercase tracking-wider mb-2">Recommended Action</h4>
            <div className="bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)] p-4">
              <p className="text-sm text-[var(--color-text)] leading-relaxed">{detail.recommendation}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-4 border-t border-[var(--color-border)] bg-[var(--color-bg)] px-6">
          <button
            onClick={() => alert('Marked as reviewed')}
            className="px-4 py-2 text-sm border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-border)]/10 transition text-[var(--color-text)]"
          >
            Mark reviewed
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90 transition shadow-lg shadow-[var(--color-accent)]/20"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ---- Update Problem Modal ----
const UpdateProblemModal = ({ isOpen, onClose, problem, onUpdate }) => {
  const [severity, setSeverity] = useState("Not classified");
  const [suppress, setSuppress] = useState("Indefinitely");
  const [unsuppress, setUnsuppress] = useState("Indefinitely");
  const [acknowledge, setAcknowledge] = useState("Indefinitely");
  const [convertToCause, setConvertToCause] = useState("Indefinitely");
  const [closeProblem, setCloseProblem] = useState("Indefinitely");
  const [message, setMessage] = useState("");
  const [scope, setScope] = useState("selected");

  if (!isOpen || !problem) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const hasAction = severity !== "Not classified" ||
                      suppress !== "Indefinitely" ||
                      unsuppress !== "Indefinitely" ||
                      acknowledge !== "Indefinitely" ||
                      convertToCause !== "Indefinitely" ||
                      closeProblem !== "Indefinitely" ||
                      message.trim() !== "";
    if (!hasAction) {
      toast.error("At least one update operation or message must exist.");
      return;
    }
    onUpdate({
      problemId: problem.id,
      severity,
      suppress,
      unsuppress,
      acknowledge,
      convertToCause,
      closeProblem,
      message,
      scope,
    });
    toast.success("Problem updated successfully!");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
      <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
          <h3 className="text-xl font-bold text-[var(--color-text)]">Update problem</h3>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl hover:bg-[var(--color-border)]/10 transition flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-text)]"
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-muted)]">Problem</label>
            <div className="mt-1 text-sm text-[var(--color-text)] font-mono bg-[var(--color-bg)] p-2 rounded border border-[var(--color-border)]">
              {problem.problem}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-muted)]">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
              rows="2"
              placeholder="Optional message"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-muted)]">History</label>
            <div className="mt-1 text-xs text-[var(--color-faint)] bg-[var(--color-bg)] p-2 rounded border border-[var(--color-border)]">
              <div>Time: {problem.time}</div>
              <div>User: admin</div>
              <div>User action: —</div>
              <div>Message: —</div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-muted)]">Scope</label>
            <select
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
            >
              <option value="selected">Only selected problem</option>
              <option value="related">Selected and all other problems of related triggers 1 event</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-muted)]">Change severity</label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
            >
              <option value="Not classified">Not classified</option>
              <option value="Information">Information</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[var(--color-muted)]">Suppress</label>
              <select
                value={suppress}
                onChange={(e) => setSuppress(e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
              >
                <option value="Indefinitely">Indefinitely</option>
                <option value="Until">Until</option>
                <option value="now+1d">now+1d</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-muted)]">Unsuppress</label>
              <select
                value={unsuppress}
                onChange={(e) => setUnsuppress(e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
              >
                <option value="Indefinitely">Indefinitely</option>
                <option value="Until">Until</option>
                <option value="now+1d">now+1d</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-muted)]">Acknowledge</label>
              <select
                value={acknowledge}
                onChange={(e) => setAcknowledge(e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
              >
                <option value="Indefinitely">Indefinitely</option>
                <option value="Until">Until</option>
                <option value="now+1d">now+1d</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-muted)]">Convert to cause</label>
              <select
                value={convertToCause}
                onChange={(e) => setConvertToCause(e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
              >
                <option value="Indefinitely">Indefinitely</option>
                <option value="Until">Until</option>
                <option value="now+1d">now+1d</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-[var(--color-muted)]">Close problem</label>
              <select
                value={closeProblem}
                onChange={(e) => setCloseProblem(e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
              >
                <option value="Indefinitely">Indefinitely</option>
                <option value="Until">Until</option>
                <option value="now+1d">now+1d</option>
              </select>
            </div>
          </div>

          <div className="text-xs text-[var(--color-muted)] italic">
            At least one update operation or message must exist.
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90 transition shadow-lg shadow-[var(--color-accent)]/20"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ---- Main FirewallDashboard ----
export default function FirewallDashboard({ go }) {
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [updateProblem, setUpdateProblem] = useState(null);

  const severityColors = {
    Critical: "bg-[var(--color-crit)] text-white",
    High: "bg-[var(--color-crit)]/80 text-white",
    Medium: "bg-[var(--color-warn)] text-[#06222A]",
    Low: "bg-[var(--color-ok)] text-[#06222A]",
    Information: "bg-[var(--color-accent)] text-[#06222A]",
    "Not classified": "bg-[var(--color-border)] text-[var(--color-muted)]",
  };

  const handleNavigate = (page) => {
    if (go) {
      localStorage.setItem("parentDashboard", "Firewall Dashboard");
      go(page);
    }
  };

  const handleRowClick = (problem) => {
    if (!problem.detail) {
      const enriched = generateProblemDetail(problem, problem.host);
      setSelectedProblem(enriched);
    } else {
      setSelectedProblem(problem);
    }
  };

  const closeDetail = () => {
    setSelectedProblem(null);
  };

  const handleUpdateClick = (problem) => {
    setUpdateProblem(problem);
  };

  const closeUpdate = () => {
    setUpdateProblem(null);
  };

  const handleUpdateSubmit = (data) => {
    console.log("Update data:", data);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-[var(--color-text)]">Firewall Dashboard</h2>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <Card title="Problem">
            <div className="space-y-2">
              <div
                className="text-[var(--color-text)] hover:text-[var(--color-accent)] cursor-pointer transition"
                onClick={() => handleNavigate("Real-time_Firewall info")}
              >
                Real-time_Firewall info
              </div>
              <div
                className="text-[var(--color-text)] hover:text-[var(--color-accent)] cursor-pointer transition"
                onClick={() => handleNavigate("Real-time_Firewall Interface status")}
              >
                Real-time_Firewall Interface status
              </div>
              <div
                className="text-[var(--color-text)] hover:text-[var(--color-accent)] cursor-pointer transition"
                onClick={() => handleNavigate("Real-time_Firewall Service")}
              >
                Real-time_Firewall Service
              </div>
              <div
                className="text-[var(--color-text)] hover:text-[var(--color-accent)] cursor-pointer transition"
                onClick={() => handleNavigate("Firewall_Historical Performance")}
              >
                Firewall_Historical Performance
              </div>
            </div>
          </Card>

          <Card title="Host availability">
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--color-muted)]">Available</span>
                <span className="text-[var(--color-ok)]">{hostAvailability.available}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-muted)]">Not available</span>
                <span className="text-[var(--color-crit)]">{hostAvailability.notAvailable}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-muted)]">Mixed</span>
                <span className="text-[var(--color-warn)]">{hostAvailability.mixed}</span>
              </div>
              <div className="flex justify-between border-t border-[var(--color-border)] pt-1 mt-1">
                <span className="text-[var(--color-muted)]">Unknown</span>
                <span className="text-[var(--color-faint)]">{hostAvailability.unknown}</span>
              </div>
            </div>
          </Card>

          <Card title="Problem hosts">
            <div className="space-y-1 text-sm">
              <div className="text-[var(--color-muted)]">Host group: Firewall</div>
              <div className="flex justify-between">
                <span className="text-[var(--color-muted)]">Without problems</span>
                <span className="text-[var(--color-ok)]">{problemHosts.withoutProblems}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-muted)]">With problems</span>
                <span className="text-[var(--color-crit)]">{problemHosts.withProblems}</span>
              </div>
              <div className="flex justify-between border-t border-[var(--color-border)] pt-1 mt-1">
                <span className="text-[var(--color-text)] font-medium">Total</span>
                <span className="text-[var(--color-text)] font-medium">{problemHosts.total}</span>
              </div>
            </div>
          </Card>

          <Card title="Problems by severity">
            <div className="space-y-1 text-sm">
              {Object.entries(severityCounts).map(([severity, count]) => (
                <div key={severity} className="flex justify-between items-center">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${severityColors[severity] || severityColors["Not classified"]}`}>
                    {severity}
                  </span>
                  <span className="text-[var(--color-text)] font-mono">{count}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right content – Problems table */}
        <div className="lg:col-span-3">
          <Card title="Problems">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-border)] text-[var(--color-muted)] text-xs uppercase tracking-wider">
                    <th className="py-2 px-3 font-medium">Time</th>
                    <th className="py-2 px-3 font-medium">Recovery time</th>
                    <th className="py-2 px-3 font-medium">Status</th>
                    <th className="py-2 px-3 font-medium">Info</th>
                    <th className="py-2 px-3 font-medium">Host</th>
                    <th className="py-2 px-3 font-medium">Problem</th>
                    <th className="py-2 px-3 font-medium">Duration</th>
                    <th className="py-2 px-3 font-medium">Update</th>
                    <th className="py-2 px-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {baseProblemsData.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-[var(--color-border)] hover:bg-[var(--color-border)]/10 transition group"
                    >
                      <td className="py-2 px-3 text-[var(--color-text)] text-xs">{row.time}</td>
                      <td className="py-2 px-3 text-[var(--color-faint)] text-xs">{row.recoveryTime || "—"}</td>
                      <td className="py-2 px-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--color-crit)] text-white">
                          {row.status}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-[var(--color-muted)] text-xs">{row.info || "—"}</td>
                      <td className="py-2 px-3 text-[var(--color-text)]">{row.host}</td>
                      <td className="py-2 px-3 text-[var(--color-text)]">{row.problem}</td>
                      <td className="py-2 px-3 text-[var(--color-faint)] text-xs">{row.duration}</td>
                      <td className="py-2 px-3">
                        <button
                          onClick={() => handleUpdateClick(row)}
                          className="text-xs text-[var(--color-accent)] hover:underline"
                        >
                          {row.update}
                        </button>
                      </td>
                      <td className="py-2 px-3">
                        <button
                          onClick={() => handleRowClick(row)}
                          className="text-xs text-[var(--color-accent)] hover:underline flex items-center gap-1 opacity-0 group-hover:opacity-100 transition"
                        >
                          <ChevronRight size={12} />
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>

      {/* Detail Modal */}
      <ProblemDetailModal
        isOpen={!!selectedProblem}
        onClose={closeDetail}
        problem={selectedProblem}
      />

      {/* Update Modal */}
      <UpdateProblemModal
        isOpen={!!updateProblem}
        onClose={closeUpdate}
        problem={updateProblem}
        onUpdate={handleUpdateSubmit}
      />
    </div>
  );
}