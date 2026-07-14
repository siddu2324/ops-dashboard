import Card from "../../components/common/Card";

const data = [
  { time: "2026-06-20 02:34:10 PM", status: "OK", info: "Firewall is up", host: "ASPL-HO-FW-01" },
  { time: "2026-06-19 11:18:36 PM", status: "Problem", info: "ICMP timeout", host: "ASPL-HO-FW-01" },
];

export default function FirewallRealTimeInfo({ go }) {
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
        <span className="text-sm text-[var(--color-text)] font-medium">Real-time Firewall Info</span>
      </div>

      <h2 className="text-xl font-bold text-[var(--color-text)]">Real-time Firewall Info</h2>
      <Card>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] text-[var(--color-muted)] text-xs uppercase tracking-wider">
              <th className="py-2 px-3">Time</th>
              <th className="py-2 px-3">Status</th>
              <th className="py-2 px-3">Info</th>
              <th className="py-2 px-3">Host</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="border-b border-[var(--color-border)] hover:bg-[var(--color-panel-alt)]">
                <td className="py-2 px-3 text-xs">{row.time}</td>
                <td className="py-2 px-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${row.status === "OK" ? "bg-[var(--color-ok)] text-[#06222A]" : "bg-[var(--color-crit)] text-white"}`}>
                    {row.status}
                  </span>
                </td>
                <td className="py-2 px-3">{row.info}</td>
                <td className="py-2 px-3">{row.host}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}