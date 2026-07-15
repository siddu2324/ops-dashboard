// src/pages/TracesPage.jsx
import { useState, useEffect, useMemo } from "react";
import {
  Search,
  ChevronDown,
  Grid,
  List,
  Rows,
  Plus,
  AlertCircle,
  Activity,
} from "lucide-react";
import { toast } from "react-hot-toast";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import TimePicker from "../components/common/TimePicker";
import ComparisonView from "../components/ComparisonView";
import TracesListView from "../components/TracesListView";
import { useAlerts } from "../context/AlertContext";
import { serverInventory } from "../data/servers";

// Generate realistic trace data from server statuses and alerts
const generateRealisticTraces = (alerts, serverStatuses) => {
  const traces = [];
  const now = Date.now();

  // Service names derived from server hostnames
  const getServiceName = (hostname) => {
    const host = serverInventory.find(s => s.hostname === hostname);
    if (!host) return hostname;
    const os = host.os || "";
    if (os.includes("Windows")) return `${hostname}-windows`;
    if (os.includes("Linux") || os.includes("Ubuntu")) return `${hostname}-linux`;
    return hostname;
  };

  // Get OS type for service categorization
  const getOSType = (hostname) => {
    const host = serverInventory.find(s => s.hostname === hostname);
    if (!host) return "unknown";
    if (host.os && host.os.includes("Windows")) return "windows";
    if (host.os && (host.os.includes("Linux") || host.os.includes("Ubuntu"))) return "linux";
    return "unknown";
  };

  // Generate spans for a trace
  const generateSpans = (hostname, status, severity) => {
    const spans = [];
    const isError = status === "down" || severity === "Critical" || severity === "High";
    const baseDuration = Math.floor(50 + Math.random() * 500);
    const numSpans = Math.floor(Math.random() * 4) + 2;

    const spanNames = [
      "GET /health",
      "POST /api/v1/query",
      "GET /api/v1/status",
      "POST /api/v1/alert",
      "GET /metrics",
      "POST /api/v1/logs",
      "GET /api/v1/traces",
      "PUT /api/v1/config",
      "DELETE /api/v1/cache",
      "SELECT * FROM system_metrics",
      "INSERT INTO audit_log",
      "UPDATE server_status",
    ];

    for (let i = 0; i < numSpans; i++) {
      const spanDuration = Math.floor(baseDuration * (0.3 + Math.random() * 0.7));
      spans.push({
        name: spanNames[i % spanNames.length],
        duration: spanDuration,
        status: isError && i === 0 ? "error" : "success",
      });
    }
    return spans;
  };

  // Generate traces from server statuses
  Object.entries(serverStatuses).forEach(([hostname, data]) => {
    const status = data.status || "up";
    const severity = status === "down" ? "Critical" : status === "warning" ? "Warning" : "Information";
    const serviceName = getServiceName(hostname);
    const osType = getOSType(hostname);
    const duration = Math.floor(100 + Math.random() * 1900);
    const isError = status === "down" || status === "warning";
    const spans = generateSpans(hostname, status, severity);
    const traceStatus = isError ? "error" : "success";

    traces.push({
      id: `trace-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      service: serviceName,
      duration: duration,
      status: traceStatus,
      spans: spans,
      timestamp: new Date(now - Math.random() * 86400000 * 2).toISOString(),
      host: hostname,
      os: osType,
      severity: severity,
    });
  });

  // Add traces from alerts (if they have host info)
  alerts.forEach((alert) => {
    if (alert.host) {
      const serviceName = getServiceName(alert.host);
      const severity = alert.severity || "Information";
      const isError = severity === "Critical" || severity === "High";
      const duration = Math.floor(100 + Math.random() * 2000);
      const spans = generateSpans(alert.host, isError ? "warning" : "up", severity);

      traces.push({
        id: `trace-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
        service: serviceName,
        duration: duration,
        status: isError ? "error" : "success",
        spans: spans,
        timestamp: new Date(now - Math.random() * 86400000 * 2).toISOString(),
        host: alert.host,
        alertName: alert.alertname,
        severity: severity,
      });
    }
  });

  // Sort by timestamp descending
  return traces.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

