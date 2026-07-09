import { toast } from "react-hot-toast";

export default function PlaceholderPage({ title, description, actionText, onAction }) {
  const handleAction = () => {
    if (onAction) {
      onAction();
    } else {
      toast.info(`"${title}" setup is not yet implemented.`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-120px)] text-center p-5">
      <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-[var(--color-text)] mb-3">{title}</h2>
        <p className="text-[var(--color-muted)] text-sm leading-relaxed mb-6">
          {description}
        </p>
        {actionText && (
          <button
            onClick={handleAction}
            className="px-5 py-2 bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90 transition"
          >
            {actionText}
          </button>
        )}
      </div>
    </div>
  );
}