const sevColor = (s) =>
  s === "crit" ? "var(--color-crit)" : s === "warn" ? "var(--color-warn)" : "var(--color-ok)";

export default function StatusDot({ state }) {
  const color = sevColor(state);
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
      <circle cx="4" cy="4" r="4" fill={color} />
    </svg>
  );
}