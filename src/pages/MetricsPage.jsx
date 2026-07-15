// src/pages/MetricsPage.jsx
import { useState, useEffect } from "react";
import {
  Search,
  ChevronDown,
  ChevronRight,
  Grid,
  Rows,
  Plus,
  AlertCircle,
  Activity,
  Filter,
  X,
  Play,
  Save,
  History,
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
  Legend,
} from "recharts";
import TimePicker from "../components/common/TimePicker";
import { useAlerts } from "../context/AlertContext";
import { generateChartDataFromStatuses } from "../utils/dataGenerator";

// ---------- Metric Names ----------
// Add real server metrics to the list
const metricNames = [
  "cpu",
  "memory",
  "disk",
  "go_gc_cycles_automatic_gc_cycles_total",
  "go_gc_cycles_forced_gc_cycles_total",
  // ... (keep all existing metrics, but we can shorten for brevity; full list from user)
];

// ---------- Prefix and suffix data (unchanged) ----------
const prefixData = [
  { prefix: "go", count: 74 },
  { prefix: "prometheus", count: 229 },
  { prefix: "node", count: 286 },
  { prefix: "tempo", count: 123 },
  { prefix: "tempodb", count: 23 },
  { prefix: "process", count: 9 },
  { prefix: "net", count: 6 },
  { prefix: "traces", count: 5 },
  { prefix: "scrape", count: 4 },
  { prefix: "promhttp", count: 3 },
  { prefix: "nginx", count: 2 },
];

const suffixData = [
  { suffix: "total", count: 284 },
  { suffix: "bytes", count: 92 },
  { suffix: "count", count: 47 },
  { suffix: "sum", count: 47 },
  { suffix: "seconds", count: 35 },
  { suffix: "bucket", count: 34 },
  { suffix: "info", count: 15 },
  { suffix: "inuse", count: 10 },
  { suffix: "length", count: 8 },
  { suffix: "InErrors", count: 6 },
  { suffix: "clients", count: 5 },
  { suffix: "series", count: 5 },
];

const timeRanges = [
  "All time",
  "Past 1m",
  "Past 3m",
  "Past 5m",
  "Past 15m",
  "Past 30m",
  "Past 1h",
  "Past 3h",
  "Past 6h",
  "Past 12h",
  "Past 24h",
];

const groupByLabels = [
  "address", "adminstate", "bios_date", "bios_release", "bios_vendor",
  "bios_version", "board_name", "board_vendor", "board_version", "branch",
  "broadcast", "call", "cause",
];

// ---------- Color palette ----------
const COLORS = [
  "#22D3EE", "#F87171", "#FBBF24", "#34D399", "#A78BFA",
  "#F472B6", "#60A5FA", "#F59E0B", "#14B8A6", "#8B5CF6",
  "#EC4899", "#6366F1", "#10B981", "#F97316", "#06B6D4",
];

