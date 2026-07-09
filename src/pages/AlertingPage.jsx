import { useState, useEffect } from "react";
import { Search, RefreshCw, BellOff, CheckCircle, AlertCircle, Clock, Play, Pause } from "lucide-react";
import { toast } from "react-hot-toast";
import Card from "../components/common/Card";
import StatusDot from "../components/common/StatusDot";
import { initialRules, generateNewAlertRule, initialAlertHistory } from "../data/alertRules";
import { useWebSocket } from "../context/WebSocketContext";
import { logAction } from "../services/auditService"; // ✅ Import audit

export default function AlertingPage() {
  const [rules, setRules] = useState(initialRules);
  const [history, setHistory] = useState(initialAlertHistory);
  const [filteredRules, setFilteredRules] = useState(rules);
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const { lastMessage } = useWebSocket();

  // Auto-refresh every 10 seconds (kept as fallback)
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      refreshData(false);
    }, 10000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  // React to WebSocket messages
  useEffect(() => {
    if (!lastMessage) return;
    if (lastMessage.type === "alert") {
      const newAlert = lastMessage.payload;
      setRules((prev) => {
        const exists = prev.find((r) => r.name === newAlert.name);
        if (exists) {
          return prev.map((r) =>
            r.name === newAlert.name ? { ...r, ...newAlert } : r
          );
        } else {
          return [...prev, { ...newAlert, id: Date.now() }];
        }
      });
      setHistory((prev) =>
        [
          {
            id: Date.now(),
            ruleName: newAlert.name,
            severity: newAlert.severity,
            timestamp: new Date().toLocaleString(),
            status: "triggered",
          },
          ...prev,
        ].slice(0, 50)
      );
    }
  }, [lastMessage]);

  const refreshData = (showToast = true) => {
    setIsRefreshing(true);
    setTimeout(() => {
      const newRule = generateNewAlertRule();
      setRules((prev) => {
        if (Math.random() > 0.5) {
          const idx = Math.floor(Math.random() * prev.length);
          const updated = [...prev];
          updated[idx] = { ...newRule, id: prev[idx].id };
          return updated;
        } else {
          return [...prev, newRule];
        }
      });
      const newHistoryEntry = {
        id: Date.now(),
        ruleName: newRule.name,
        severity: newRule.severity,
        timestamp: new Date().toLocaleString(),
        status: "triggered",
      };
      setHistory((prev) => [newHistoryEntry, ...prev].slice(0, 50));
      if (showToast) toast.success("Alert rules updated");
      setIsRefreshing(false);
    }, 600);
  };

  // Apply filters
  useEffect(() => {
    let result = rules;
    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter((r) => r.name.toLowerCase().includes(term));
    }
    if (severityFilter !== "all") {
      result = result.filter((r) => r.severity === severityFilter);
    }
    setFilteredRules(result);
  }, [search, severityFilter, rules]);

  // ✅ Updated handlers with audit logging
  const handleSilence = (id) => {
    logAction("alert_silenced", { id });
    toast.success(`Alert rule silenced (mock)`);
  };

  const handleAcknowledge = (id) => {
    logAction("alert_acknowledged", { id });
    toast.success(`Alert acknowledged (mock)`);
  };

  const statusCounts = {
    all: rules.length,
    critical: rules.filter((r) => r.severity === "critical").length,
    warning: rules.filter((r) => r.severity === "warning").length,
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
            onClick={() => setSeverityFilter("critical")}
            className={`px-3 py-1 text-xs rounded-full border transition ${
              severityFilter === "critical"
                ? "bg-[var(--color-crit)] text-white border-[var(--color-crit)]"
                : "bg-transparent text-[var(--color-muted)] border-[var(--color-border)] hover:border-[var(--color-text)]"
            }`}
          >
            Critical ({statusCounts.critical})
          </button>
          <button
            onClick={() => setSeverityFilter("warning")}
            className={`px-3 py-1 text-xs rounded-full border transition ${
              severityFilter === "warning"
                ? "bg-[var(--color-warn)] text-[#06222A] border-[var(--color-warn)]"
                : "bg-transparent text-[var(--color-muted)] border-[var(--color-border)] hover:border-[var(--color-text)]"
            }`}
          >
            Warning ({statusCounts.warning})
          </button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-faint)]" />
            <input
              type="text"
              placeholder="Search alert rules..."
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
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`p-2 rounded-lg border transition ${
              autoRefresh
                ? "border-[var(--color-accent)] text-[var(--color-accent)]"
                : "border-[var(--color-border)] text-[var(--color-muted)]"
            } hover:text-[var(--color-text)] hover:border-[var(--color-text)]`}
            title={autoRefresh ? "Auto-refresh on" : "Auto-refresh off"}
          >
            {autoRefresh ? <Play size={16} /> : <Pause size={16} />}
          </button>
        </div>
      </div>

      {/* Two columns: rules + history */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 flex-1">
        {/* Rules */}
        <div className="lg:col-span-2 bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg overflow-hidden flex flex-col">
          <div className="px-3 py-2 border-b border-[var(--color-border)] text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider">
            Alert Rules
          </div>
          <div className="overflow-y-auto flex-1">
            {filteredRules.length === 0 ? (
              <div className="flex items-center justify-center h-full text-[var(--color-muted)] text-sm">
                No rules match.
              </div>
            ) : (
              filteredRules.map((rule) => (
                <div
                  key={rule.id}
                  className="flex items-center gap-3 px-3 py-2 border-b border-[var(--color-border)] hover:bg-[var(--color-panel-alt)] transition-colors text-xs"
                >
                  <StatusDot state={rule.severity === "critical" ? "crit" : "warn"} />
                  <span className="text-[var(--color-text)] flex-1">{rule.name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                    rule.status === "firing" ? "bg-[var(--color-crit)] text-white" :
                    rule.status === "pending" ? "bg-[var(--color-warn)] text-[#06222A]" :
                    "bg-[var(--color-ok)] text-[#06222A]"
                  }`}>
                    {rule.status}
                  </span>
                  <span className="text-[var(--color-faint)]">{rule.threshold}</span>
                  <span className="text-[var(--color-muted)]">{rule.lastTriggered}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleSilence(rule.id)}
                      className="p-1 rounded hover:bg-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-text)] transition"
                      title="Silence"
                    >
                      <BellOff size={14} />
                    </button>
                    <button
                      onClick={() => handleAcknowledge(rule.id)}
                      className="p-1 rounded hover:bg-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-text)] transition"
                      title="Acknowledge"
                    >
                      <CheckCircle size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* History */}
        <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg overflow-hidden flex flex-col">
          <div className="px-3 py-2 border-b border-[var(--color-border)] text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider">
            Recent Activity
          </div>
          <div className="overflow-y-auto flex-1">
            {history.length === 0 ? (
              <div className="flex items-center justify-center h-full text-[var(--color-muted)] text-sm">
                No activity.
              </div>
            ) : (
              history.map((entry) => (
                <div key={entry.id} className="px-3 py-1.5 border-b border-[var(--color-border)] text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`capitalize text-[10px] font-medium ${
                      entry.status === "triggered" ? "text-[var(--color-crit)]" :
                      entry.status === "acknowledged" ? "text-[var(--color-warn)]" :
                      "text-[var(--color-ok)]"
                    }`}>
                      {entry.status}
                    </span>
                    <span className="text-[var(--color-text)] flex-1">{entry.ruleName}</span>
                    <span className="text-[var(--color-faint)]">{new Date(entry.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-[var(--color-muted)] flex-shrink-0">
        <span>Showing {filteredRules.length} of {rules.length} rules</span>
        <span>{autoRefresh ? "Auto-refresh every 10s" : "Auto-refresh paused"}</span>
      </div>
    </div>
  );
}