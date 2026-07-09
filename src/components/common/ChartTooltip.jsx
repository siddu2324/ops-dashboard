export default function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[var(--color-panel-alt)] border border-[var(--color-border)] rounded-md px-3 py-1.5 font-mono text-xs text-[var(--color-text)]">
      <div className="text-[var(--color-muted)]">{label}</div>
      <div>{payload[0].value}</div>
    </div>
  );
}