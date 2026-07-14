// src/pages/dashboards/OracleMonitoring.jsx
import Card from "../../components/common/Card";

// Mock host group stats
const hostGroupStats = {
  total: 42,
  withoutProblems: 28,
  withProblems: 14,
};

// Mock severity counts
const severityCounts = {
  Critical: 3,
  High: 2,
  Medium: 5,
  Low: 1,
  Information: 0,
  "Not classified": 3,
};

// Mock problems data
const problemsData = [
  {
    id: 1,
    time: "2026-06-20 02:34:11 PM",
    recoveryTime: "",
    status: "PROBLEM",
    info: "Oracle",
    host: "Oracle",
    problem: "Unavailable by ICMP ping",
    severity: "Critical",
    duration: "24d 5h 39m",
    actions: "Update",
  },
  {
    id: 2,
    time: "2026-12-02 04:32:48 PM",
    recoveryTime: "",
    status: "PROBLEM",
    info: "Oracle",
    host: "Oracle",
    problem: "Oracle: Failed to fetch info data (or no data for 30m)",
    severity: "Critical",
    duration: "1y 7M 14d",
    actions: "Update",
  },
  {
    id: 3,
    time: "2023-07-31 11:41:55 AM",
    recoveryTime: "",
    status: "PROBLEM",
    info: "Oracle",
    host: "Oracle",
    problem: "Oracle: TBS SYSTEM_ Tablespace usage too low (less 3 for 5 min)",
    severity: "High",
    duration: "2y 11M 19d",
    actions: "Update",
  },
  {
    id: 4,
    time: "2023-07-31 11:34:50 AM",
    recoveryTime: "",
    status: "PROBLEM",
    info: "Oracle",
    host: "Oracle",
    problem: "Oracle: Number of REDO logs available for switching is too low (less 3 for 5 min)",
    severity: "High",
    duration: "2y 11M 19d",
    actions: "Update",
  },
];

export default function OracleMonitoring({ go }) {
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
      localStorage.setItem("parentDashboard", "Oracle Monitoring");
      go(page);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-[var(--color-text)]">Oracle Monitoring</h2>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {/* Problem card */}
          <Card title="Problem">
            <div className="space-y-2">
              <div className="text-2xl font-bold text-[var(--color-text)]">Oracle</div>
              <div className="text-sm text-[var(--color-muted)]">Oracle info</div>
              <div className="space-y-1 text-sm">
                <div
                  className="text-[var(--color-text)] hover:text-[var(--color-accent)] cursor-pointer transition"
                  onClick={() => handleNavigate("Real-time_OS Performance")}
                >
                  Real-time_OS Performance
                </div>
                <div
                  className="text-[var(--color-text)] hover:text-[var(--color-accent)] cursor-pointer transition"
                  onClick={() => handleNavigate("Oracle_Historical Performance_Dashboard")}
                >
                  Oracle_Historical Performance_Dashboard
                </div>
              </div>
            </div>
          </Card>

          {/* Problem hosts stats */}
          <Card title="Problem hosts">
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--color-muted)]">Without problems</span>
                <span className="text-[var(--color-ok)]">{hostGroupStats.withoutProblems}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-muted)]">With problems</span>
                <span className="text-[var(--color-crit)]">{hostGroupStats.withProblems}</span>
              </div>
              <div className="flex justify-between border-t border-[var(--color-border)] pt-1 mt-1">
                <span className="text-[var(--color-text)] font-medium">Total</span>
                <span className="text-[var(--color-text)] font-medium">{hostGroupStats.total}</span>
              </div>
            </div>
          </Card>

          {/* Problems by severity */}
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

        {/* Main content – Problems table */}
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
                    <th className="py-2 px-3 font-medium">Severity</th>
                    <th className="py-2 px-3 font-medium">Duration</th>
                    <th className="py-2 px-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {problemsData.map((row) => (
                    <tr key={row.id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-panel-alt)] transition-colors">
                      <td className="py-2 px-3 text-[var(--color-text)] text-xs">{row.time}</td>
                      <td className="py-2 px-3 text-[var(--color-faint)] text-xs">{row.recoveryTime || "—"}</td>
                      <td className="py-2 px-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--color-crit)] text-white">
                          {row.status}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-[var(--color-text)]">{row.info}</td>
                      <td className="py-2 px-3 text-[var(--color-text)]">{row.host}</td>
                      <td className="py-2 px-3 text-[var(--color-text)]">{row.problem}</td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${severityColors[row.severity] || severityColors["Not classified"]}`}>
                          {row.severity}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-[var(--color-faint)] text-xs">{row.duration}</td>
                      <td className="py-2 px-3">
                        <button className="text-xs text-[var(--color-accent)] hover:underline">Update</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}