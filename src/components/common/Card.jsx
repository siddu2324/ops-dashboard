export default function Card({ title, right, children, style }) {
  return (
    <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-xl" style={style}>
      {(title || right) && (
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <div className="text-[var(--color-muted)] text-xs tracking-wide uppercase">
            {title}
          </div>
          {right}
        </div>
      )}
      <div className="px-4 pb-4">{children}</div>
    </div>
  );
}