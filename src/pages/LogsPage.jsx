import { useState, useEffect, useRef } from "react";
import { Search, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "react-hot-toast";
import { Virtuoso } from "react-virtuoso";
import { initialLogs, generateNewLogs } from "../data/logs";

const SEVERITY_BADGE = {
  error: "bg-[var(--color-crit)] text-white",
  warn: "bg-[var(--color-warn)] text-[#06222A]",
  info: "bg-[var(--color-accent)] text-[#06222A]",
  debug: "bg-[var(--color-border)] text-[var(--color-muted)]",
};

// Row component for each log entry
const LogRow = ({ log }) => {
  return (
    <div className="flex items-center gap-3 px-3 border-b border-[var(--color-border)] hover:bg-[var(--color-panel-alt)] transition-colors text-xs h-9">
      <span className="text-[var(--color-faint)] w-36 font-mono flex-shrink-0">
        {new Date(log.timestamp).toLocaleTimeString()}
      </span>
      <span className={`px-2 py-0.5 rounded-full text-xs font-mono flex-shrink-0 ${SEVERITY_BADGE[log.severity]}`}>
        {log.severity}
      </span>
      <span className="text-[var(--color-muted)] w-28 flex-shrink-0 font-mono">
        {log.service}
      </span>
      <span className="text-[var(--color-text)] flex-1 truncate">
        {log.message}
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
  const virtuosoRef = useRef(null);

  // Auto-refresh every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData(false);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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
      const newLogs = generateNewLogs(2 + Math.floor(Math.random() * 3));
      setLogs((prev) => {
        const combined = [...prev, ...newLogs];
        return combined.slice(-10000);
      });
      if (showToast) toast.success(`${newLogs.length} new logs added`);
      setIsRefreshing(false);
    }, 500);
  };

  // Apply filters
  useEffect(() => {
    let result = logs;
    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter(
        (log) =>
          log.message.toLowerCase().includes(term) ||
          log.service.toLowerCase().includes(term)
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

  const statusCounts = {
    all: logs.length,
    error: logs.filter((l) => l.severity === "error").length,
    warn: logs.filter((l) => l.severity === "warn").length,
    info: logs.filter((l) => l.severity === "info").length,
    debug: logs.filter((l) => l.severity === "debug").length,
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-7xl mx-auto space-y-3">
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
            All ({statusCounts.all})
          </button>
          <button
            onClick={() => setSeverityFilter("error")}
            className={`px-3 py-1 text-xs rounded-full border transition ${
              severityFilter === "error"
                ? "bg-[var(--color-crit)] text-white border-[var(--color-crit)]"
                : "bg-transparent text-[var(--color-muted)] border-[var(--color-border)] hover:border-[var(--color-text)]"
            }`}
          >
            Error ({statusCounts.error})
          </button>
          <button
            onClick={() => setSeverityFilter("warn")}
            className={`px-3 py-1 text-xs rounded-full border transition ${
              severityFilter === "warn"
                ? "bg-[var(--color-warn)] text-[#06222A] border-[var(--color-warn)]"
                : "bg-transparent text-[var(--color-muted)] border-[var(--color-border)] hover:border-[var(--color-text)]"
            }`}
          >
            Warn ({statusCounts.warn})
          </button>
          <button
            onClick={() => setSeverityFilter("info")}
            className={`px-3 py-1 text-xs rounded-full border transition ${
              severityFilter === "info"
                ? "bg-[var(--color-accent)] text-[#06222A] border-[var(--color-accent)]"
                : "bg-transparent text-[var(--color-muted)] border-[var(--color-border)] hover:border-[var(--color-text)]"
            }`}
          >
            Info ({statusCounts.info})
          </button>
          <button
            onClick={() => setSeverityFilter("debug")}
            className={`px-3 py-1 text-xs rounded-full border transition ${
              severityFilter === "debug"
                ? "bg-[var(--color-border)] text-[var(--color-text)] border-[var(--color-border)]"
                : "bg-transparent text-[var(--color-muted)] border-[var(--color-border)] hover:border-[var(--color-text)]"
            }`}
          >
            Debug ({statusCounts.debug})
          </button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-faint)]" />
            <input
              type="text"
              placeholder="Search logs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-48 pl-9 pr-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent text-xs"
            />
          </div>
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
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center h-full text-[var(--color-muted)]">
            No logs match your filters.
          </div>
        ) : (
          <Virtuoso
            ref={virtuosoRef}
            data={filtered}
            itemContent={(index, log) => <LogRow key={log.id} log={log} />}
            style={{ height: "100%" }}
          />
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-[var(--color-muted)] flex-shrink-0">
        <span>Showing {filtered.length} of {logs.length} logs</span>
        <span>Auto-refresh every 5s</span>
      </div>
    </div>
  );
}