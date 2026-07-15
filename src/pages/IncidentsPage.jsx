// src/pages/IncidentsPage.jsx
import { useState } from "react";
import { useAlerts } from "../context/AlertContext";
import { serverInventory } from "../data/servers";
import { defaultDashboards } from "../data/defaultDashboards";
import Card from "../components/common/Card";
import { Clock, AlertCircle, ChevronRight, Download, X } from "lucide-react";
import { exportToCSV } from "../utils/exportCSV";

// Helper to generate problem based on server status and report type
const generateProblemForHost = (hostname, status, statusData, reportType) => {
  const severityMap = { down: "Critical", warning: "Warning", up: "Information" };
  const problemMap = {
    down: `${hostname} is unreachable`,
    warning: `${hostname} has high resource usage`,
    up: `${hostname} is healthy`
  };
  const severity = severityMap[status] || "Information";
  const problemText = problemMap[status] || `${hostname} is healthy`;

  const randomDuration = () => {
    const totalHours = Math.floor(Math.random() * 72) + 1;
    if (totalHours < 24) return `${totalHours}h`;
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    return hours === 0 ? `${days}d` : `${days}d ${hours}h`;
  };

  return {
    id: `incident-${hostname}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    time: new Date(Date.now() - Math.random() * 86400000 * 10).toISOString().replace('T', ' ').slice(0, 19),
    status: status === "up" ? "OK" : "PROBLEM",
    severity: severity,
    info: problemText,
    host: hostname,
    problem: problemText,
    duration: status === "up" ? "No issues" : randomDuration(),
    reportType: reportType,
    detail: {
      title: `${hostname} · ${problemText}`,
      source: "Infrastructure",
      host: hostname,
      service: reportType.includes("Linux") ? "Ubuntu Linux" : "Windows Server 2022",
      referenceId: `SRV-${hostname}-${Date.now()}`,
      ip: serverInventory.find(s => s.hostname === hostname)?.ip || "N/A",
      confidence: status === "down" ? "94%" : status === "warning" ? "72%" : "100%",
      rootCause: status === "down"
        ? `${hostname} is under elevated network unreachability (100%). This has crossed the critical threshold (85%) and is likely impacting workloads scheduled on this host.`
        : status === "warning"
        ? `${hostname} is experiencing high resource usage (${statusData?.metrics?.cpu || 0}% CPU, ${statusData?.metrics?.memory || 0}% Memory). This may affect application performance.`
        : `${hostname} is operating normally.`,
      metrics: [
        `Status: ${status}`,
        `CPU: ${statusData?.metrics?.cpu || 0}%`,
        `Memory: ${statusData?.metrics?.memory || 0}%`,
        `Disk: ${statusData?.metrics?.disk || 0}%`,
      ],
      recommendation: status === "down"
        ? "Check network connectivity, firewall rules, and ensure the host is powered on. Investigate any network outages or configuration changes."
        : status === "warning"
        ? "Investigate processes consuming resources. Consider scaling resources or optimizing application code."
        : "No action required. System is healthy."
    }
  };
};

// ---- Detail Modal (kept but not opened from row click) ----
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

        <div className="flex items-center justify-between p-4 border-t border-[var(--color-border)] bg-[var(--color-bg)] px-6">
          <div className="text-xs text-[var(--color-muted)]">
            Report: {problem.reportType}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                // Navigate to the dashboard
                const dashboardName = problem.reportType;
                let found = defaultDashboards.find(d => d.name === dashboardName);
                if (!found) {
                  found = defaultDashboards.find(d => d.name.toLowerCase() === dashboardName.toLowerCase());
                }
                if (!found) {
                  const parts = dashboardName.split(' - ');
                  const baseName = parts[0];
                  found = defaultDashboards.find(d => d.name.includes(baseName) || baseName.includes(d.name));
                }
                if (found) {
                  localStorage.setItem("selectedDashboard", String(found.id));
                  onClose();
                  // Use go function if available – but we don't have go here. We'll rely on parent to pass go.
                } else {
                  alert(`Dashboard "${dashboardName}" not found.`);
                }
              }}
              className="px-4 py-2 text-sm border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-border)]/10 transition text-[var(--color-text)]"
            >
              Go to Dashboard
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
    </div>
  );
};

export default function IncidentsPage({ go }) {
  const { serverStatuses } = useAlerts();
  const [selectedProblem, setSelectedProblem] = useState(null);

  // Collect all problems from all servers across all report types
  const getAllProblems = () => {
    const allProblems = [];

    Object.entries(serverStatuses).forEach(([hostname, data]) => {
      const status = data.status || "up";
      // Only include problems (not "up")
      if (status !== "up") {
        const server = serverInventory.find(s => s.hostname === hostname);
        let reportType = "CPU Load Report"; // fallback
        if (server) {
          const isLinux = server.os && (server.os.includes("Linux") || server.os.includes("Ubuntu"));
          // Determine the correct report type based on the server's OS
          if (data.metrics?.cpu !== undefined) {
            reportType = isLinux ? "CPU Load Report - Linux" : "CPU Load Report - Windows";
          } else if (data.metrics?.memory !== undefined) {
            reportType = isLinux ? "Memory Utilization Report - Linux" : "Memory Utilization Report - Windows";
          } else if (data.metrics?.disk !== undefined) {
            reportType = isLinux ? 'Disk Utilization Report - Linux' : 'Disk Utilization Report - Windows';
          }
        }
        const problem = generateProblemForHost(hostname, status, data, reportType);
        allProblems.push(problem);
      }
    });

    return allProblems;
  };

  const allProblems = getAllProblems();

  // ✅ Updated handleRowClick – stores data and navigates instead of opening modal
  const handleRowClick = (problem) => {
    if (problem.status === "OK") {
      alert(`${problem.host} is healthy. No problems.`);
      return;
    }

    // Store the problem data in localStorage so the dashboard can read it
    localStorage.setItem("selectedProblemData", JSON.stringify({
      hostname: problem.host,
      problem: problem.problem,
      severity: problem.severity,
      time: problem.time,
      duration: problem.duration,
      detail: problem.detail,
    }));

    const dashboardName = problem.reportType;

    // Find the dashboard
    let found = defaultDashboards.find(d => d.name === dashboardName);
    if (!found) {
      found = defaultDashboards.find(d => d.name.toLowerCase() === dashboardName.toLowerCase());
    }
    if (!found) {
      const parts = dashboardName.split(' - ');
      const baseName = parts[0];
      found = defaultDashboards.find(d => d.name.includes(baseName) || baseName.includes(d.name));
    }

    if (found) {
      localStorage.setItem("selectedDashboard", String(found.id));
      if (go) go("DashboardView");
    } else {
      alert(`Dashboard "${dashboardName}" not found.`);
    }
  };

  const closeModal = () => {
    setSelectedProblem(null);
  };

  // Export to CSV
  const handleExportCSV = () => {
    const exportData = allProblems.map((p) => ({
      Time: p.time,
      Status: p.status,
      Severity: p.severity,
      Host: p.host,
      Problem: p.problem,
      Duration: p.duration,
      "Report Type": p.reportType || "N/A",
    }));
    exportToCSV(exportData, "Incidents_Report.csv");
  };

  const severityColors = {
    Critical: "bg-[var(--color-crit)] text-white",
    High: "bg-[var(--color-crit)]/80 text-white",
    Medium: "bg-[var(--color-warn)] text-[#06222A]",
    Low: "bg-[var(--color-ok)] text-[#06222A]",
    Information: "bg-[var(--color-accent)] text-[#06222A]",
  };

  const statusCounts = {
    Critical: allProblems.filter(p => p.severity === "Critical").length,
    High: allProblems.filter(p => p.severity === "High").length,
    Medium: allProblems.filter(p => p.severity === "Medium").length,
    Low: allProblems.filter(p => p.severity === "Low").length,
    Information: allProblems.filter(p => p.severity === "Information").length,
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Incidents</h1>
          <p className="text-sm text-[var(--color-muted)]">
            All problems from Top 10 reports • {allProblems.length} active incidents
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 text-sm bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-80 transition flex items-center gap-2"
          >
            <Download size={14} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-3 text-center">
          <p className="text-xs text-[var(--color-muted)]">Total</p>
          <p className="text-2xl font-bold text-[var(--color-text)]">{allProblems.length}</p>
        </div>
        <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-3 text-center">
          <p className="text-xs text-[var(--color-muted)] text-[var(--color-crit)]">Critical</p>
          <p className="text-2xl font-bold text-[var(--color-crit)]">{statusCounts.Critical}</p>
        </div>
        <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-3 text-center">
          <p className="text-xs text-[var(--color-muted)] text-[var(--color-crit)]/80">High</p>
          <p className="text-2xl font-bold text-[var(--color-crit)]/80">{statusCounts.High}</p>
        </div>
        <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-3 text-center">
          <p className="text-xs text-[var(--color-muted)] text-[var(--color-warn)]">Medium</p>
          <p className="text-2xl font-bold text-[var(--color-warn)]">{statusCounts.Medium}</p>
        </div>
        <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-3 text-center">
          <p className="text-xs text-[var(--color-muted)] text-[var(--color-ok)]">Low</p>
          <p className="text-2xl font-bold text-[var(--color-ok)]">{statusCounts.Low}</p>
        </div>
      </div>

      {/* Incidents Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-[var(--color-muted)] text-xs uppercase tracking-wider">
                <th className="py-2 px-3 font-medium">Time</th>
                <th className="py-2 px-3 font-medium">Status</th>
                <th className="py-2 px-3 font-medium">Severity</th>
                <th className="py-2 px-3 font-medium">Host</th>
                <th className="py-2 px-3 font-medium">Problem</th>
                <th className="py-2 px-3 font-medium">Duration</th>
                <th className="py-2 px-3 font-medium">Report Type</th>
                <th className="py-2 px-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {allProblems.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-[var(--color-muted)]">
                    <AlertCircle size={32} className="mx-auto mb-2 opacity-30" />
                    <p>No active incidents</p>
                    <p className="text-sm opacity-60">All systems are healthy</p>
                  </td>
                </tr>
              ) : (
                allProblems.map((incident) => (
                  <tr
                    key={incident.id}
                    onClick={() => handleRowClick(incident)}
                    className="border-b border-[var(--color-border)] hover:bg-[var(--color-panel-alt)] transition-colors cursor-pointer group"
                  >
                    <td className="py-2 px-3 text-[var(--color-faint)] font-mono text-xs">
                      {incident.time}
                    </td>
                    <td className="py-2 px-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--color-crit)] text-white">
                        {incident.status}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${severityColors[incident.severity] || severityColors.Information}`}>
                        {incident.severity}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-[var(--color-text)]">{incident.host}</td>
                    <td className="py-2 px-3 text-[var(--color-text)] max-w-xs truncate">
                      {incident.problem}
                    </td>
                    <td className="py-2 px-3 text-[var(--color-faint)] font-mono text-xs flex items-center gap-1">
                      <Clock size={12} />
                      {incident.duration}
                    </td>
                    <td className="py-2 px-3 text-[var(--color-muted)] text-xs">
                      {incident.reportType || "N/A"}
                    </td>
                    <td className="py-2 px-3 text-right">
                      <button className="text-xs text-[var(--color-accent)] hover:underline flex items-center gap-1 opacity-0 group-hover:opacity-100 transition justify-end">
                        <ChevronRight size={12} />
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Problem Detail Modal – kept but no longer opened by row click */}
      <ProblemDetailModal
        isOpen={!!selectedProblem}
        onClose={closeModal}
        problem={selectedProblem}
      />
    </div>
  );
}