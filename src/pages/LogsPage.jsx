import { useState, useEffect, useRef } from "react";
import { Search, RefreshCw, ChevronDown, ChevronUp, AlertCircle, CheckCircle, Info, Bug } from "lucide-react";
import { toast } from "react-hot-toast";
import { Virtuoso } from "react-virtuoso";
import { initialLogs, generateNewLogs } from "../data/logs";

// Icons for severity
const SeverityIcon = ({ severity }) => {
  const icons = {
    error: <AlertCircle size={14} className="text-[var(--color-crit)]" />,
    warn: <AlertCircle size={14} className="text-[var(--color-warn)]" />,
    info: <Info size={14} className="text-[var(--color-accent)]" />,
    debug: <Bug size={14} className="text-[var(--color-faint)]" />,
  };
  return icons[severity] || icons.info;
};

const SEVERITY_BADGE = {
  error: "bg-[var(--color-crit)]/10 text-[var(--color-crit)] border border-[var(--color-crit)]/30",
  warn: "bg-[var(--color-warn)]/10 text-[var(--color-warn)] border border-[var(--color-warn)]/30",
  info: "bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/30",
  debug: "bg-[var(--color-border)]/50 text-[var(--color-faint)] border border-[var(--color-border)]",
};

const SEVERITY_ORDER = { error: 0, warn: 1, info: 2, debug: 3 };

