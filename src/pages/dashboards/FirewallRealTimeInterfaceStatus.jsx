import Card from "../../components/common/Card";

const data = [
  { interface: "eth0", status: "Up", speed: "1 Gbps", host: "ASPL-HO-FW-01" },
  { interface: "eth1", status: "Down", speed: "—", host: "ASPL-HO-FW-01" },
];

export default function FirewallRealTimeInterfaceStatus({ go }) {
  const goBack = () => {
    const parent = localStorage.getItem("parentDashboard") || "Dashboards";
    if (go) go(parent);
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
        <span className="text-sm text-[var(--color-text)] font-medium">Real-time Firewall Interface Status</span>
      </div>

      <h2 className="text-xl font-bold text-[var(--color-text)]">Real-time Firewall Interface Status</h2>
      <Card>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] text-[var(--color-muted)] text-xs uppercase tracking-wider">
              <th className="py-2 px-3">Interface</th>
              <th className="py-2 px-3">Status</th>
              <th className="py-2 px-3">Speed</th>
              <th className="py-2 px-3">Host</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="border-b border-[var(--color-border)] hover:bg-[var(--color-panel-alt)]">
                <td className="py-2 px-3">{row.interface}</td>
                <td className="py-2 px-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${row.status === "Up" ? "bg-[var(--color-ok)] text-[#06222A]" : "bg-[var(--color-crit)] text-white"}`}>
                    {row.status}
                  </span>
                </td>
                <td className="py-2 px-3">{row.speed}</td>
                <td className="py-2 px-3">{row.host}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}