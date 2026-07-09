import { useState, useEffect } from "react";
import { Search, RefreshCw } from "lucide-react";
import { toast } from "react-hot-toast";
import Card from "../components/common/Card";
import StatusDot from "../components/common/StatusDot";
import { initialServers } from "../data/servers";

export default function ServersPage() {
  const [servers, setServers] = useState(initialServers);
  const [filtered, setFiltered] = useState(servers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Auto-refresh every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData(false); // silent refresh
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Refresh data (simulate API call)
  const refreshData = (showToast = true) => {
    setIsRefreshing(true);
    // Simulate network delay
    setTimeout(() => {
      const newData = initialServers.map((s) => ({
        ...s,
        cpu: Math.round(10 + Math.random() * 80),
        memory: Math.round(20 + Math.random() * 70),
        disk: Math.round(15 + Math.random() * 75),
        status: ["up", "up", "up", "down", "warning"][Math.floor(Math.random() * 5)],
      }));
      setServers(newData);
      if (showToast) toast.success("Servers updated");
      setIsRefreshing(false);
    }, 800);
  };

  // Apply filters
  useEffect(() => {
    let result = servers;
    // Search filter
    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.hostname.toLowerCase().includes(term) ||
          s.ip.includes(term)
      );
    }
    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((s) => s.status === statusFilter);
    }
    setFiltered(result);
  }, [search, statusFilter, servers]);

  // Get status color for the dot (already in StatusDot but we'll use it)
  const statusCounts = {
    all: servers.length,
    up: servers.filter((s) => s.status === "up").length,
    down: servers.filter((s) => s.status === "down").length,
    warning: servers.filter((s) => s.status === "warning").length,
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1 text-sm rounded-full border transition ${
              statusFilter === "all"
                ? "bg-[var(--color-accent)] text-[#06222A] border-[var(--color-accent)]"
                : "bg-transparent text-[var(--color-muted)] border-[var(--color-border)] hover:border-[var(--color-text)]"
            }`}
          >
            All ({statusCounts.all})
          </button>
          <button
            onClick={() => setStatusFilter("up")}
            className={`px-3 py-1 text-sm rounded-full border transition ${
              statusFilter === "up"
                ? "bg-[var(--color-ok)] text-[#06222A] border-[var(--color-ok)]"
                : "bg-transparent text-[var(--color-muted)] border-[var(--color-border)] hover:border-[var(--color-text)]"
            }`}
          >
            Up ({statusCounts.up})
          </button>
          <button
            onClick={() => setStatusFilter("warning")}
            className={`px-3 py-1 text-sm rounded-full border transition ${
              statusFilter === "warning"
                ? "bg-[var(--color-warn)] text-[#06222A] border-[var(--color-warn)]"
                : "bg-transparent text-[var(--color-muted)] border-[var(--color-border)] hover:border-[var(--color-text)]"
            }`}
          >
            Warning ({statusCounts.warning})
          </button>
          <button
            onClick={() => setStatusFilter("down")}
            className={`px-3 py-1 text-sm rounded-full border transition ${
              statusFilter === "down"
                ? "bg-[var(--color-crit)] text-white border-[var(--color-crit)]"
                : "bg-transparent text-[var(--color-muted)] border-[var(--color-border)] hover:border-[var(--color-text)]"
            }`}
          >
            Down ({statusCounts.down})
          </button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-faint)]" />
            <input
              type="text"
              placeholder="Search hostname or IP..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-56 pl-9 pr-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
            />
          </div>
          <button
            onClick={() => refreshData(true)}
            disabled={isRefreshing}
            className="p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] text-[var(--color-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-text)] transition disabled:opacity-50"
          >
            <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Server cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((server) => (
          <Card key={server.id}>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <StatusDot state={server.status} />
                  <span className="text-[var(--color-text)] font-semibold">{server.hostname}</span>
                </div>
                <div className="text-xs text-[var(--color-muted)] mt-1">{server.ip}</div>
                <div className="text-xs text-[var(--color-faint)]">{server.os}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-[var(--color-faint)]">Uptime</div>
                <div className="text-sm text-[var(--color-text)] font-mono">{server.uptime}</div>
              </div>
            </div>

            <div className="mt-3 space-y-2">
              <div>
                <div className="flex justify-between text-xs">
                  <span className="text-[var(--color-muted)]">CPU</span>
                  <span className="text-[var(--color-text)] font-mono">{server.cpu}%</span>
                </div>
                <div className="w-full h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden mt-0.5">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${server.cpu}%`,
                      background: server.cpu > 80 ? "var(--color-crit)" : server.cpu > 60 ? "var(--color-warn)" : "var(--color-ok)",
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs">
                  <span className="text-[var(--color-muted)]">Memory</span>
                  <span className="text-[var(--color-text)] font-mono">{server.memory}%</span>
                </div>
                <div className="w-full h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden mt-0.5">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${server.memory}%`,
                      background: server.memory > 80 ? "var(--color-crit)" : server.memory > 60 ? "var(--color-warn)" : "var(--color-ok)",
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs">
                  <span className="text-[var(--color-muted)]">Disk</span>
                  <span className="text-[var(--color-text)] font-mono">{server.disk}%</span>
                </div>
                <div className="w-full h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden mt-0.5">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${server.disk}%`,
                      background: server.disk > 80 ? "var(--color-crit)" : server.disk > 60 ? "var(--color-warn)" : "var(--color-ok)",
                    }}
                  />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-10 text-[var(--color-muted)]">
          No servers match your filters.
        </div>
      )}
    </div>
  );
}