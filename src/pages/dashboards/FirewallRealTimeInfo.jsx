// src/pages/dashboards/FirewallRealTimeInfo.jsx
import { useState } from "react";
import Card from "../../components/common/Card";
import { X, AlertCircle, Clock, ChevronRight } from "lucide-react";

// Mock data
const data = [
  { time: "2026-06-20 02:34:10 PM", status: "OK", info: "Firewall is up", host: "ASPL-HO-FW-01" },
  { time: "2026-06-19 11:18:36 PM", status: "Problem", info: "ICMP timeout", host: "ASPL-HO-FW-01" },
];

// ---- Problem Detail Modal ----
const ProblemDetailModal = ({ isOpen, onClose, row }) => {
  if (!isOpen || !row) return null;

  const isProblem = row.status === "Problem";
  const title = isProblem ? `${row.host} · ${row.info}` : `${row.host} · Health Check`;
  const severity = isProblem ? "High" : "Information";
  const confidence = isProblem ? "94%" : "100%";
  const rootCause = isProblem
    ? `${row.host} is experiencing ICMP timeouts. This may indicate network connectivity issues, firewall rules blocking ICMP, or the device being unreachable.`
    : "All systems are operating normally.";
  const metrics = isProblem
    ? [
        "Packet loss: 100%",
        "Network I/O: 0/0 Mbps (rx/tx)",
        "Last ping response: 0ms"
      ]
    : [
        "Packet loss: 0%",
        "Network I/O: 120/80 Mbps (rx/tx)",
        "Last ping response: 2ms"
      ];
  const recommendation = isProblem
    ? "Check network connectivity, firewall rules, and ensure the device is powered on. Investigate any network outages or configuration changes."
    : "No action required. System is healthy.";

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
          <div className="flex items-center gap-3">
            <AlertCircle size={20} className="text-[var(--color-crit)]" />
            <div>
              <h3 className="text-xl font-bold text-[var(--color-text)]">{title}</h3>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-xs bg-[var(--color-panel-alt)] px-2 py-0.5 rounded border border-[var(--color-border)] text-[var(--color-muted)]">
                  Firewall Info
                </span>
                <span className="text-xs text-[var(--color-muted)]">Host {row.host}</span>
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
            <span className="text-[var(--color-muted)]">As of {row.time}</span>
            <span className="text-xs font-mono text-[var(--color-faint)]">Reference ID FW-{row.host}-001</span>
          </div>

          <div className="bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)] p-4">
            <p className="text-sm text-[var(--color-text)]">
              Live resource snapshot for {row.host}.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-2">
              <h4 className="text-sm font-semibold text-[var(--color-text)] uppercase tracking-wider">Root Cause Analysis</h4>
              <span className="text-xs font-bold text-[var(--color-accent)] bg-[var(--color-accent)]/10 px-2 py-0.5 rounded-full border border-[var(--color-accent)]/20">
                {confidence} CONFIDENCE
              </span>
            </div>
            <p className="text-sm text-[var(--color-text)] leading-relaxed">{rootCause}</p>
            <ul className="mt-3 space-y-1">
              {metrics.map((metric, i) => (
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
              <p className="text-sm text-[var(--color-text)] leading-relaxed">{recommendation}</p>
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

// ---- Main Component ----
export default function FirewallRealTimeInfo({ go }) {
  const [selectedRow, setSelectedRow] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const goBack = () => {
    const parent = localStorage.getItem("parentDashboard") || "Dashboards";
    if (go) go(parent);
  };

  const handleRowClick = (row) => {
    setSelectedRow(row);
    setModalOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 pb-2 border-b border-[var(--color-border)]">
        <button
          onClick={goBack}
          className="text-sm text-[var(--color-accent)] hover:underline flex items-center gap-1"
        >
          ← Back to Firewall Dashboard
        </button>
        <span className="text-sm text-[var(--color-muted)]">|</span>
        <span className="text-sm text-[var(--color-text)] font-medium">Real-time Firewall Info</span>
      </div>

      <h2 className="text-xl font-bold text-[var(--color-text)]">Real-time Firewall Info</h2>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-[var(--color-muted)] text-xs uppercase tracking-wider">
                <th className="py-2 px-3 font-medium">Time</th>
                <th className="py-2 px-3 font-medium">Status</th>
                <th className="py-2 px-3 font-medium">Info</th>
                <th className="py-2 px-3 font-medium">Host</th>
                <th className="py-2 px-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr
                  key={i}
                  onClick={() => handleRowClick(row)}
                  className="border-b border-[var(--color-border)] hover:bg-[var(--color-border)]/10 transition cursor-pointer group"
                >
                  <td className="py-2 px-3 text-[var(--color-text)] text-xs">{row.time}</td>
                  <td className="py-2 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      row.status === "OK" ? "bg-[var(--color-ok)] text-[#06222A]" :
                      "bg-[var(--color-crit)] text-white"
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-[var(--color-text)]">{row.info}</td>
                  <td className="py-2 px-3 text-[var(--color-text)]">{row.host}</td>
                  <td className="py-2 px-3">
                    <button className="text-xs text-[var(--color-accent)] hover:underline flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
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

      <ProblemDetailModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        row={selectedRow}
      />
    </div>
  );
}