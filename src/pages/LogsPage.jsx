import { useState, useEffect } from "react";
import {
  Search,
  ChevronDown,
  ChevronRight,
  Plus,
  Filter,
  Eye,
  EyeOff,
  AlertCircle,
  X,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { toast } from "react-hot-toast";
import TimePicker from "../components/common/TimePicker";
import { useAlerts } from "../context/AlertContext";
import { generateLogsFromAlerts } from "../utils/dataGenerator";

export default function LogsPage() {
  const { alerts, serverStatuses } = useAlerts();
  const [allLogs, setAllLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSystemLogs, setShowSystemLogs] = useState(true);
  const [showWindowsLogs, setShowWindowsLogs] = useState(true);
  const [systemExpanded, setSystemExpanded] = useState(true);
  const [windowsExpanded, setWindowsExpanded] = useState(true);

  // Label filter state
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [selectedValue, setSelectedValue] = useState(null);

  // Regenerate logs whenever alerts or serverStatuses change
  useEffect(() => {
    const generated = generateLogsFromAlerts(alerts, serverStatuses);
    setAllLogs(generated);
  }, [alerts, serverStatuses]);

  // Available labels (derived from the logs)
  const labels = [
    "service",
    "host",
    "level",
    "source",
  ];

  // Get unique values for a label
  const getLabelValues = (label) => {
    const values = new Set();
    allLogs.forEach((log) => {
      if (log[label]) values.add(log[label]);
    });
    return Array.from(values).sort();
  };

  // Filter logs
  const filteredLogs = allLogs.filter((log) => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.host.toLowerCase().includes(searchTerm.toLowerCase());
    let matchesLabel = true;
    if (selectedLabel) {
      if (selectedValue) {
        matchesLabel = log[selectedLabel] === selectedValue;
      } else {
        matchesLabel = log[selectedLabel] !== undefined && log[selectedLabel] !== null && log[selectedLabel] !== "";
      }
    }
    return matchesSearch && matchesLabel;
  });

  // Separate filtered logs
  const systemLogs = filteredLogs.filter((l) => l.source === "system");
  const windowsLogs = filteredLogs.filter((l) => l.source === "windows");
  const errorLogs = filteredLogs
    .filter((l) => l.level === "error")
    .slice(0, 20);

  const getSeverityCounts = (logs) => {
    const counts = { unknown: 0, debug: 0, info: 0, warn: 0, error: 0 };
    logs.forEach((log) => {
      if (counts[log.level] !== undefined) counts[log.level]++;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };
  const systemSeverity = getSeverityCounts(systemLogs);
  const windowsSeverity = getSeverityCounts(windowsLogs);

  const getTimelineData = (logs) => {
    const groups = {};
    logs.forEach((log) => {
      const hour = new Date(log.timestamp).getHours();
      const key = `${hour}:00`;
      if (!groups[key]) groups[key] = { time: key, count: 0 };
      groups[key].count++;
    });
    return Object.values(groups).slice(-8);
  };
  const systemTimeline = getTimelineData(systemLogs);
  const windowsTimeline = getTimelineData(windowsLogs);

  const severityBadge = (level) => {
    const colors = {
      unknown: "bg-[var(--color-faint)] text-white",
      debug: "bg-[var(--color-border)] text-[var(--color-muted)]",
      info: "bg-[var(--color-accent)] text-[#06222A]",
      warn: "bg-[var(--color-warn)] text-[#06222A]",
      error: "bg-[var(--color-crit)] text-white",
    };
    return colors[level] || colors.info;
  };

  const handleTimeChange = (time) => {
    toast.success(`Time range updated: ${time.range || time.from + " → " + time.to}`);
  };

  const handleLabelClick = (label) => {
    if (selectedLabel === label) {
      setSelectedLabel(null);
      setSelectedValue(null);
    } else {
      setSelectedLabel(label);
      setSelectedValue(null);
    }
  };

  const handleValueClick = (value) => {
    if (selectedValue === value) {
      setSelectedValue(null);
    } else {
      setSelectedValue(value);
    }
  };

  const clearFilter = () => {
    setSelectedLabel(null);
    setSelectedValue(null);
    setSearchTerm("");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Logs</h1>
          <p className="text-sm text-[var(--color-muted)]">Explore and analyze your logs</p>
        </div>
        <TimePicker onTimeChange={handleTimeChange} />
      </div>

      {/* Label bar */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          {labels.map((label) => (
            <button
              key={label}
              onClick={() => handleLabelClick(label)}
              className={`px-3 py-1.5 rounded-lg text-sm border transition ${
                selectedLabel === label
                  ? "bg-[var(--color-accent)] text-[#06222A] border-[var(--color-accent)]"
                  : "bg-transparent text-[var(--color-text)] border-[var(--color-border)] hover:bg-[var(--color-panel-alt)]"
              }`}
            >
              {label}
            </button>
          ))}
          <button className="px-3 py-1.5 rounded-lg text-sm text-[var(--color-accent)] border border-dashed border-[var(--color-border)] hover:bg-[var(--color-panel-alt)] transition flex items-center gap-1">
            <Plus size={14} />
            Add label tab
          </button>
        </div>
        {selectedLabel && (
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[var(--color-border)]">
            <span className="text-xs text-[var(--color-muted)]">{selectedLabel}</span>
            {getLabelValues(selectedLabel).map((value) => (
              <button
                key={value}
                onClick={() => handleValueClick(value)}
                className={`px-2 py-0.5 rounded text-xs transition ${
                  selectedValue === value
                    ? "bg-[var(--color-accent)] text-[#06222A]"
                    : "text-[var(--color-text)] hover:bg-[var(--color-panel-alt)]"
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search and count */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-faint)]" />
          <input
            type="text"
            placeholder="Search values"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-faint)] text-sm focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
          />
        </div>
        <span className="text-xs text-[var(--color-muted)]">
          Showing {filteredLogs.length} of {allLogs.length}
        </span>
        {(selectedLabel || searchTerm) && (
          <button
            onClick={clearFilter}
            className="flex items-center gap-1 text-xs text-[var(--color-accent)] hover:underline"
          >
            <X size={14} />
            Clear filter
          </button>
        )}
        {selectedLabel && selectedValue && (
          <span className="text-xs bg-[var(--color-accent)]/10 text-[var(--color-accent)] px-2 py-0.5 rounded-full border border-[var(--color-accent)]/30">
            {selectedLabel}: {selectedValue}
          </span>
        )}
      </div>

      {/* Main content */}
      <div className="space-y-4">
        {/* System Section */}
        <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg overflow-hidden">
          <div
            onClick={() => setSystemExpanded(!systemExpanded)}
            className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-[var(--color-panel-alt)] transition"
          >
            <div className="flex items-center gap-4">
              <span className="text-[var(--color-text)] font-medium">System</span>
              <button
                onClick={(e) => { e.stopPropagation(); setShowSystemLogs(!showSystemLogs); }}
                className="text-xs text-[var(--color-accent)] hover:underline"
              >
                {showSystemLogs ? "Hide logs" : "Show logs"}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); toast.info("Include toggled"); }}
                className="text-xs text-[var(--color-muted)] hover:text-[var(--color-text)]"
              >
                Include
              </button>
            </div>
            {systemExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </div>

          {systemExpanded && (
            <div className="px-4 pb-4 space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-[var(--color-border)] text-[var(--color-muted)] text-xs uppercase tracking-wider">
                      <th className="py-2 px-3 font-medium">Name</th>
                      <th className="py-2 px-3 font-medium text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {systemSeverity.map((item) => (
                      <tr key={item.name} className="border-b border-[var(--color-border)]">
                        <td className="py-1.5 px-3 text-[var(--color-text)] capitalize">{item.name}</td>
                        <td className="py-1.5 px-3 text-right font-mono text-[var(--color-text)]">{item.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ height: 80 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={systemTimeline}>
                    <CartesianGrid stroke="var(--color-border)" vertical={false} />
                    <XAxis dataKey="time" tick={{ fontSize: 9, fill: "var(--color-faint)" }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 9, fill: "var(--color-faint)" }} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: "var(--color-panel)", border: "1px solid var(--color-border)", borderRadius: "6px", fontSize: "10px", color: "var(--color-text)" }} />
                    <Bar dataKey="count" fill="var(--color-accent)" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {showSystemLogs && (
                <div className="max-h-40 overflow-y-auto space-y-0.5 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg)] p-1">
                  {systemLogs.length === 0 ? (
                    <div className="text-center py-2 text-[var(--color-muted)] text-sm">No system logs</div>
                  ) : (
                    systemLogs.slice(0, 15).map((log) => (
                      <div key={log.id} className="flex items-start gap-2 px-2 py-1 hover:bg-[var(--color-panel-alt)] rounded text-xs">
                        <span className="text-[var(--color-faint)] font-mono whitespace-nowrap">{log.timestamp}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${severityBadge(log.level)}`}>
                          {log.level}
                        </span>
                        <span className="text-[var(--color-text)] break-all">{log.message}</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Windows-event Section */}
        <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg overflow-hidden">
          <div
            onClick={() => setWindowsExpanded(!windowsExpanded)}
            className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-[var(--color-panel-alt)] transition"
          >
            <div className="flex items-center gap-4">
              <span className="text-[var(--color-text)] font-medium">Windows-event</span>
              <button
                onClick={(e) => { e.stopPropagation(); setShowWindowsLogs(!showWindowsLogs); }}
                className="text-xs text-[var(--color-accent)] hover:underline"
              >
                {showWindowsLogs ? "Hide logs" : "Show logs"}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); toast.info("Include toggled"); }}
                className="text-xs text-[var(--color-muted)] hover:text-[var(--color-text)]"
              >
                Include
              </button>
            </div>
            {windowsExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </div>

          {windowsExpanded && (
            <div className="px-4 pb-4 space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-[var(--color-border)] text-[var(--color-muted)] text-xs uppercase tracking-wider">
                      <th className="py-2 px-3 font-medium">Name</th>
                      <th className="py-2 px-3 font-medium text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {windowsSeverity.map((item) => (
                      <tr key={item.name} className="border-b border-[var(--color-border)]">
                        <td className="py-1.5 px-3 text-[var(--color-text)] capitalize">{item.name}</td>
                        <td className="py-1.5 px-3 text-right font-mono text-[var(--color-text)]">{item.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ height: 80 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={windowsTimeline}>
                    <CartesianGrid stroke="var(--color-border)" vertical={false} />
                    <XAxis dataKey="time" tick={{ fontSize: 9, fill: "var(--color-faint)" }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 9, fill: "var(--color-faint)" }} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: "var(--color-panel)", border: "1px solid var(--color-border)", borderRadius: "6px", fontSize: "10px", color: "var(--color-text)" }} />
                    <Bar dataKey="count" fill="var(--color-warn)" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {showWindowsLogs && (
                <div className="max-h-40 overflow-y-auto space-y-0.5 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg)] p-1">
                  {windowsLogs.length === 0 ? (
                    <div className="text-center py-2 text-[var(--color-muted)] text-sm">No Windows logs</div>
                  ) : (
                    windowsLogs.slice(0, 15).map((log) => (
                      <div key={log.id} className="flex items-start gap-2 px-2 py-1 hover:bg-[var(--color-panel-alt)] rounded text-xs">
                        <span className="text-[var(--color-faint)] font-mono whitespace-nowrap">{log.timestamp}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${severityBadge(log.level)}`}>
                          {log.level}
                        </span>
                        <span className="text-[var(--color-text)] break-all">{log.message}</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Data source info */}
        <div className="flex items-center gap-4 text-sm text-[var(--color-muted)]">
          <span>Data source: <span className="text-[var(--color-text)] font-mono">loki</span></span>
          <span>Last 3 hours</span>
        </div>

        {/* Error Log */}
        <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-[var(--color-border)]">
            <span className="text-[var(--color-text)] font-medium">Error Log</span>
          </div>
          <div className="max-h-64 overflow-y-auto p-2 space-y-0.5 bg-[var(--color-bg)]">
            {errorLogs.length === 0 ? (
              <div className="text-center py-4 text-[var(--color-muted)] text-sm">No errors found</div>
            ) : (
              errorLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-2 px-2 py-1 hover:bg-[var(--color-panel-alt)] rounded text-xs font-mono">
                  <span className="text-[var(--color-faint)] whitespace-nowrap">{log.timestamp}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${severityBadge(log.level)}`}>
                    {log.level === "error" ? "ERROR" : log.level.toUpperCase()}
                  </span>
                  <span className="text-[var(--color-text)] break-all">{log.message}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}