// src/components/HealthSummary.jsx
import { useAlerts } from "../context/AlertContext";

export default function HealthSummary() {
  const { serverStatuses } = useAlerts();

  const serverList = Object.values(serverStatuses);
  const total = serverList.length;
  const up = serverList.filter(s => s.status === "up").length;
  const warning = serverList.filter(s => s.status === "warning").length;
  const down = serverList.filter(s => s.status === "down").length;

  if (total === 0) return null;

  return (
    <div className="flex items-center gap-4 text-sm bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg px-4 py-2">
      <span className="text-[var(--color-muted)] font-medium">System Health</span>
      <span className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-[var(--color-ok)]"></span>
        <span className="text-[var(--color-ok)] font-semibold">{up}</span>
        <span className="text-[var(--color-muted)] text-xs">Up</span>
      </span>
      <span className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-[var(--color-warn)]"></span>
        <span className="text-[var(--color-warn)] font-semibold">{warning}</span>
        <span className="text-[var(--color-muted)] text-xs">Warning</span>
      </span>
      <span className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-[var(--color-crit)]"></span>
        <span className="text-[var(--color-crit)] font-semibold">{down}</span>
        <span className="text-[var(--color-muted)] text-xs">Critical</span>
      </span>
      <span className="text-[var(--color-muted)] text-xs ml-1">Total: {total}</span>
    </div>
  );
}