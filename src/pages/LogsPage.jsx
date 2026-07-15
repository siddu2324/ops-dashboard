// src/pages/LogsPage.jsx
import { useState, useEffect, useRef } from "react";
import {
  Search,
  ChevronDown,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  X,
  Copy,
} from "lucide-react";
import { toast } from "react-hot-toast";
import TimePicker from "../components/common/TimePicker";
import Card from "../components/common/Card";
import { useAlerts } from "../context/AlertContext";
import { generateRealisticLogsFromState } from "../utils/dataGenerator";

// Severity badge colors
const severityBadge = (level) => {
  const colors = {
    Information: "bg-[var(--color-accent)] text-[#06222A]",
    Warning: "bg-[var(--color-warn)] text-[#06222A]",
    Error: "bg-[var(--color-crit)] text-white",
    Critical: "bg-[var(--color-crit)] text-white",
    Verbose: "bg-[var(--color-border)] text-[var(--color-muted)]",
  };
  return colors[level] || colors.Information;
};

// Log Entry Component
const LogEntry = ({ log, onExpand, isExpanded, onCopy }) => {
  const { timestamp, level, message, ...details } = log;

  return (
    <div
      className={`border-b border-[var(--color-border)] hover:bg-[var(--color-panel-alt)] transition-colors ${
        isExpanded ? "bg-[var(--color-panel-alt)]" : ""
      }`}
    >
      <div
        className="flex items-start gap-3 px-3 py-2 cursor-pointer group"
        onClick={() => onExpand(log.id)}
      >
        {/* Timestamp */}
        <span className="text-[var(--color-faint)] font-mono text-xs whitespace-nowrap min-w-[180px]">
          {timestamp}
        </span>

        {/* Level Badge */}
        <span className={`px-2 py-0.5 rounded text-xs font-medium flex-shrink-0 ${severityBadge(level)}`}>
          {level}
        </span>

        {/* Message Preview */}
        <span className="text-[var(--color-text)] text-sm flex-1 truncate">
          {message}
        </span>

        {/* Expand/Collapse */}
        <button className="text-[var(--color-muted)] hover:text-[var(--color-text)] flex-shrink-0">
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>

        {/* Copy button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCopy(log);
          }}
          className="text-[var(--color-muted)] hover:text-[var(--color-accent)] flex-shrink-0 opacity-0 group-hover:opacity-100 transition"
          title="Copy log"
        >
          <Copy size={14} />
        </button>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-3 pb-3 pt-1 border-t border-[var(--color-border)]/50 bg-[var(--color-bg)] rounded-b-lg">
          <div className="font-mono text-xs text-[var(--color-text)] overflow-x-auto">
            <pre className="whitespace-pre-wrap break-all max-h-96 overflow-y-auto p-3 bg-[var(--color-panel)] rounded border border-[var(--color-border)]">
              {JSON.stringify(details, null, 2)}
            </pre>
          </div>
          <div className="flex items-center gap-3 mt-2 text-xs text-[var(--color-muted)]">
            <button
              onClick={() => onCopy(log)}
              className="text-[var(--color-accent)] hover:underline flex items-center gap-1"
            >
              <Copy size={12} />
              Copy JSON
            </button>
            <span>•</span>
            <span>Record ID: {log.record_id || "N/A"}</span>
            {log.channel && <span>• Channel: {log.channel}</span>}
            {log.computer && <span>• Computer: {log.computer}</span>}
          </div>
        </div>
      )}
    </div>
  );
};

export default function LogsPage() {
  const { alerts, serverStatuses } = useAlerts();
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [levelFilter, setLevelFilter] = useState("all");
  const intervalRef = useRef(null);

  // Generate logs from current state
  const generateLogs = () => {
    setIsRefreshing(true);
    const newLogs = generateRealisticLogsFromState(alerts, serverStatuses);
    setLogs(newLogs);
    setFilteredLogs(newLogs);
    setIsRefreshing(false);
  };

  // Generate logs on mount only (not on every alert/status change)
  useEffect(() => {
    generateLogs();

    // Set up interval to refresh logs every 30 minutes (1800000 ms)
    intervalRef.current = setInterval(() => {
      generateLogs();
      toast.info("Logs refreshed (30‑minute cycle)", { duration: 3000 });
    }, 1800000);

    // Cleanup interval on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []); // Empty dependency array means this runs once on mount

  // Filter logs (on search/level changes)
  useEffect(() => {
    let result = logs;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter((log) => {
        const searchable = JSON.stringify(log).toLowerCase();
        return searchable.includes(term);
      });
    }

    if (levelFilter !== "all") {
      result = result.filter((log) => log.level === levelFilter);
    }

    setFilteredLogs(result);
  }, [searchTerm, logs, levelFilter]);

  const handleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleCopy = (log) => {
    const text = JSON.stringify(log, null, 2);
    navigator.clipboard.writeText(text);
    toast.success("Log copied to clipboard");
  };

  const handleTimeChange = (time) => {
    toast.success(`Time range updated: ${time.range || time.from + " → " + time.to}`);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setLevelFilter("all");
  };

  const levels = ["all", ...new Set(logs.map((log) => log.level))];

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Logs</h1>
          <p className="text-sm text-[var(--color-muted)]">
            Windows Event Logs • {filteredLogs.length} entries
          </p>
          <p className="text-xs text-[var(--color-faint)]">
            Auto‑refresh every 30 minutes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <TimePicker onTimeChange={handleTimeChange} />
          <button
            onClick={generateLogs}
            disabled={isRefreshing}
            className="p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] text-[var(--color-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-text)] transition disabled:opacity-50"
          >
            <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-faint)]" />
          <input
            type="text"
            placeholder="Search logs (message, channel, computer, event_id...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-faint)] text-sm focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--color-muted)]">Level:</span>
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-2 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] text-sm focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
          >
            {levels.map((level) => (
              <option key={level} value={level}>
                {level === "all" ? "All" : level}
              </option>
            ))}
          </select>
        </div>

        {(searchTerm || levelFilter !== "all") && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-xs text-[var(--color-accent)] hover:underline"
          >
            <X size={14} />
            Clear filters
          </button>
        )}

        <span className="text-xs text-[var(--color-muted)]">
          {filteredLogs.length} of {logs.length} logs
        </span>
      </div>

      {/* Log Table */}
      <Card>
        <div className="overflow-hidden">
          <div className="max-h-[calc(100vh-380px)] overflow-y-auto">
            {filteredLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <AlertCircle size={32} className="text-[var(--color-faint)] mb-3" />
                <p className="text-[var(--color-muted)]">No logs found</p>
                <p className="text-sm text-[var(--color-faint)]">Try adjusting your search or filters</p>
              </div>
            ) : (
              filteredLogs.map((log) => (
                <LogEntry
                  key={log.id}
                  log={log}
                  isExpanded={expandedId === log.id}
                  onExpand={handleExpand}
                  onCopy={handleCopy}
                />
              ))
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}