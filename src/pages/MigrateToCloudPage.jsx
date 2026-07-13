import { useState } from "react";
import { Search, ArrowRight, ExternalLink } from "lucide-react";
import { toast } from "react-hot-toast";
import Card from "../components/common/Card";

export default function MigrateToCloudPage() {
  const [migrationToken, setMigrationToken] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = () => {
    if (!migrationToken.trim()) {
      toast.error("Please paste a migration token");
      return;
    }
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      toast.success("Connected to cloud stack successfully!");
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Migrate to Grafana Cloud</h1>
          <p className="text-sm text-[var(--color-muted)]">
            Copy resources from your self-managed installation to a cloud stack
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-faint)]" />
            <input
              type="text"
              placeholder="Search..."
              className="w-48 pl-9 pr-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent text-xs"
            />
          </div>
          <span className="text-xs text-[var(--color-muted)] bg-[var(--color-panel-alt)] px-2 py-1 rounded border border-[var(--color-border)]">
            ctrl+k
          </span>
        </div>
      </div>

      {/* Main card – connect to cloud stack */}
      <Card title="Connect to a cloud stack">
        <div className="space-y-4">
          <p className="text-sm text-[var(--color-muted)]">
            To get started, you'll need a Grafana.com account.
          </p>
          <button className="text-sm text-[var(--color-accent)] hover:underline">
            Sign up for a Grafana.com account
          </button>

          <p className="text-sm text-[var(--color-muted)]">
            You'll also need a cloud stack. If you just signed up, we'll automatically create your first stack. If you have an account, you'll need to select or create a stack.
          </p>
          <button className="text-sm text-[var(--color-accent)] hover:underline">
            View my cloud stacks
          </button>

          <div className="bg-[var(--color-panel-alt)] border border-[var(--color-border)] rounded-lg p-4 space-y-3">
            <p className="text-sm text-[var(--color-muted)]">
              Your self-managed Grafana installation needs special access to securely migrate content. You'll need to create a migration token on your chosen cloud stack.
            </p>
            <p className="text-sm text-[var(--color-muted)]">
              Log into your cloud stack and navigate to <span className="font-mono text-[var(--color-text)]">Administration &gt; General &gt; Migrate to Grafana Cloud</span>. Create a migration token on that screen and paste the token here.
            </p>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                Migration token <span className="text-[var(--color-crit)]">*</span>
              </label>
              <input
                type="password"
                placeholder="Paste token here"
                value={migrationToken}
                onChange={(e) => setMigrationToken(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleConnect}
                disabled={isConnecting}
                className="px-4 py-2 bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-50"
              >
                {isConnecting ? "Connecting..." : "Connect to this stack"}
              </button>
              <button className="px-4 py-2 text-[var(--color-muted)] hover:text-[var(--color-text)] transition">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Info section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-[var(--color-text)] mb-2">What is Grafana Cloud?</h3>
          <p className="text-xs text-[var(--color-muted)]">
            Grafana Cloud is a fully managed cloud-hosted observability platform ideal for cloud native environments. It's everything you love about Grafana without the overhead of maintaining, upgrading, and supporting an installation.
          </p>
          <button className="text-xs text-[var(--color-accent)] hover:underline mt-2 flex items-center gap-1">
            Learn about cloud features <ExternalLink size={12} />
          </button>
        </div>

        <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-[var(--color-text)] mb-2">What if not all my data sources are on the public internet?</h3>
          <p className="text-xs text-[var(--color-muted)]">
            Exposing your data sources to the internet can raise security concerns. Private data source connect (PDC) allows Grafana Cloud to access your existing data sources over a secure network tunnel.
          </p>
          <button className="text-xs text-[var(--color-accent)] hover:underline mt-2 flex items-center gap-1">
            Learn about PDC <ExternalLink size={12} />
          </button>
        </div>

        <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-[var(--color-text)] mb-2">How much does it cost?</h3>
          <p className="text-xs text-[var(--color-muted)]">
            Grafana Cloud has a generous free plan and a 14 day unlimited usage trial. After your trial expires, you'll be billed based on usage over the free plan limits.
          </p>
          <button className="text-xs text-[var(--color-accent)] hover:underline mt-2 flex items-center gap-1">
            Grafana Cloud pricing <ExternalLink size={12} />
          </button>
        </div>
      </div>

      {/* Additional links */}
      <div className="flex flex-wrap gap-6 text-sm text-[var(--color-muted)] pt-4 border-t border-[var(--color-border)]">
        <button className="hover:text-[var(--color-text)] transition flex items-center gap-1">
          More questions? Talk to an expert <ArrowRight size={14} />
        </button>
        <button className="hover:text-[var(--color-text)] transition flex items-center gap-1">
          Where can I learn more about migrating to Grafana Cloud? <ArrowRight size={14} />
        </button>
        <button className="hover:text-[var(--color-text)] transition flex items-center gap-1">
          Is it secure? <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}