// ---------- Main Component ----------
export default function MetricsPage() {
  const { serverStatuses } = useAlerts();
  const [dataSource, setDataSource] = useState("prometheus");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedMetrics, setSelectedMetrics] = useState([]);
  const [showFilters, setShowFilters] = useState(true);
  const [query, setQuery] = useState("");
  const [queryHistory, setQueryHistory] = useState([]);

  // Filter groups
  const [rulesOpen, setRulesOpen] = useState(true);
  const [prefixOpen, setPrefixOpen] = useState(true);
  const [suffixOpen, setSuffixOpen] = useState(true);
  const [recentOpen, setRecentOpen] = useState(true);
  const [groupByOpen, setGroupByOpen] = useState(true);

  // Filter values
  const [rulesSelection, setRulesSelection] = useState({ nonRules: true, recordingRules: false });
  const [prefixSearch, setPrefixSearch] = useState("");
  const [suffixSearch, setSuffixSearch] = useState("");
  const [selectedPrefixes, setSelectedPrefixes] = useState([]);
  const [selectedSuffixes, setSelectedSuffixes] = useState([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState("All time");
  const [selectedGroupBy, setSelectedGroupBy] = useState(null);
  const [groupBySearch, setGroupBySearch] = useState("");

  // Chart data
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // ---------- Initialize with default metric "cpu" ----------
  useEffect(() => {
    if (selectedMetrics.length === 0 && serverStatuses && Object.keys(serverStatuses).length > 0) {
      const defaultMetric = "cpu";
      const data = generateChartDataFromStatuses(serverStatuses, defaultMetric, 30);
      setChartData(data);
      setSelectedMetrics([defaultMetric]);
      setQuery(`average(${defaultMetric})`);
    }
  }, [serverStatuses, selectedMetrics.length]);

  // Run query
  const runQuery = () => {
    if (!query.trim()) {
      toast.error("Please enter a query");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      // Try to extract a metric name from the query (simple heuristic)
      const words = query.split(/\s+/);
      const metricName = words.find(w => metricNames.includes(w)) || "cpu";
      if (serverStatuses && Object.keys(serverStatuses).length > 0) {
        const data = generateChartDataFromStatuses(serverStatuses, metricName, 30);
        setChartData(data);
        setSelectedMetrics([metricName]);
        toast.success(`Query executed: ${query}`);
      } else {
        toast.error("No server status data available");
      }
      setQueryHistory((prev) => [query, ...prev.slice(0, 9)]);
      setIsLoading(false);
    }, 500);
  };

  // Handle time change
  const handleTimeChange = (time) => {
    toast.success(`Time range updated: ${time.range || time.from + " → " + time.to}`);
    // Optionally refresh chart data based on time range
  };

  // Filter metrics
  const filteredMetrics = metricNames.filter((m) => {
    if (searchTerm && !m.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (selectedPrefixes.length > 0) {
      const matches = selectedPrefixes.some((p) => m.startsWith(p));
      if (!matches) return false;
    }
    if (selectedSuffixes.length > 0) {
      const matches = selectedSuffixes.some((s) => m.endsWith(s));
      if (!matches) return false;
    }
    return true;
  });

  const toggleMetricSelection = (metric) => {
    setSelectedMetrics((prev) => {
      const isSelected = prev.includes(metric);
      let newSelected;
      if (isSelected) {
        newSelected = prev.filter((m) => m !== metric);
        // Remove metric from chart data
        const updated = chartData.map((point) => {
          const { [metric]: removed, ...rest } = point;
          return rest;
        });
        setChartData(updated);
      } else {
        newSelected = [...prev, metric];
        // Add metric to chart data
        let newData = [];
        if (serverStatuses && Object.keys(serverStatuses).length > 0) {
          // For real server metrics (cpu, memory, disk) – generate from statuses
          if (metric === "cpu" || metric === "memory" || metric === "disk") {
            const generated = generateChartDataFromStatuses(serverStatuses, metric, 30);
            newData = generated;
          } else {
            // For other metrics, we can't generate real data, so generate dummy data
            // But we can still show a placeholder
            const now = Date.now();
            newData = Array.from({ length: 30 }, (_, i) => ({
              time: new Date(now - (30 - i) * 60000).toLocaleTimeString(),
              [metric]: Math.floor(Math.random() * 100),
            }));
          }
        } else {
          // Fallback to random data
          const now = Date.now();
          newData = Array.from({ length: 30 }, (_, i) => ({
            time: new Date(now - (30 - i) * 60000).toLocaleTimeString(),
            [metric]: Math.floor(Math.random() * 100),
          }));
        }
        if (chartData.length > 0) {
          const merged = chartData.map((point, i) => ({
            ...point,
            [metric]: newData[i]?.[metric] || 0,
          }));
          setChartData(merged);
        } else {
          setChartData(newData);
        }
      }
      return newSelected;
    });
  };

  const clearAllFilters = () => {
    setSelectedPrefixes([]);
    setSelectedSuffixes([]);
    setSelectedTimeRange("All time");
    setSelectedGroupBy(null);
    setRulesSelection({ nonRules: true, recordingRules: false });
    setSelectedMetrics([]);
    setQuery("");
    setChartData([]);
    toast.success("All filters cleared");
  };

  // Filter group toggle
  const FilterGroup = ({ title, open, onToggle, children }) => (
    <div className="border border-[var(--color-border)] rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2 bg-[var(--color-panel-alt)] hover:bg-[var(--color-border)] transition text-left text-xs font-medium text-[var(--color-muted)] uppercase tracking-wider"
      >
        <span>{title}</span>
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      </button>
      {open && <div className="p-3 space-y-2">{children}</div>}
    </div>
  );

  // Prepare chart data
  const chartDataPoints = chartData.length > 0 ? chartData : [];

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-[var(--color-muted)]">Drilldown</span>
          <ChevronDown size={12} className="text-[var(--color-muted)]" />
          <span className="text-[var(--color-muted)]">Metrics</span>
          <ChevronDown size={12} className="text-[var(--color-muted)]" />
          <span className="text-[var(--color-text)] font-semibold">All metrics</span>
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
            <option value="prometheus">prometheus</option>
          </select>
        </div>
        <div className="flex items-center gap-1">
          <Plus size={14} className="text-[var(--color-muted)]" />
          <input
            type="text"
            placeholder="label = value"
            className="px-2 py-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-faint)] text-sm focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent w-32"
          />
        </div>
      </div>

      {/* Query builder */}
      <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[var(--color-muted)] font-mono">PromQL</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && runQuery()}
              className="w-full pl-14 pr-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-faint)] text-sm focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent font-mono"
              placeholder="rate(go_goroutines[5m])"
            />
          </div>
          <button
            onClick={runQuery}
            disabled={isLoading}
            className="flex items-center gap-1 px-4 py-2 bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-50"
          >
            <Play size={16} />
            Run
          </button>
          <button
            onClick={() => toast.info("Save query as dashboard")}
            className="p-2 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-panel-alt)] transition text-[var(--color-muted)] hover:text-[var(--color-text)]"
          >
            <Save size={16} />
          </button>
          <button
            onClick={() => toast.info("Query history")}
            className="p-2 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-panel-alt)] transition text-[var(--color-muted)] hover:text-[var(--color-text)]"
          >
            <History size={16} />
          </button>
        </div>
        {queryHistory.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {queryHistory.map((q, i) => (
              <button
                key={i}
                onClick={() => { setQuery(q); runQuery(); }}
                className="text-xs bg-[var(--color-panel-alt)] px-2 py-0.5 rounded border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-text)]"
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search and view toggles */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-faint)]" />
          <input
            type="text"
            placeholder="Search metric"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-faint)] text-sm focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
          />
        </div>
        <span className="text-xs text-[var(--color-muted)]">{filteredMetrics.length}</span>
        <div className="flex items-center gap-1 ml-auto">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1 px-2 py-1 text-xs rounded border border-[var(--color-border)] hover:bg-[var(--color-panel-alt)] transition"
          >
            <Filter size={12} />
            {showFilters ? "Hide filters" : "Show filters"}
          </button>
          <button
            onClick={clearAllFilters}
            className="text-xs text-[var(--color-muted)] hover:text-[var(--color-text)] px-2 py-1"
          >
            Clear all
          </button>
          <div className="flex items-center gap-1">
            <span className="text-xs text-[var(--color-muted)]">Grid</span>
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
            <span className="text-xs text-[var(--color-muted)]">Default</span>
          </div>
        </div>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <FilterGroup title="Rules filters" open={rulesOpen} onToggle={() => setRulesOpen(!rulesOpen)}>
            <div className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
              <span>{selectedPrefixes.length + selectedSuffixes.length} selected</span>
              <button onClick={clearAllFilters} className="text-[var(--color-accent)] hover:underline">clear</button>
            </div>
            <div className="space-y-1">
              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={rulesSelection.nonRules}
                  onChange={() => setRulesSelection({ ...rulesSelection, nonRules: !rulesSelection.nonRules })}
                  className="rounded border-[var(--color-border)] accent-[var(--color-accent)]"
                />
                <span className="text-[var(--color-text)]">Non-rules metrics ({metricNames.length})</span>
              </label>
              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={rulesSelection.recordingRules}
                  onChange={() => setRulesSelection({ ...rulesSelection, recordingRules: !rulesSelection.recordingRules })}
                  className="rounded border-[var(--color-border)] accent-[var(--color-accent)]"
                />
                <span className="text-[var(--color-text)]">Recording rules (0)</span>
              </label>
            </div>
          </FilterGroup>

          <FilterGroup title="Prefix filters" open={prefixOpen} onToggle={() => setPrefixOpen(!prefixOpen)}>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-[var(--color-faint)]" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={prefixSearch}
                  onChange={(e) => setPrefixSearch(e.target.value)}
                  className="w-full pl-7 pr-2 py-1 rounded border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] text-xs focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                />
              </div>
              <button className="text-xs text-[var(--color-muted)] hover:text-[var(--color-text)]">Hide empty</button>
            </div>
            <div className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
              <span>{selectedPrefixes.length} selected</span>
              <button onClick={() => setSelectedPrefixes([])} className="text-[var(--color-accent)] hover:underline">clear</button>
            </div>
            <div className="max-h-32 overflow-y-auto space-y-0.5">
              {prefixData
                .filter((p) => p.prefix.includes(prefixSearch))
                .map((p) => (
                  <label key={p.prefix} className="flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedPrefixes.includes(p.prefix)}
                      onChange={() => {
                        setSelectedPrefixes((prev) =>
                          prev.includes(p.prefix)
                            ? prev.filter((x) => x !== p.prefix)
                            : [...prev, p.prefix]
                        );
                      }}
                      className="rounded border-[var(--color-border)] accent-[var(--color-accent)]"
                    />
                    <span className="text-[var(--color-text)]">{p.prefix} ({p.count})</span>
                  </label>
                ))}
            </div>
          </FilterGroup>

          <FilterGroup title="Suffix filters" open={suffixOpen} onToggle={() => setSuffixOpen(!suffixOpen)}>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-[var(--color-faint)]" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={suffixSearch}
                  onChange={(e) => setSuffixSearch(e.target.value)}
                  className="w-full pl-7 pr-2 py-1 rounded border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] text-xs focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                />
              </div>
              <button className="text-xs text-[var(--color-muted)] hover:text-[var(--color-text)]">Hide empty</button>
            </div>
            <div className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
              <span>{selectedSuffixes.length} selected</span>
              <button onClick={() => setSelectedSuffixes([])} className="text-[var(--color-accent)] hover:underline">clear</button>
            </div>
            <div className="max-h-32 overflow-y-auto space-y-0.5">
              {suffixData
                .filter((s) => s.suffix.includes(suffixSearch))
                .map((s) => (
                  <label key={s.suffix} className="flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedSuffixes.includes(s.suffix)}
                      onChange={() => {
                        setSelectedSuffixes((prev) =>
                          prev.includes(s.suffix)
                            ? prev.filter((x) => x !== s.suffix)
                            : [...prev, s.suffix]
                        );
                      }}
                      className="rounded border-[var(--color-border)] accent-[var(--color-accent)]"
                    />
                    <span className="text-[var(--color-text)]">{s.suffix} ({s.count})</span>
                  </label>
                ))}
            </div>
          </FilterGroup>

          <FilterGroup title="Recent metrics filters" open={recentOpen} onToggle={() => setRecentOpen(!recentOpen)}>
            <div className="flex flex-wrap gap-1">
              {timeRanges.map((range) => (
                <button
                  key={range}
                  onClick={() => setSelectedTimeRange(range)}
                  className={`px-2 py-0.5 text-xs rounded transition ${
                    selectedTimeRange === range
                      ? "bg-[var(--color-accent)] text-[#06222A]"
                      : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </FilterGroup>

          <FilterGroup title="Group by labels" open={groupByOpen} onToggle={() => setGroupByOpen(!groupByOpen)}>
            <div className="relative">
              <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-[var(--color-faint)]" />
              <input
                type="text"
                placeholder="Search..."
                value={groupBySearch}
                onChange={(e) => setGroupBySearch(e.target.value)}
                className="w-full pl-7 pr-2 py-1 rounded border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] text-xs focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
              <span>{selectedGroupBy ? `Selected: ${selectedGroupBy}` : "No selection"}</span>
              <button onClick={() => setSelectedGroupBy(null)} className="text-[var(--color-accent)] hover:underline">clear</button>
            </div>
            <div className="max-h-32 overflow-y-auto space-y-0.5">
              {groupByLabels
                .filter((g) => g.includes(groupBySearch))
                .map((label) => (
                  <label key={label} className="flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="radio"
                      name="groupBy"
                      checked={selectedGroupBy === label}
                      onChange={() => setSelectedGroupBy(label)}
                      className="accent-[var(--color-accent)]"
                    />
                    <span className="text-[var(--color-text)]">{label}</span>
                  </label>
                ))}
            </div>
          </FilterGroup>
        </div>
      )}

      {/* Main layout: Metrics list + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Metrics list */}
        <div className="lg:col-span-1 bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg overflow-hidden">
          <div className="px-3 py-2 border-b border-[var(--color-border)] text-xs font-medium text-[var(--color-muted)] uppercase tracking-wider">
            Metrics
          </div>
          <div className="max-h-[400px] overflow-y-auto p-1 space-y-0.5">
            {filteredMetrics.length === 0 ? (
              <div className="text-center py-8 text-[var(--color-muted)] text-sm">No metrics found</div>
            ) : (
              filteredMetrics.map((metric) => (
                <div
                  key={metric}
                  onClick={() => toggleMetricSelection(metric)}
                  className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer transition ${
                    selectedMetrics.includes(metric)
                      ? "bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                      : "hover:bg-[var(--color-panel-alt)] text-[var(--color-text)]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedMetrics.includes(metric)}
                    onChange={() => {}}
                    className="rounded border-[var(--color-border)] accent-[var(--color-accent)]"
                  />
                  <span className="text-xs font-mono truncate">{metric}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chart area */}
        <div className="lg:col-span-2 space-y-3">
          <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[var(--color-muted)]">Chart</span>
              {selectedMetrics.length > 0 && (
                <span className="text-xs text-[var(--color-muted)]">{selectedMetrics.length} metrics selected</span>
              )}
            </div>
            {chartDataPoints.length === 0 && selectedMetrics.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-[var(--color-muted)]">
                <Activity size={32} className="mb-2" />
                <span className="text-sm">Select a metric or run a query</span>
              </div>
            ) : (
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartDataPoints.length > 0 ? chartDataPoints : generateChartDataFromStatuses(serverStatuses, "cpu", 30)}>
                    <defs>
                      {selectedMetrics.map((metric, idx) => (
                        <linearGradient key={metric} id={`grad-${metric}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={COLORS[idx % COLORS.length]} stopOpacity={0.3} />
                          <stop offset="100%" stopColor={COLORS[idx % COLORS.length]} stopOpacity={0} />
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid stroke="var(--color-border)" vertical={false} />
                    <XAxis
                      dataKey="time"
                      tick={{ fontSize: 10, fill: "var(--color-faint)" }}
                      tickLine={false}
                      axisLine={false}
                      interval={2}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: "var(--color-faint)" }}
                      tickLine={false}
                      axisLine={false}
                      domain={[0, "auto"]}
                      width={30}
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
                    <Legend wrapperStyle={{ fontSize: "10px", color: "var(--color-text)" }} />
                    {selectedMetrics.map((metric, idx) => (
                      <Area
                        key={metric}
                        type="monotone"
                        dataKey={metric}
                        stroke={COLORS[idx % COLORS.length]}
                        strokeWidth={2}
                        fill={`url(#grad-${metric})`}
                        dot={false}
                      />
                    ))}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}