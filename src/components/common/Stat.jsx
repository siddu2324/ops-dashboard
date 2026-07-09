import Card from "./Card";

export default function Stat({ label, value, unit, delta, tone }) {
  return (
    <Card>
      <div className="text-[var(--color-muted)] text-xs mt-2.5">{label}</div>
      <div className="flex items-baseline gap-2 mt-1">
        <span className="font-mono text-3xl text-[var(--color-text)]">{value}</span>
        {unit && <span className="text-[var(--color-faint)] text-sm">{unit}</span>}
      </div>
      {delta && (
        <div
          className="font-mono text-xs mt-0.5"
          style={{ color: tone || "var(--color-ok)" }}
        >
          {delta}
        </div>
      )}
    </Card>
  );
}