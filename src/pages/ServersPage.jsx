import { useState, useEffect } from "react";
import { Search, RefreshCw, Server, HardDrive, Cpu, Activity, AlertCircle, CheckCircle, XCircle } from "lucide-react";
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
      refreshData(false);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const refreshData = (showToast = true) => {
    setIsRefreshing(true);
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

  useEffect(() => {
    let result = servers;
    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.hostname.toLowerCase().includes(term) ||
          s.ip.includes(term) ||
          s.os.toLowerCase().includes(term)
      );
    }
    if (statusFilter !== "all") {
      result = result.filter((s) => s.status === statusFilter);
    }
    setFiltered(result);
  }, [search, statusFilter, servers]);

  const statusCounts = {
    all: servers.length,
    up: servers.filter((s) => s.status === "up").length,
    down: servers.filter((s) => s.status === "down").length,
    warning: servers.filter((s) => s.status === "warning").length,
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'up': return <CheckCircle size={14} className="text-[var(--color-ok)]" />;
      case 'warning': return <AlertCircle size={14} className="text-[var(--color-warn)]" />;
      case 'down': return <XCircle size={14} className="text-[var(--color-crit)]" />;
      default: return null;
    }
  };

  const getStatusLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getHealthScore = (server) => {
    const avg = (server.cpu + server.memory + server.disk) / 3;
    if (avg < 50) return { score: 'Good', color: 'var(--color-ok)' };
    if (avg < 75) return { score: 'Fair', color: 'var(--color-warn)' };
    return { score: 'Poor', color: 'var(--color-crit)' };
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">Total Servers</p>
              <p className="text-2xl font-bold text-[var(--color-text)] mt-1">{statusCounts.all}</p>
            </div>
            <Server size={24} className="text-[var(--color-muted)]" />
          </div>
        </div>
        <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">Healthy</p>
              <p className="text-2xl font-bold text-[var(--color-ok)] mt-1">{statusCounts.up}</p>
            </div>
            <CheckCircle size={24} className="text-[var(--color-ok)]" />
          </div>
        </div>
        <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">Warning</p>
              <p className="text-2xl font-bold text-[var(--color-warn)] mt-1">{statusCounts.warning}</p>
            </div>
            <AlertCircle size={24} className="text-[var(--color-warn)]" />
          </div>
        </div>
        <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">Down</p>
              <p className="text-2xl font-bold text-[var(--color-crit)] mt-1">{statusCounts.down}</p>
            </div>
            <XCircle size={24} className="text-[var(--color-crit)]" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {['all', 'up', 'warning', 'down'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-1.5 text-sm rounded-full border transition-all ${
                statusFilter === status
                  ? status === 'all'
                    ? 'bg-[var(--color-accent)] text-[#06222A] border-[var(--color-accent)]'
                    : status === 'up'
                    ? 'bg-[var(--color-ok)] text-[#06222A] border-[var(--color-ok)]'
                    : status === 'warning'
                    ? 'bg-[var(--color-warn)] text-[#06222A] border-[var(--color-warn)]'
                    : 'bg-[var(--color-crit)] text-white border-[var(--color-crit)]'
                  : 'bg-transparent text-[var(--color-muted)] border-[var(--color-border)] hover:border-[var(--color-text)] hover:text-[var(--color-text)]'
              }`}
            >
              <span className="flex items-center gap-1.5">
                {status !== 'all' && getStatusIcon(status)}
                {status === 'all' ? 'All' : getStatusLabel(status)}
                <span className="ml-0.5 opacity-75">({statusCounts[status]})</span>
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-faint)]" />
            <input
              type="text"
              placeholder="Search by hostname, IP, or OS..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition"
            />
          </div>
          <button
            onClick={() => refreshData(true)}
            disabled={isRefreshing}
            className="p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] text-[var(--color-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-text)] transition disabled:opacity-50"
          >
            <RefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Server Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((server) => {
          const health = getHealthScore(server);
          return (
            <Card key={server.id} className="hover:border-[var(--color-accent)] transition-colors">
              {/* Header */}
              <div className="flex items-start justify-between pb-3 border-b border-[var(--color-border)]">
                <div className="flex items-start gap-3">
                  <div className="flex items-center gap-2 mt-0.5">
                    <StatusDot state={server.status} size="md" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[var(--color-text)] font-semibold">{server.hostname}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${
                          server.status === 'up' ? 'border-[var(--color-ok)] text-[var(--color-ok)]' :
                          server.status === 'warning' ? 'border-[var(--color-warn)] text-[var(--color-warn)]' :
                          'border-[var(--color-crit)] text-[var(--color-crit)]'
                        }`}>
                          {getStatusLabel(server.status)}
                        </span>
                      </div>
                      <div className="text-xs text-[var(--color-muted)]">{server.ip}</div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-[var(--color-faint)]">Uptime</div>
                  <div className="text-sm font-mono text-[var(--color-text)]">{server.uptime}</div>
                </div>
              </div>

              {/* Details */}
              <div className="mt-3 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <Cpu size={14} className="text-[var(--color-muted)]" />
                    <span className="text-[var(--color-muted)]">CPU</span>
                  </div>
                  <span className="font-mono text-[var(--color-text)]">{server.cpu}%</span>
                </div>
                <div className="w-full h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${server.cpu}%`,
                      background: server.cpu > 80 ? "var(--color-crit)" : server.cpu > 60 ? "var(--color-warn)" : "var(--color-ok)",
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <Activity size={14} className="text-[var(--color-muted)]" />
                    <span className="text-[var(--color-muted)]">Memory</span>
                  </div>
                  <span className="font-mono text-[var(--color-text)]">{server.memory}%</span>
                </div>
                <div className="w-full h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${server.memory}%`,
                      background: server.memory > 80 ? "var(--color-crit)" : server.memory > 60 ? "var(--color-warn)" : "var(--color-ok)",
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <HardDrive size={14} className="text-[var(--color-muted)]" />
                    <span className="text-[var(--color-muted)]">Disk</span>
                  </div>
                  <span className="font-mono text-[var(--color-text)]">{server.disk}%</span>
                </div>
                <div className="w-full h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${server.disk}%`,
                      background: server.disk > 80 ? "var(--color-crit)" : server.disk > 60 ? "var(--color-warn)" : "var(--color-ok)",
                    }}
                  />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border)]">
                  <span className="text-xs text-[var(--color-faint)]">{server.os}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium`}
                    style={{ color: health.color, backgroundColor: `${health.color}20` }}
                  >
                    {health.score}
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 bg-[var(--color-panel)] rounded-lg border border-[var(--color-border)]">
          <Server size={48} className="mx-auto text-[var(--color-faint)] mb-3" />
          <p className="text-[var(--color-muted)]">No servers match your filters.</p>
          <button
            onClick={() => { setSearch(""); setStatusFilter("all"); }}
            className="mt-2 text-sm text-[var(--color-accent)] hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}