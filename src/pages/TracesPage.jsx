import { useState, useEffect } from "react";
import { Search, RefreshCw, ChevronDown, ChevronUp, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import Card from "../components/common/Card";
import { initialTraces, generateNewTrace } from "../data/traces";

export default function TracesPage() {
  const [traces, setTraces] = useState(initialTraces);
  const [filtered, setFiltered] = useState(traces);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedTrace, setExpandedTrace] = useState(null);

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
      const newTrace = generateNewTrace();
      setTraces((prev) => {
        const combined = [newTrace, ...prev];
        return combined.slice(0, 100); // keep last 100 traces
      });
      if (showToast) toast.success("New trace added");
      setIsRefreshing(false);
    }, 500);
  };

  // Apply filters
  useEffect(() => {
    let result = traces;
    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.id.toLowerCase().includes(term) ||
          t.service.toLowerCase().includes(term)
      );
    }
    if (statusFilter !== "all") {
      result = result.filter((t) => t.status === statusFilter);
    }
    setFiltered(result);
  }, [search, statusFilter, traces]);

  const toggleExpand = (id) => {
    setExpandedTrace(expandedTrace === id ? null : id);
  };

  const statusCounts = {
    all: traces.length,
    success: traces.filter((t) => t.status === "success").length,
    error: traces.filter((t) => t.status === "error").length,
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-7xl mx-auto space-y-3">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between flex-shrink-0">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1 text-xs rounded-full border transition ${
              statusFilter === "all"
                ? "bg-[var(--color-accent)] text-[#06222A] border-[var(--color-accent)]"
                : "bg-transparent text-[var(--color-muted)] border-[var(--color-border)] hover:border-[var(--color-text)]"
            }`}
          >
            All ({statusCounts.all})
          </button>
          <button
            onClick={() => setStatusFilter("success")}
            className={`px-3 py-1 text-xs rounded-full border transition ${
              statusFilter === "success"
                ? "bg-[var(--color-ok)] text-[#06222A] border-[var(--color-ok)]"
                : "bg-transparent text-[var(--color-muted)] border-[var(--color-border)] hover:border-[var(--color-text)]"
            }`}
          >
            Success ({statusCounts.success})
          </button>
          <button
            onClick={() => setStatusFilter("error")}
            className={`px-3 py-1 text-xs rounded-full border transition ${
              statusFilter === "error"
                ? "bg-[var(--color-crit)] text-white border-[var(--color-crit)]"
                : "bg-transparent text-[var(--color-muted)] border-[var(--color-border)] hover:border-[var(--color-text)]"
            }`}
          >
            Error ({statusCounts.error})
          </button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-faint)]" />
            <input
              type="text"
              placeholder="Search trace ID or service..."
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
        </div>
      </div>

      {/* Trace list */}
      <div className="flex-1 bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center h-full text-[var(--color-muted)]">
            No traces match your filters.
          </div>
        ) : (
          <div className="overflow-y-auto h-full">
            {filtered.map((trace) => {
              const isExpanded = expandedTrace === trace.id;
              return (
                <div key={trace.id} className="border-b border-[var(--color-border)]">
                  {/* Trace summary */}
                  <div
                    className="flex items-center gap-3 px-3 py-2 hover:bg-[var(--color-panel-alt)] cursor-pointer transition"
                    onClick={() => toggleExpand(trace.id)}
                  >
                    <div className="flex-1 flex items-center gap-3 text-xs">
                      <span className="font-mono text-[var(--color-text)] w-28 truncate">
                        {trace.id}
                      </span>
                      <span className="text-[var(--color-muted)] w-24">{trace.service}</span>
                      <span className="text-[var(--color-text)] font-mono w-16">
                        {trace.duration}ms
                      </span>
                      <span className="flex items-center gap-1">
                        {trace.status === "success" ? (
                          <CheckCircle size={14} className="text-[var(--color-ok)]" />
                        ) : (
                          <AlertCircle size={14} className="text-[var(--color-crit)]" />
                        )}
                        <span className={`capitalize ${trace.status === "success" ? "text-[var(--color-ok)]" : "text-[var(--color-crit)]"}`}>
                          {trace.status}
                        </span>
                      </span>
                      <span className="text-[var(--color-faint)] font-mono">
                        {new Date(trace.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <button className="text-[var(--color-muted)] hover:text-[var(--color-text)]">
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="px-3 py-2 bg-[var(--color-bg)] border-t border-[var(--color-border)]">
                      <div className="text-xs text-[var(--color-muted)] mb-1">Spans:</div>
                      <div className="space-y-1">
                        {trace.spans.map((span, idx) => (
                          <div key={idx} className="flex items-center gap-3 text-xs">
                            <span className="text-[var(--color-text)] w-32">{span.name}</span>
                            <span className="text-[var(--color-faint)] font-mono w-16">{span.duration}ms</span>
                            <span className={`capitalize ${span.status === "success" ? "text-[var(--color-ok)]" : "text-[var(--color-crit)]"}`}>
                              {span.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-[var(--color-muted)] flex-shrink-0">
        <span>Showing {filtered.length} of {traces.length} traces</span>
        <span>Auto-refresh every 10s</span>
      </div>
    </div>
  );
}