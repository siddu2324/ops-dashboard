// src/pages/dashboards/DiskUtilizationReportWindows.jsx
import Card from "../../components/common/Card";

const diskDataWindows = [
  { hostname: "ASPL_VITBLRLABPWIO2", ip: "192.168.2.113", min: "", avg: "", max: "" },
  { hostname: "Oracle EBS Suite", ip: "192.168.2.114", min: "", avg: "", max: "" },
  { hostname: "zbxkubecit-JMX Tomcat", ip: "192.168.2.115", min: "", avg: "", max: "" },
  { hostname: "ASPL HO Demo proxy_192.168.4.190", ip: "192.168.4.190", min: "", avg: "", max: "" },
  { hostname: "VITBLRUATMSSQL", ip: "192.168.2.165", min: "", avg: "", max: "" },
  { hostname: "Mysql Server", ip: "192.168.2.111", min: "", avg: "", max: "" },
  { hostname: "MSSQL", ip: "192.168.2.172", min: "", avg: "", max: "" },
  { hostname: "Google URL", ip: "127.0.0.1", min: "", avg: "", max: "" },
  { hostname: "ASPL Pulse", ip: "192.168.2.111", min: "", avg: "", max: "" },
  { hostname: "ASPL_DESKTOP-2MS825A", ip: "192.168.2.116", min: "", avg: "", max: "" },
];

export default function DiskUtilizationReportWindows() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-[var(--color-text)]">'C' Disk Utilization</h2>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-[var(--color-muted)] text-xs uppercase tracking-wider">
                <th className="py-2 px-3 font-medium">Host name</th>
                <th className="py-2 px-3 font-medium">IP Address</th>
                <th className="py-2 px-3 font-medium text-right">Disk Utilization MIN</th>
                <th className="py-2 px-3 font-medium text-right">Disk Utilization AVG</th>
                <th className="py-2 px-3 font-medium text-right">Disk Utilization MAX</th>
              </tr>
            </thead>
            <tbody>
              {diskDataWindows.map((row) => (
                <tr key={row.ip} className="border-b border-[var(--color-border)] hover:bg-[var(--color-panel-alt)] transition-colors">
                  <td className="py-2 px-3 text-[var(--color-text)]">{row.hostname}</td>
                  <td className="py-2 px-3 text-[var(--color-text)] font-mono text-xs">{row.ip}</td>
                  <td className="py-2 px-3 text-right text-[var(--color-text)] font-mono">{row.min || "—"}</td>
                  <td className="py-2 px-3 text-right text-[var(--color-text)] font-mono">{row.avg || "—"}</td>
                  <td className="py-2 px-3 text-right text-[var(--color-text)] font-mono">{row.max || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}