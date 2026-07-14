// src/pages/dashboards/CpuLoadReportWindows.jsx
import Card from "../../components/common/Card";

const cpuDataWindows = [
  { hostname: "ASPL_VITBLRLABPWIO2", min: "", avg: "", max: "", ip: "192.168.2.113" },
  { hostname: "ASPL_DESKTOP-2MS825A", min: "", avg: "", max: "", ip: "192.168.2.116" },
  { hostname: "ASPL_VITBLRSRVTS16", min: "", avg: "", max: "", ip: "192.168.6.68" },
  { hostname: "VITBLRSRVSRHPRNT", min: "", avg: "", max: "", ip: "192.168.4.21" },
  { hostname: "VITSRVANTV02", min: "", avg: "", max: "", ip: "192.168.4.64" },
  { hostname: "VITBLRSRVPW01", min: "", avg: "", max: "", ip: "192.168.6.90" },
  { hostname: "VITBLRSRVAPP01", min: "", avg: "", max: "", ip: "192.168.4.104" },
  { hostname: "VITBLRSRVAPP02", min: "", avg: "", max: "", ip: "192.168.4.105" },
  { hostname: "VITBLRSRVPDB02", min: "", avg: "", max: "", ip: "192.168.4.108" },
  { hostname: "VITBLRSRVTAIL02", min: "", avg: "", max: "", ip: "192.168.4.41" },
];

export default function CpuLoadReportWindows() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-[var(--color-text)]">CPU Utilization</h2>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-[var(--color-muted)] text-xs uppercase tracking-wider">
                <th className="py-2 px-3 font-medium">Host name</th>
                <th className="py-2 px-3 font-medium text-right">CPU Utilization MIN</th>
                <th className="py-2 px-3 font-medium text-right">CPU Utilization AVG</th>
                <th className="py-2 px-3 font-medium text-right">CPU Utilization MAX</th>
                <th className="py-2 px-3 font-medium">IP Address</th>
              </tr>
            </thead>
            <tbody>
              {cpuDataWindows.map((row) => (
                <tr key={row.ip} className="border-b border-[var(--color-border)] hover:bg-[var(--color-panel-alt)] transition-colors">
                  <td className="py-2 px-3 text-[var(--color-text)]">{row.hostname}</td>
                  <td className="py-2 px-3 text-right text-[var(--color-text)] font-mono">{row.min || "—"}</td>
                  <td className="py-2 px-3 text-right text-[var(--color-text)] font-mono">{row.avg || "—"}</td>
                  <td className="py-2 px-3 text-right text-[var(--color-text)] font-mono">{row.max || "—"}</td>
                  <td className="py-2 px-3 text-[var(--color-text)] font-mono text-xs">{row.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}