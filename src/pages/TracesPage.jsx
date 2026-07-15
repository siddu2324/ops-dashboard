// src/pages/TracesPage.jsx
import { useState, useEffect } from "react";
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
import { generateTracesFromAlerts, generateChartDataFromStatuses } from "../utils/dataGenerator";

// Fallback chart data generator (if util fails)
const fallbackChartData = (points = 10) => {
  const now = Date.now();
  return Array.from({ length: points }, (_, i) => {
    const time = new Date(now - (points - i) * 6000);
    return {
      time: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      value: Math.floor(Math.random() * 80) + 20,
    };
  });
};

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
  const [showQueryError, setShowQueryError] = useState(true);
  const [activeTab, setActiveTab] = useState("structure");
  const [traces, setTraces] = useState([]);
  const [chartData, setChartData] = useState({
    spanRate: fallbackChartData(),
    errorRate: fallbackChartData(),
    latency: fallbackChartData(),
    serviceStructure: fallbackChartData(),
    comparison: fallbackChartData(),
    traces: fallbackChartData(),
  });

  // Update data when alerts or serverStatuses change
  useEffect(() => {
    if (alerts && serverStatuses) {
      // Generate traces from alerts
      const generatedTraces = generateTracesFromAlerts(alerts, serverStatuses);
      setTraces(generatedTraces);

      // Generate chart data for each metric
      const spanRateData = generateChartDataFromStatuses(serverStatuses, "cpu", 20);
      const errorRateData = generateChartDataFromStatuses(serverStatuses, "memory", 20);
      const latencyData = generateChartDataFromStatuses(serverStatuses, "disk", 20);

      // For serviceStructure, comparison, traces – we can reuse one of the above or generate differently
      // Let's use a mix or just copy one
      setChartData({
        spanRate: spanRateData,
        errorRate: errorRateData,
        latency: latencyData,
        serviceStructure: spanRateData, // placeholder
        comparison: errorRateData,      // placeholder
        traces: latencyData,            // placeholder
      });
    } else {
      // Fallback to static random data if context not available
      setChartData({
        spanRate: fallbackChartData(),
        errorRate: fallbackChartData(),
        latency: fallbackChartData(),
        serviceStructure: fallbackChartData(),
        comparison: fallbackChartData(),
        traces: fallbackChartData(),
      });
      setTraces([]);
    }
  }, [alerts, serverStatuses]);

  // Auto-refresh every 3 seconds (but only if we have context data, re-run to update chart points)
  useEffect(() => {
    const interval = setInterval(() => {
      if (serverStatuses && Object.keys(serverStatuses).length > 0) {
        const spanRateData = generateChartDataFromStatuses(serverStatuses, "cpu", 20);
        const errorRateData = generateChartDataFromStatuses(serverStatuses, "memory", 20);
        const latencyData = generateChartDataFromStatuses(serverStatuses, "disk", 20);
        setChartData({
          spanRate: spanRateData,
          errorRate: errorRateData,
          latency: latencyData,
          serviceStructure: spanRateData,
          comparison: errorRateData,
          traces: latencyData,
        });
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [serverStatuses]);

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
      toast.success(`Searching for trace: ${traceId}`);
    }
  };

  const handleTimeChange = (time) => {
    toast.success(`Time range updated: ${time.range || time.from + " → " + time.to}`);
  };

  const chartConfigs = [
    { key: "spanRate", label: "Span rate", color: "#22D3EE" },
    { key: "errorRate", label: "Error rate", color: "#F87171" },
    { key: "latency", label: "Latency", color: "#FBBF24" },
    { key: "serviceStructure", label: "Service structure", color: "#34D399" },
    { key: "comparison", label: "Comparison", color: "#A78BFA" },
    { key: "traces", label: "Traces", color: "#F472B6" },
  ];

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
            {chartData.spanRate[chartData.spanRate.length - 1]?.value || 0}
          </div>
          <div className="text-xs text-[var(--color-faint)]">Last update: now</div>
        </div>
        <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-3 text-center">
          <div className="text-xs text-[var(--color-muted)]">Error rate</div>
          <div className="text-2xl font-bold text-[var(--color-text)]">
            {chartData.errorRate[chartData.errorRate.length - 1]?.value || 0}
          </div>
          <div className="text-xs text-[var(--color-faint)]">Last update: now</div>
        </div>
        <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-3 text-center">
          <div className="text-xs text-[var(--color-muted)]">Latency</div>
          <div className="text-2xl font-bold text-[var(--color-text)]">
            {chartData.latency[chartData.latency.length - 1]?.value || 0}ms
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
          {/* Query error banner */}
          {showQueryError && (
            <div className="flex items-center gap-3 bg-[var(--color-crit)]/10 border border-[var(--color-crit)]/30 rounded-lg px-4 py-2 text-sm">
              <AlertCircle size={16} className="text-[var(--color-crit)]" />
              <span className="text-[var(--color-text)]">Query error</span>
              <span className="text-[var(--color-muted)]">Datasource was not found</span>
              <button
                onClick={() => setShowQueryError(false)}
                className="ml-auto text-xs text-[var(--color-muted)] hover:text-[var(--color-text)]"
              >
                Dismiss
              </button>
            </div>
          )}

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
                const data = chartData[cfg.key] || [];
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
                          domain={[0, 100]}
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

          {/* ✅ Traces tab now uses the TracesListView component */}
          {activeTab === "traces" && (
            <TracesListView traces={traces} />
          )}
        </div>
      </div>
    </div>
  );
}