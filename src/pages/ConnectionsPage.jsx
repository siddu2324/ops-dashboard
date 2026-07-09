import { useState } from "react";
import { toast } from "react-hot-toast";
import Card from "../components/common/Card";
import { logAction } from "../services/auditService"; // ✅ Added import

export default function ConnectionsPage() {
  const [url, setUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async (e) => {
    e.preventDefault();
    if (!url.trim()) {
      toast.error("Please enter a backend URL");
      return;
    }
    if (!apiKey.trim()) {
      toast.error("Please enter an API key");
      return;
    }

    setIsLoading(true);
    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      // ✅ Log backend connection
      logAction("backend_connected", { url: url.trim() });
      toast.success("Backend connected successfully!");
      setUrl("");
      setApiKey("");
    } catch (error) {
      toast.error("Failed to connect. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card title="Connect Backend Dashboard">
        <form onSubmit={handleConnect} className="space-y-4">
          <div>
            <label className="block text-[var(--color-muted)] text-sm font-medium mb-1">
              Backend dashboard URL
            </label>
            <input
              type="url"
              placeholder="https://grafana.yourcompany.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-[var(--color-muted)] text-sm font-medium mb-1">
              API key
            </label>
            <input
              type="password"
              placeholder="Paste API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? "Connecting…" : "Connect"}
          </button>
        </form>
      </Card>
    </div>
  );
}