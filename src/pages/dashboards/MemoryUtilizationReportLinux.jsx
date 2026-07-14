// src/pages/dashboards/MemoryUtilizationReportLinux.jsx
import Card from "../../components/common/Card";

const memoryDataLinux = [
  { ip: "192.168.6.101", hostname: "VITBLRSRVZBVXC01", min: "", avg: "", max: "" },
  { ip: "192.168.2.111", hostname: "VITBLRSRVZDB01", min: "", avg: "", max: "" },
  { ip: "192.168.2.73", hostname: "Docker", min: "", avg: "", max: "" },
  { ip: "192.168.2.164", hostname: "VITZBXRACLE_192.168.2.164", min: "", avg: "", max: "" },
  { ip: "192.168.2.111", hostname: "ASPL_Pulse", min: "", avg: "", max: "" },
  { ip: "192.168.2.115", hostname: "zbxkubectl-JMX Tomcat", min: "", avg: "", max: "" },
  { ip: "192.168.2.111", hostname: "Database Server", min: "", avg: "", max: "" },
  { ip: "192.168.2.192", hostname: "vitblrwat03", min: "", avg: "", max: "" },
  { ip: "192.168.4.172", hostname: "SPLUNKTEST", min: "", avg: "", max: "" },
  { ip: "192.168.4.157", hostname: "photon_machine", min: "", avg: "", max: "" },
];

export default function MemoryUtilizationReportLinux() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-[var(--color-text)]">Memory Utilization</h2>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-[var(--color-muted)] text-xs uppercase tracking-wider">
                <th className="py-2 px-3 font-medium">IP Address</th>
                <th className="py-2 px-3 font-medium">Host name</th>
                <th className="py-2 px-3 font-medium text-right">Memory Utilization MIN</th>
                <th className="py-2 px-3 font-medium text-right">Memory Utilization AVG</th>
                <th className="py-2 px-3 font-medium text-right">Memory Utilization MAX</th>
              </tr>
            </thead>
            <tbody>
              {memoryDataLinux.map((row) => (
                <tr key={row.ip} className="border-b border-[var(--color-border)] hover:bg-[var(--color-panel-alt)] transition-colors">
                  <td className="py-2 px-3 text-[var(--color-text)] font-mono text-xs">{row.ip}</td>
                  <td className="py-2 px-3 text-[var(--color-text)]">{row.hostname}</td>
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