// Generate chart data from traces
const generateChartDataFromTraces = (traces, metricType = "spanRate", points = 20) => {
  const now = Date.now();
  const data = [];

  // Group traces by time intervals
  const intervals = {};
  traces.forEach((trace) => {
    const time = new Date(trace.timestamp);
    const key = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (!intervals[key]) {
      intervals[key] = { time: key, count: 0, errors: 0, latency: [] };
    }
    intervals[key].count++;
    if (trace.status === "error") intervals[key].errors++;
    intervals[key].latency.push(trace.duration);
  });

  // Convert to array and limit to latest points
  const sorted = Object.values(intervals).slice(-points);

  return sorted.map((item) => {
    const avgLatency = item.latency.reduce((a, b) => a + b, 0) / (item.latency.length || 1);
    return {
      time: item.time,
      spanRate: item.count,
      errorRate: Math.round((item.errors / (item.count || 1)) * 100),
      latency: Math.round(avgLatency),
    };
  });
};

// Chart configuration
const chartConfigs = [
  { key: "spanRate", label: "Span rate", color: "#22D3EE" },
  { key: "errorRate", label: "Error rate", color: "#F87171" },
  { key: "latency", label: "Latency (ms)", color: "#FBBF24" },
];

export default function TracesPage() {
  const { alerts, serverStatuses } = useAlerts();
  const [dataSource, setDataSource] = useState("grafana");
  const [filterMode, setFilterMode] = useState("root");
  const [labelValue, setLabelValue] = useState("");
  const [metricType, setMetricType] = useState("span-rate");
  const [selectedAttribute, setSelectedAttribute] = useState("resource.service.name");
  const [attributeSearch, setAttributeSearch] = useState("");
  const [attributeTab, setAttributeTab] = useState("all");
  const [traceId, setTraceId] = useState("");
  const [viewMode, setViewMode] = useState("single");
  const [activeTab, setActiveTab] = useState("structure");
  const [traces, setTraces] = useState([]);
  const [chartData, setChartData] = useState([]);

  // Generate traces when alerts or serverStatuses change
  useEffect(() => {
    if (serverStatuses && Object.keys(serverStatuses).length > 0) {
      const newTraces = generateRealisticTraces(alerts, serverStatuses);
      setTraces(newTraces);
      const newChartData = generateChartDataFromTraces(newTraces, metricType, 20);
      setChartData(newChartData);
    }
  }, [alerts, serverStatuses]);

  // Attribute data derived from traces
  const attributes = {
    favorites: ["resource.service.name", "http.method", "http.status_code"],
    all: [
      "resource.service.name",
      "http.method",
      "http.status_code",
      "db.system",
      "db.statement",
      "net.peer.name",
      "net.peer.port",
      "http.url",
      "http.route",
      "http.user_agent",
    ],
    resource: ["resource.service.name", "resource.service.namespace", "resource.telemetry.sdk.name"],
    span: ["http.method", "http.status_code", "db.system", "db.statement", "http.url"],
  };

  const filteredAttributes = (attributes[attributeTab] || []).filter((attr) =>
    attr.toLowerCase().includes(attributeSearch.toLowerCase())
  );

  const handleTraceIdSubmit = (e) => {
    e.preventDefault();
    if (traceId.trim()) {
      const found = traces.find(t => t.id.includes(traceId));
      if (found) {
        toast.success(`Trace ${traceId} found!`);
      } else {
        toast.error(`Trace ${traceId} not found`);
      }
    }
  };

  const handleTimeChange = (time) => {
    toast.success(`Time range updated: ${time.range || time.from + " → " + time.to}`);
  };

  // Get latest values for stats
  const latestData = chartData[chartData.length - 1] || { spanRate: 0, errorRate: 0, latency: 0 };

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      {/* Header with breadcrumb and TimePicker */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-[var(--color-muted)]">Drilldown</span>
          <ChevronDown size={12} className="text-[var(--color-muted)]" />
          <span className="text-[var(--color-muted)]">Traces</span>
          <ChevronDown size={12} className="text-[var(--color-muted)]" />
          <span className="text-[var(--color-text)] font-semibold">Traces Drilldown</span>
        </div>
        <TimePicker onTimeChange={handleTimeChange} />
      </div>

      {/* Data source + filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-[var(--color-muted)]">Data source</span>
          <select
            value={dataSource}
            onChange={(e) => setDataSource(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] text-sm focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
          >
            <option value="grafana">Grafana</option>
            <option value="tempo">Tempo</option>
            <option value="jaeger">Jaeger</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterMode("root")}
            className={`px-3 py-1 text-sm rounded-full border transition ${
              filterMode === "root"
                ? "bg-[var(--color-accent)] text-[#06222A] border-[var(--color-accent)]"
                : "bg-transparent text-[var(--color-muted)] border-[var(--color-border)] hover:border-[var(--color-text)]"
            }`}
          >
            Root spans
          </button>
          <button
            onClick={() => setFilterMode("all")}
            className={`px-3 py-1 text-sm rounded-full border transition ${
              filterMode === "all"
                ? "bg-[var(--color-accent)] text-[#06222A] border-[var(--color-accent)]"
                : "bg-transparent text-[var(--color-muted)] border-[var(--color-border)] hover:border-[var(--color-text)]"
            }`}
          >
            All spans
          </button>
        </div>
        <div className="flex items-center gap-1">
          <Plus size={14} className="text-[var(--color-muted)]" />
          <input
            type="text"
            placeholder="label = value"
            value={labelValue}
            onChange={(e) => setLabelValue(e.target.value)}
            className="px-2 py-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-faint)] text-sm focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent w-32"
          />
        </div>
        <div>
          <select
            value={metricType}
            onChange={(e) => setMetricType(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] text-sm focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
          >
            <option value="span-rate">Span rate</option>
            <option value="error-rate">Error rate</option>
            <option value="latency">Latency</option>
          </select>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-3 text-center">
          <div className="text-xs text-[var(--color-muted)]">Span rate</div>
          <div className="text-2xl font-bold text-[var(--color-text)]">
            {latestData.spanRate || traces.length}
          </div>
          <div className="text-xs text-[var(--color-faint)]">Last update: now</div>
        </div>
        <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-3 text-center">
          <div className="text-xs text-[var(--color-muted)]">Error rate</div>
          <div className="text-2xl font-bold text-[var(--color-crit)]">
            {latestData.errorRate || 0}%
          </div>
          <div className="text-xs text-[var(--color-faint)]">Last update: now</div>
        </div>
        <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-3 text-center">
          <div className="text-xs text-[var(--color-muted)]">Latency</div>
          <div className="text-2xl font-bold text-[var(--color-text)]">
            {latestData.latency || 0}ms
          </div>
          <div className="text-xs text-[var(--color-faint)]">Last update: now</div>
        </div>
      </div>

      {/* Breakdown tabs */}
      <div className="flex items-center border-b border-[var(--color-border)]">
        <button
          onClick={() => setActiveTab("structure")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
            activeTab === "structure"
              ? "border-[var(--color-accent)] text-[var(--color-accent)]"
              : "border-transparent text-[var(--color-muted)] hover:text-[var(--color-text)]"
          }`}
        >
          Service structure
        </button>
        <button
          onClick={() => setActiveTab("comparison")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
            activeTab === "comparison"
              ? "border-[var(--color-accent)] text-[var(--color-accent)]"
              : "border-transparent text-[var(--color-muted)] hover:text-[var(--color-text)]"
          }`}
        >
          Comparison
        </button>
        <button
          onClick={() => setActiveTab("traces")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
            activeTab === "traces"
              ? "border-[var(--color-accent)] text-[var(--color-accent)]"
              : "border-transparent text-[var(--color-muted)] hover:text-[var(--color-text)]"
          }`}
        >
          Traces
        </button>
      </div>

      {/* Two‑column layout: Attributes + Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Attributes sidebar */}
        <div className="lg:col-span-1 bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-3 space-y-3">
          <div className="text-sm text-[var(--color-muted)]">
            Attributes are ordered by their rate of requests per second.
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--color-muted)]">Rate</span>
            <span className="text-[var(--color-muted)]">Error</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm bg-[var(--color-panel-alt)] p-1.5 rounded">
              <span className="text-[var(--color-text)] font-medium">Selected:</span>
              <span className="text-[var(--color-accent)]">{selectedAttribute}</span>
            </div>
            <div className="relative">
              <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-[var(--color-faint)]" />
              <input
                type="text"
                placeholder="Search attributes..."
                value={attributeSearch}
                onChange={(e) => setAttributeSearch(e.target.value)}
                className="w-full pl-7 pr-2 py-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-faint)] text-xs focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
              />
            </div>
            <div className="flex gap-1 text-xs">
              <button
                onClick={() => setAttributeTab("favorites")}
                className={`px-2 py-0.5 rounded ${
                  attributeTab === "favorites" ? "bg-[var(--color-accent)] text-[#06222A]" : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
                }`}
              >
                Favorites
              </button>
              <button
                onClick={() => setAttributeTab("all")}
                className={`px-2 py-0.5 rounded ${
                  attributeTab === "all" ? "bg-[var(--color-accent)] text-[#06222A]" : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setAttributeTab("resource")}
                className={`px-2 py-0.5 rounded ${
                  attributeTab === "resource" ? "bg-[var(--color-accent)] text-[#06222A]" : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
                }`}
              >
                Resource
              </button>
              <button
                onClick={() => setAttributeTab("span")}
                className={`px-2 py-0.5 rounded ${
                  attributeTab === "span" ? "bg-[var(--color-accent)] text-[#06222A]" : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
                }`}
              >
                Span
              </button>
            </div>
            <div className="max-h-40 overflow-y-auto space-y-0.5">
              {filteredAttributes.map((attr) => (
                <div
                  key={attr}
                  className={`text-xs px-2 py-1 rounded cursor-pointer hover:bg-[var(--color-panel-alt)] ${
                    selectedAttribute === attr ? "bg-[var(--color-panel-alt)] text-[var(--color-accent)]" : "text-[var(--color-text)]"
                  }`}
                  onClick={() => setSelectedAttribute(attr)}
                >
                  {attr}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:col-span-3 space-y-3">
          {/* Search and view controls */}
          <div className="flex flex-wrap items-center gap-3">
            <form onSubmit={handleTraceIdSubmit} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Trace ID"
                value={traceId}
                onChange={(e) => setTraceId(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-faint)] text-sm focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent w-48"
              />
              <span className="text-xs text-[var(--color-muted)]">Enter an ID and press Enter</span>
            </form>
            <div className="flex items-center gap-1 ml-auto">
              <span className="text-xs text-[var(--color-muted)]">View</span>
              <button
                onClick={() => setViewMode("single")}
                className={`p-1.5 rounded transition ${
                  viewMode === "single" ? "bg-[var(--color-panel-alt)] text-[var(--color-accent)]" : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
                }`}
              >
                <Activity size={16} />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded transition ${
                  viewMode === "grid" ? "bg-[var(--color-panel-alt)] text-[var(--color-accent)]" : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
                }`}
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode("rows")}
                className={`p-1.5 rounded transition ${
                  viewMode === "rows" ? "bg-[var(--color-panel-alt)] text-[var(--color-accent)]" : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
                }`}
              >
                <Rows size={16} />
              </button>
            </div>
          </div>

          {/* Tab content */}
          {activeTab === "structure" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {chartConfigs.map((cfg) => {
                const data = chartData.map(d => ({
                  time: d.time,
                  value: d[cfg.key] || 0
                }));
                return (
                  <div
                    key={cfg.key}
                    className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-3"
                  >
                    <div className="text-xs font-medium text-[var(--color-muted)] mb-1">{cfg.label}</div>
                    <ResponsiveContainer width="100%" height={100}>
                      <AreaChart data={data}>
                        <defs>
                          <linearGradient id={`grad-${cfg.key}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={cfg.color} stopOpacity={0.3} />
                            <stop offset="100%" stopColor={cfg.color} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke="var(--color-border)" vertical={false} />
                        <XAxis
                          dataKey="time"
                          tick={{ fontSize: 8, fill: "var(--color-faint)" }}
                          tickLine={false}
                          axisLine={false}
                          interval={2}
                        />
                        <YAxis
                          tick={{ fontSize: 8, fill: "var(--color-faint)" }}
                          tickLine={false}
                          axisLine={false}
                          domain={[0, "auto"]}
                          width={20}
                        />
                        <Tooltip
                          contentStyle={{
                            background: "var(--color-panel)",
                            border: "1px solid var(--color-border)",
                            borderRadius: "6px",
                            fontSize: "10px",
                            color: "var(--color-text)",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke={cfg.color}
                          strokeWidth={2}
                          fill={`url(#grad-${cfg.key})`}
                          dot={false}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                    <div className="flex justify-between text-[10px] text-[var(--color-faint)] mt-1">
                      <span>Latest: {data[data.length - 1]?.value || 0}</span>
                      <span>⏱️ live</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === "comparison" && <ComparisonView />}

          {activeTab === "traces" && (
            <TracesListView traces={traces} />
          )}
        </div>
      </div>
    </div>
  );
}