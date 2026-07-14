// src/pages/dashboards/MemoryUtilizationReport.jsx
import Card from "../../components/common/Card";

const memoryData = [
  { ip: "192.168.4.53", hostname: "VITSRVPDC01", min: 76.74, avg: 76.74, max: 76.74 },
  { ip: "192.168.4.69", hostname: "VITBLRSRVAAC01", min: 76.17, avg: 76.17, max: 76.17 },
  { ip: "192.168.2.28", hostname: "VITBLRSRVD01", min: 75.47, avg: 75.47, max: 75.47 },
  { ip: "192.168.4.97", hostname: "vitblrsrvbkp01", min: 67.01, avg: 67.01, max: 67.01 },
  { ip: "192.168.4.70", hostname: "VITBLRSRVAAC02", min: 61.47, avg: 61.47, max: 61.47 },
  { ip: "192.168.4.83", hostname: "VITBLRSRVVW01", min: 57.18, avg: 57.18, max: 57.18 },
  { ip: "192.168.4.54", hostname: "VITSRVADC02", min: 57.04, avg: 57.04, max: 57.04 },
  { ip: "192.168.6.90", hostname: "VITBLRSRVPW01", min: 46.82, avg: 46.82, max: 46.82 },
  { ip: "192.168.6.68", hostname: "ASPL_VITBLRSRVT51", min: 46.61, avg: 46.61, max: 46.61 },
  { ip: "192.168.4.60", hostname: "VITSRVPRTG01", min: 37.16, avg: 37.16, max: 37.16 },
];

export default function MemoryUtilizationReport() {
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
              {memoryData.map((row) => (
                <tr key={row.ip} className="border-b border-[var(--color-border)] hover:bg-[var(--color-panel-alt)] transition-colors">
                  <td className="py-2 px-3 text-[var(--color-text)] font-mono text-xs">{row.ip}</td>
                  <td className="py-2 px-3 text-[var(--color-text)]">{row.hostname}</td>
                  <td className="py-2 px-3 text-right text-[var(--color-text)] font-mono">{row.min} %</td>
                  <td className="py-2 px-3 text-right text-[var(--color-text)] font-mono">{row.avg} %</td>
                  <td className="py-2 px-3 text-right text-[var(--color-text)] font-mono">{row.max} %</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}