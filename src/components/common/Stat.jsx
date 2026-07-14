export default function Stat({ label, value, unit, delta, tone, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer hover:bg-[var(--color-panel-alt)] transition rounded-lg p-3 ${
        onClick ? "hover:border-[var(--color-accent)]" : ""
      }`}
    >
      <div className="text-[var(--color-muted)] text-xs">{label}</div>
      <div className="flex items-baseline gap-2 mt-1">
        <span className="font-mono text-3xl text-[var(--color-text)]">{value}</span>
        {unit && <span className="text-[var(--color-faint)] text-sm">{unit}</span>}
      </div>
      {delta && (
        <div className="font-mono text-xs mt-0.5" style={{ color: tone || "var(--color-ok)" }}>
          {delta}
        </div>
      )}
    </div>
  );
}