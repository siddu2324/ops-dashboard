export default function LoadingSpinner({ size = 40, className = "" }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        style={{ width: size, height: size }}
        className="animate-spin rounded-full border-4 border-[var(--color-border)] border-t-[var(--color-accent)]"
      />
    </div>
  );
}