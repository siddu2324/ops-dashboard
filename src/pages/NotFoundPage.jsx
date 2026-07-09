import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-[var(--color-bg)] text-center p-5">
      <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-xl p-10 max-w-md">
        <h1 className="text-7xl font-bold text-[var(--color-accent)] mb-4">404</h1>
        <h2 className="text-2xl font-bold text-[var(--color-text)] mb-2">Page not found</h2>
        <p className="text-[var(--color-muted)] mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-2.5 bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-80 transition"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}