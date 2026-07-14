// src/pages/dashboards/OracleRealTimeOSPerformance.jsx
import Card from "../../components/common/Card";

const problemsData = [
  {
    time: "2026-06-20 02:34:13 PM",
    recovery: "",
    status: "PROBLEM",
    info: "",
    host: "VITZBXORACLE_192.168.2.164",
    problem: "Unavailable by ICMP ping",
    severity: "Critical",
    duration: "24d 6h",
    update: "Update",
    actions: "",
  },
  {
    time: "2024-12-03 11:09:18 AM",
    recovery: "",
    status: "PROBLEM",
    info: "",
    host: "VITZBXORACLE_192.168.2.164",
    problem: "Zabbix agent is not available (for 3m)",
    severity: "High",
    duration: "1y 7M 13d",
    update: "Update",
    actions: "5",
  },
  {
    time: "2024-11-23 04:34:57 PM",
    recovery: "",
    status: "PROBLEM",
    info: "",
    host: "VITZBXORACLE_192.168.2.164",
    problem: "sda: Disk read/write request responses are too high (read > 20 ms for 15m or write > 20 ms for 15m)",
    severity: "High",
    duration: "1y 7M 23d",
    update: "Update",
    actions: "",
  },
  {
    time: "2024-11-23 02:58:58 AM",
    recovery: "",
    status: "PROBLEM",
    info: "",
    host: "VITZBXORACLE_192.168.2.164",
    problem: "sdb: Disk read/write request responses are too high (read > 20 ms for 15m or write > 20 ms for 15m)",
    severity: "High",
    duration: "1y 7M 23d",
    update: "Update",
    actions: "",
  },
  {
    time: "2024-11-22 10:12:16 PM",
    recovery: "",
    status: "PROBLEM",
    info: "",
    host: "VITZBXORACLE_192.168.2.164",
    problem: "High memory utilization (>90% for 5m)",
    severity: "High",
    duration: "1y 7M 23d",
    update: "Update",
    actions: "2",
  },
  {
    time: "2024-07-24 11:05:16 AM",
    recovery: "",
    status: "PROBLEM",
    info: "",
    host: "VITZBXORACLE_192.168.2.164",
    problem: "High memory utilization (>90% for 5m)",
    severity: "High",
    duration: "1y 11M 25d",
    update: "Update",
    actions: "1",
  },
  {
    time: "2024-04-09 01:45:04 AM",
    recovery: "",
    status: "PROBLEM",
    info: "",
    host: "VITZBXORACLE_192.168.2.164",
    problem: "System time is out of sync (diff with Zabbix server > 60s)",
    severity: "High",
    duration: "2y 3M 6d",
    update: "Update",
    actions: "",
  },
  {
    time: "2023-11-11 04:46:25 AM",
    recovery: "",
    status: "PROBLEM",
    info: "",
    host: "VITZBXORACLE_192.168.2.164",
    problem: "Oracle TBS 'SYSAUX' namespace usage is too high (over 95% for 5m)",
    severity: "High",
    duration: "2y 8M 6d",
    update: "Update",
    actions: "✓",
  },
  {
    time: "2023-11-08 04:29:00 AM",
    recovery: "",
    status: "PROBLEM",
    info: "",
    host: "VITZBXORACLE_192.168.2.164",
    problem: "Oracle: Zabbix account will expire soon (under 7 days)",
    severity: "High",
    duration: "2y 8M 9d",
    update: "Update",
    actions: "",
  },
  {
    time: "2023-10-15 11:42:00 AM",
    recovery: "",
    status: "PROBLEM",
    info: "",
    host: "VITZBXORACLE_192.168.2.164",
    problem: "Oracle: Total PGA usage is too high (over 90% for 5 min)",
    severity: "High",
    duration: "2y 9M 3d",
    update: "Update",
    actions: "",
  },
];

export default function OracleRealTimeOSPerformance({ go }) {
  const goBack = () => {
    const parent = localStorage.getItem("parentDashboard") || "Dashboards";
    if (go) go(parent);
  };

  return (
    <div className="space-y-4">
      {/* Back button and header */}
      <div className="flex items-center gap-4 pb-2 border-b border-[var(--color-border)]">
        <button
          onClick={goBack}
          className="text-sm text-[var(--color-accent)] hover:underline flex items-center gap-1"
        >
          ← Back to Oracle Monitoring
        </button>
        <span className="text-sm text-[var(--color-muted)]">|</span>
        <span className="text-sm text-[var(--color-text)] font-medium">Real-time OS Performance</span>
        <span className="text-xs text-[var(--color-muted)] ml-auto">Host: VITZBXORACLE_192.168.2.164</span>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-[var(--color-muted)] text-xs uppercase tracking-wider">
                <th className="py-2 px-3 font-medium">Time</th>
                <th className="py-2 px-3 font-medium">Recovery time</th>
                <th className="py-2 px-3 font-medium">Status</th>
                <th className="py-2 px-3 font-medium">Info</th>
                <th className="py-2 px-3 font-medium">Host</th>
                <th className="py-2 px-3 font-medium">Problem • Severity</th>
                <th className="py-2 px-3 font-medium">Duration</th>
                <th className="py-2 px-3 font-medium">Update</th>
                <th className="py-2 px-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {problemsData.map((row, idx) => (
                <tr key={idx} className="border-b border-[var(--color-border)] hover:bg-[var(--color-panel-alt)] transition-colors">
                  <td className="py-2 px-3 text-[var(--color-text)] text-xs">{row.time}</td>
                  <td className="py-2 px-3 text-[var(--color-faint)] text-xs">{row.recovery || "—"}</td>
                  <td className="py-2 px-3">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--color-crit)] text-white">
                      {row.status}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-[var(--color-muted)] text-xs">{row.info || "—"}</td>
                  <td className="py-2 px-3 text-[var(--color-text)] text-xs">{row.host}</td>
                  <td className="py-2 px-3 text-[var(--color-text)] text-xs">{row.problem}</td>
                  <td className="py-2 px-3 text-[var(--color-faint)] text-xs">{row.duration}</td>
                  <td className="py-2 px-3">
                    <button className="text-xs text-[var(--color-accent)] hover:underline">{row.update}</button>
                  </td>
                  <td className="py-2 px-3 text-[var(--color-text)] text-xs">{row.actions || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}