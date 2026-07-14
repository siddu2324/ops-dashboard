// src/pages/dashboards/FirewallDashboard.jsx
import Card from "../../components/common/Card";

// Mock stats
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

// Mock problems data
const problemsData = [
  {
    id: 1,
    time: "2026-06-20 02:34:10 PM",
    recoveryTime: "",
    status: "PROBLEM",
    info: "",
    host: "ASPL-HO-FW-01",
    problem: "Unavailable by ICMP ping",
    duration: "24d 6h 30m",
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
    duration: "24d 21h 45m",
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
    duration: "3M 19d 10h",
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
    duration: "4M 5d 2h",
    update: "Update",
    actions: "",
  },
];

export default function FirewallDashboard({ go }) {
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

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-[var(--color-text)]">Firewall Dashboard</h2>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {/* Problem card with links */}
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

          {/* Host availability */}
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

          {/* Problem hosts */}
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
                    <th className="py-2 px-3 font-medium">Duration</th>
                    <th className="py-2 px-3 font-medium">Update</th>
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
                      <td className="py-2 px-3 text-[var(--color-muted)] text-xs">{row.info || "—"}</td>
                      <td className="py-2 px-3 text-[var(--color-text)]">{row.host}</td>
                      <td className="py-2 px-3 text-[var(--color-text)]">{row.problem}</td>
                      <td className="py-2 px-3 text-[var(--color-faint)] text-xs">{row.duration}</td>
                      <td className="py-2 px-3">
                        <button className="text-xs text-[var(--color-accent)] hover:underline">{row.update}</button>
                      </td>
                      <td className="py-2 px-3 text-[var(--color-muted)] text-xs">{row.actions || "—"}</td>
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