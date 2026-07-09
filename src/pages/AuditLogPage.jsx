import { useState, useEffect } from "react";
import { Search, RefreshCw, Download, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import Card from "../components/common/Card";
import { getAuditLog, clearAuditLog } from "../services/auditService";

export default function AuditLogPage() {
  const [logs, setLogs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadLogs = () => {
    const data = getAuditLog();
    setLogs(data);
    setFiltered(data);
  };

  useEffect(() => {
    loadLogs();
    // Auto-refresh every 10 seconds
    const interval = setInterval(() => {
      loadLogs();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(logs);
      return;
    }
    const term = search.toLowerCase();
    const result = logs.filter(
      (entry) =>
        entry.user.toLowerCase().includes(term) ||
        entry.action.toLowerCase().includes(term) ||
        JSON.stringify(entry.details).toLowerCase().includes(term)
    );
    setFiltered(result);
  }, [search, logs]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadLogs();
    setTimeout(() => setIsRefreshing(false), 400);
    toast.success("Audit log refreshed");
  };

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear the entire audit log?")) {
      clearAuditLog();
      loadLogs();
      toast.success("Audit log cleared");
    }
  };

  const handleExport = () => {
    if (filtered.length === 0) {
      toast.error("No data to export");
      return;
    }
    // Build CSV
    const headers = ["Timestamp", "User", "Action", "Details"];
    const rows = filtered.map((entry) => [
      new Date(entry.timestamp).toLocaleString(),
      entry.user,
      entry.action,
      JSON.stringify(entry.details),
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `audit-log-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Export started");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-7xl mx-auto space-y-3">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between flex-shrink-0">
        <div className="relative flex-1 sm:flex-initial w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-faint)]" />
          <input
            type="text"
            placeholder="Search by user, action, or details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent text-xs"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] text-[var(--color-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-text)] transition disabled:opacity-50"
          >
            <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
          </button>
          <button
            onClick={handleExport}
            className="p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] text-[var(--color-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-text)] transition"
          >
            <Download size={16} />
          </button>
          <button
            onClick={handleClear}
            className="p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] text-[var(--color-crit)] hover:text-[var(--color-crit)]/80 hover:border-[var(--color-crit)] transition"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Log table */}
      <div className="flex-1 bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg overflow-hidden">
        <div className="overflow-y-auto h-full">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-[var(--color-panel)] border-b border-[var(--color-border)]">
              <tr>
                <th className="px-3 py-2 text-[var(--color-muted)] font-medium w-40">Timestamp</th>
                <th className="px-3 py-2 text-[var(--color-muted)] font-medium w-20">User</th>
                <th className="px-3 py-2 text-[var(--color-muted)] font-medium w-28">Action</th>
                <th className="px-3 py-2 text-[var(--color-muted)] font-medium">Details</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-10 text-[var(--color-muted)]">
                    No audit log entries.
                  </td>
                </tr>
              ) : (
                filtered.map((entry) => (
                  <tr key={entry.id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-panel-alt)]">
                    <td className="px-3 py-1.5 text-[var(--color-faint)] font-mono whitespace-nowrap">
                      {new Date(entry.timestamp).toLocaleString()}
                    </td>
                    <td className="px-3 py-1.5 text-[var(--color-text)] capitalize">{entry.user}</td>
                    <td className="px-3 py-1.5">
                      <span className="px-2 py-0.5 rounded-full bg-[var(--color-border)] text-[var(--color-text)]">
                        {entry.action}
                      </span>
                    </td>
                    <td className="px-3 py-1.5 text-[var(--color-muted)] font-mono text-[10px] truncate max-w-[300px]">
                      {JSON.stringify(entry.details)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-[var(--color-muted)] flex-shrink-0">
        <span>Showing {filtered.length} of {logs.length} entries</span>
        <span>Auto-refresh every 10s</span>
      </div>
    </div>
  );
}