// Row component for each log entry
const LogRow = ({ log }) => {
  return (
    <div className="flex items-center gap-3 px-3 border-b border-[var(--color-border)] hover:bg-[var(--color-panel-alt)] transition-colors text-xs py-1.5">
      <span className="text-[var(--color-faint)] w-36 font-mono flex-shrink-0">
        {new Date(log.timestamp).toLocaleTimeString()}
      </span>
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono flex-shrink-0 ${SEVERITY_BADGE[log.severity]}`}>
        {log.severity}
      </span>
      <span className="text-[var(--color-muted)] w-28 flex-shrink-0 font-mono">
        {log.service}
      </span>
      <span className="text-[var(--color-faint)] w-24 flex-shrink-0 font-mono text-[10px]">
        {log.endpoint}
      </span>
      <span className="text-[var(--color-text)] flex-1 truncate">
        {log.message}
      </span>
      <span className="text-[var(--color-faint)] font-mono text-[10px] flex-shrink-0">
        {log.traceId}
      </span>
    </div>
  );
};

export default function LogsPage() {
  const [logs, setLogs] = useState(initialLogs);
  const [filtered, setFiltered] = useState(logs);
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [isLive, setIsLive] = useState(true);
  const virtuosoRef = useRef(null);

  // Stats
  const stats = {
    total: logs.length,
    error: logs.filter(l => l.severity === "error").length,
    warn: logs.filter(l => l.severity === "warn").length,
    info: logs.filter(l => l.severity === "info").length,
    debug: logs.filter(l => l.severity === "debug").length,
  };

  // Auto-refresh every 5 seconds
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      refreshData(false);
    }, 5000);
    return () => clearInterval(interval);
  }, [isLive]);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (autoScroll && virtuosoRef.current && filtered.length > 0) {
      virtuosoRef.current.scrollToIndex({
        index: filtered.length - 1,
        align: "end",
        behavior: "smooth",
      });
    }
  }, [filtered, autoScroll]);

  const refreshData = (showToast = true) => {
    setIsRefreshing(true);
    setTimeout(() => {
      const newLogs = generateNewLogs(3 + Math.floor(Math.random() * 5));
      setLogs((prev) => {
        const combined = [...prev, ...newLogs];
        return combined.slice(-5000);
      });
      if (showToast) toast.success(`${newLogs.length} new logs received`);
      setIsRefreshing(false);
    }, 400);
  };

  // Apply filters
  useEffect(() => {
    let result = logs;
    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter(
        (log) =>
          log.message.toLowerCase().includes(term) ||
          log.service.toLowerCase().includes(term) ||
          log.endpoint.toLowerCase().includes(term) ||
          log.traceId.toLowerCase().includes(term)
      );
    }
    if (severityFilter !== "all") {
      result = result.filter((log) => log.severity === severityFilter);
    }
    setFiltered(result);
  }, [search, severityFilter, logs]);

  const scrollToBottom = () => {
    if (virtuosoRef.current && filtered.length > 0) {
      virtuosoRef.current.scrollToIndex({
        index: filtered.length - 1,
        align: "end",
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-7xl mx-auto space-y-3">
      {/* Stats Cards */}
      <div className="grid grid-cols-5 gap-3 flex-shrink-0">
        <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-center">
          <div className="text-[var(--color-muted)] text-[10px] uppercase tracking-wider">Total Logs</div>
          <div className="text-[var(--color-text)] text-lg font-bold">{stats.total.toLocaleString()}</div>
        </div>
        <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-center">
          <div className="text-[var(--color-muted)] text-[10px] uppercase tracking-wider">Errors</div>
          <div className="text-[var(--color-crit)] text-lg font-bold">{stats.error}</div>
        </div>
        <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-center">
          <div className="text-[var(--color-muted)] text-[10px] uppercase tracking-wider">Warnings</div>
          <div className="text-[var(--color-warn)] text-lg font-bold">{stats.warn}</div>
        </div>
        <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-center">
          <div className="text-[var(--color-muted)] text-[10px] uppercase tracking-wider">Info</div>
          <div className="text-[var(--color-accent)] text-lg font-bold">{stats.info}</div>
        </div>
        <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-center">
          <div className="text-[var(--color-muted)] text-[10px] uppercase tracking-wider">Debug</div>
          <div className="text-[var(--color-faint)] text-lg font-bold">{stats.debug}</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between flex-shrink-0">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSeverityFilter("all")}
            className={`px-3 py-1 text-xs rounded-full border transition ${
              severityFilter === "all"
                ? "bg-[var(--color-accent)] text-[#06222A] border-[var(--color-accent)]"
                : "bg-transparent text-[var(--color-muted)] border-[var(--color-border)] hover:border-[var(--color-text)]"
            }`}
          >
            All ({stats.total})
          </button>
          <button
            onClick={() => setSeverityFilter("error")}
            className={`px-3 py-1 text-xs rounded-full border transition ${
              severityFilter === "error"
                ? "bg-[var(--color-crit)] text-white border-[var(--color-crit)]"
                : "bg-transparent text-[var(--color-muted)] border-[var(--color-border)] hover:border-[var(--color-text)]"
            }`}
          >
            Error ({stats.error})
          </button>
          <button
            onClick={() => setSeverityFilter("warn")}
            className={`px-3 py-1 text-xs rounded-full border transition ${
              severityFilter === "warn"
                ? "bg-[var(--color-warn)] text-[#06222A] border-[var(--color-warn)]"
                : "bg-transparent text-[var(--color-muted)] border-[var(--color-border)] hover:border-[var(--color-text)]"
            }`}
          >
            Warn ({stats.warn})
          </button>
          <button
            onClick={() => setSeverityFilter("info")}
            className={`px-3 py-1 text-xs rounded-full border transition ${
              severityFilter === "info"
                ? "bg-[var(--color-accent)] text-[#06222A] border-[var(--color-accent)]"
                : "bg-transparent text-[var(--color-muted)] border-[var(--color-border)] hover:border-[var(--color-text)]"
            }`}
          >
            Info ({stats.info})
          </button>
          <button
            onClick={() => setSeverityFilter("debug")}
            className={`px-3 py-1 text-xs rounded-full border transition ${
              severityFilter === "debug"
                ? "bg-[var(--color-border)] text-[var(--color-text)] border-[var(--color-border)]"
                : "bg-transparent text-[var(--color-muted)] border-[var(--color-border)] hover:border-[var(--color-text)]"
            }`}
          >
            Debug ({stats.debug})
          </button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-faint)]" />
            <input
              type="text"
              placeholder="Search logs (message, service, endpoint)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64 pl-9 pr-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent text-xs"
            />
          </div>
          <button
            onClick={() => setIsLive(!isLive)}
            className={`p-2 rounded-lg border transition ${
              isLive
                ? "border-[var(--color-ok)] text-[var(--color-ok)]"
                : "border-[var(--color-border)] text-[var(--color-muted)]"
            } hover:text-[var(--color-text)] hover:border-[var(--color-text)]`}
            title={isLive ? "Live: On" : "Live: Off"}
          >
            <div className="flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${isLive ? "bg-[var(--color-ok)]" : "bg-[var(--color-muted)]"}`} />
              <span className="text-xs">Live</span>
            </div>
          </button>
          <button
            onClick={() => refreshData(true)}
            disabled={isRefreshing}
            className="p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] text-[var(--color-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-text)] transition disabled:opacity-50"
          >
            <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
          </button>
          <button
            onClick={scrollToBottom}
            className="p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] text-[var(--color-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-text)] transition"
            title="Scroll to bottom"
          >
            <ChevronDown size={16} />
          </button>
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`p-2 rounded-lg border transition ${
              autoScroll
                ? "border-[var(--color-accent)] text-[var(--color-accent)]"
                : "border-[var(--color-border)] text-[var(--color-muted)]"
            } hover:text-[var(--color-text)] hover:border-[var(--color-text)]`}
            title={autoScroll ? "Auto-scroll on" : "Auto-scroll off"}
          >
            <ChevronUp size={16} />
          </button>
        </div>
      </div>

      {/* Log list with Virtuoso */}
      <div className="flex-1 bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg overflow-hidden">
        <div className="flex items-center gap-3 px-3 py-1.5 bg-[var(--color-panel-alt)] border-b border-[var(--color-border)] text-[10px] text-[var(--color-muted)] uppercase tracking-wider font-semibold flex-shrink-0">
          <span className="w-36">Time</span>
          <span className="w-16">Severity</span>
          <span className="w-28">Service</span>
          <span className="w-24">Endpoint</span>
          <span className="flex-1">Message</span>
          <span className="w-24">Trace ID</span>
        </div>
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center h-full text-[var(--color-muted)]">
            No logs match your filters.
          </div>
        ) : (
          <Virtuoso
            ref={virtuosoRef}
            data={filtered}
            itemContent={(index, log) => <LogRow key={log.id} log={log} />}
            style={{ height: "calc(100% - 30px)" }}
          />
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-[var(--color-muted)] flex-shrink-0">
        <span>Showing {filtered.length} of {logs.length} logs</span>
        <span>{isLive ? "Live · Auto-refresh every 5s" : "Paused"}</span>
      </div>
    </div>
  );
}