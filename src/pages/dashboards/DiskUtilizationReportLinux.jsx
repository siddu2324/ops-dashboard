// src/pages/dashboards/DiskUtilizationReportLinux.jsx
import Card from "../../components/common/Card";

const diskDataLinux = [
  { hostname: "VITBLRSRVZBC01", ip: "192.168.6.101", min: "", avg: "", max: "" },
  { hostname: "VITBLRSRVZDB01", ip: "192.168.2.111", min: "", avg: "", max: "" },
  { hostname: "Docker", ip: "192.168.2.73", min: "", avg: "", max: "" },
  { hostname: "VITZBOXORACLE_192.168.2.164", ip: "192.168.2.164", min: "", avg: "", max: "" },
  { hostname: "ASPL Pulse", ip: "192.168.2.111", min: "", avg: "", max: "" },
  { hostname: "zbxkuibectl-JMX Tomcat", ip: "192.168.2.115", min: "", avg: "", max: "" },
  { hostname: "Database Server", ip: "192.168.2.111", min: "", avg: "", max: "" },
  { hostname: "vitblruat03", ip: "192.168.2.192", min: "", avg: "", max: "" },
  { hostname: "SPLUNKTEST", ip: "192.168.4.172", min: "", avg: "", max: "" },
  { hostname: "photon_machine", ip: "192.168.4.157", min: "", avg: "", max: "" },
];

export default function DiskUtilizationReportLinux() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-[var(--color-text)]">Disk Utilization</h2>
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
              {diskDataLinux.map((row) => (
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