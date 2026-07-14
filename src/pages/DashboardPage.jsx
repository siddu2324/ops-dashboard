import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";
import Card from "../components/common/Card";
import Stat from "../components/common/Stat";
import StatusDot from "../components/common/StatusDot";
import ChartTooltip from "../components/common/ChartTooltip";
import { useAlerts } from "../context/AlertContext";
import { cpuSeries } from "../data/cpuSeries";
import { reqSeries } from "../data/reqSeries";

// ---------- Constants ----------
const EVENT_NAMES = [
  "Error: 401",
  "RequestError",
  "AWSSecurityTokenServiceException",
  "QueryFailedException",
  "Database connection timeout",
  "Memory limit exceeded",
  "SSL certificate expired",
  "Disk space warning",
];
const EVENT_TYPES = ["Exceptions", "Timeout", "Resource", "Security", "Network", "Authentication"];
const SEVERITIES = ["High", "Medium", "Low", "Critical"];

// Mock data for Memory Utilization
const memoryData = [
  { ip: "192.168.4.53", hostname: "VITSRVPDC01", min: 76.74, avg: 76.74, max: 76.74 },
  { ip: "192.168.4.69", hostname: "VITBLRSRVAA01", min: 76.17, avg: 76.17, max: 76.17 },
  { ip: "192.168.2.28", hostname: "VITBLRSRVDB01", min: 75.47, avg: 75.47, max: 75.47 },
  { ip: "192.168.4.97", hostname: "vitblrsrvbkp01", min: 67.01, avg: 67.01, max: 67.01 },
  { ip: "192.168.4.70", hostname: "VITBLRSRVAA02", min: 61.47, avg: 61.47, max: 61.47 },
  { ip: "192.168.4.83", hostname: "VITBLRSRVWM01", min: 57.18, avg: 57.18, max: 57.18 },
  { ip: "192.168.4.54", hostname: "VITSRVADC02", min: 57.04, avg: 57.04, max: 57.04 },
  { ip: "192.168.6.90", hostname: "VITBLRSRVW01", min: 46.82, avg: 46.82, max: 46.82 },
  { ip: "192.168.6.68", hostname: "ASPL_VITBLRSRVTS16", min: 46.61, avg: 46.61, max: 46.61 },
  { ip: "192.168.4.60", hostname: "VITSRVPRTG01", min: 37.16, avg: 37.16, max: 37.16 },
];

// Mock data for CPU Utilization
const cpuData = [
  { ip: "192.168.4.53", hostname: "VITSRVPDC01", min: 45.2, avg: 52.8, max: 68.5 },
  { ip: "192.168.4.69", hostname: "VITBLRSRVAA01", min: 38.7, avg: 44.1, max: 56.3 },
  { ip: "192.168.2.28", hostname: "VITBLRSRVDB01", min: 22.5, avg: 28.9, max: 35.2 },
  { ip: "192.168.4.97", hostname: "vitblrsrvbkp01", min: 15.3, avg: 19.8, max: 27.1 },
  { ip: "192.168.4.70", hostname: "VITBLRSRVAA02", min: 61.2, avg: 68.7, max: 79.4 },
  { ip: "192.168.4.83", hostname: "VITBLRSRVWM01", min: 33.4, avg: 39.2, max: 48.6 },
  { ip: "192.168.4.54", hostname: "VITSRVADC02", min: 41.8, avg: 47.3, max: 55.9 },
  { ip: "192.168.6.90", hostname: "VITBLRSRVW01", min: 28.1, avg: 34.5, max: 42.0 },
  { ip: "192.168.6.68", hostname: "ASPL_VITBLRSRVTS16", min: 19.7, avg: 24.2, max: 31.8 },
  { ip: "192.168.4.60", hostname: "VITSRVPRTG01", min: 12.4, avg: 16.9, max: 23.6 },
];

// Generate events
const generateEvents = (count = 8) => {
  const now = Date.now();
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    name: EVENT_NAMES[i % EVENT_NAMES.length],
    type: EVENT_TYPES[i % EVENT_TYPES.length],
    severity: SEVERITIES[i % SEVERITIES.length],
    count: Math.floor(1000 + Math.random() * 50000),
    lastTriggered: new Date(now - Math.random() * 3600000).toISOString(),
  }));
};

// ----- Dashboard Content Components -----
const MemoryUtilizationReport = () => (
  <Card title="Memory Utilization">
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--color-border)] text-[var(--color-muted)] text-xs uppercase tracking-wider">
            <th className="py-2 px-3 font-medium">IP Address</th>
            <th className="py-2 px-3 font-medium">Host name</th>
            <th className="py-2 px-3 font-medium text-right">Memory Utilization MIN</th>
            <th className="py-2 px-3 font-medium text-right">Memory Utilization AVG</th>
            <th className="py-2 px-3 font-medium text-right">Memory Utilization MAX</th>
          </tr>
        </thead>
        <tbody>
          {memoryData.map((row) => (
            <tr key={row.ip} className="border-b border-[var(--color-border)] hover:bg-[var(--color-panel-alt)] transition-colors">
              <td className="py-2 px-3 text-[var(--color-text)] font-mono text-xs">{row.ip}</td>
              <td className="py-2 px-3 text-[var(--color-text)]">{row.hostname}</td>
              <td className="py-2 px-3 text-right text-[var(--color-text)] font-mono">{row.min} %</td>
              <td className="py-2 px-3 text-right text-[var(--color-text)] font-mono">{row.avg} %</td>
              <td className="py-2 px-3 text-right text-[var(--color-text)] font-mono">{row.max} %</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Card>
);

const CpuUtilizationReport = () => (
  <Card title="CPU Utilization">
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--color-border)] text-[var(--color-muted)] text-xs uppercase tracking-wider">
            <th className="py-2 px-3 font-medium">IP Address</th>
            <th className="py-2 px-3 font-medium">Host name</th>
            <th className="py-2 px-3 font-medium text-right">CPU Utilization MIN</th>
            <th className="py-2 px-3 font-medium text-right">CPU Utilization AVG</th>
            <th className="py-2 px-3 font-medium text-right">CPU Utilization MAX</th>
          </tr>
        </thead>
        <tbody>
          {cpuData.map((row) => (
            <tr key={row.ip} className="border-b border-[var(--color-border)] hover:bg-[var(--color-panel-alt)] transition-colors">
              <td className="py-2 px-3 text-[var(--color-text)] font-mono text-xs">{row.ip}</td>
              <td className="py-2 px-3 text-[var(--color-text)]">{row.hostname}</td>
              <td className="py-2 px-3 text-right text-[var(--color-text)] font-mono">{row.min} %</td>
              <td className="py-2 px-3 text-right text-[var(--color-text)] font-mono">{row.avg} %</td>
              <td className="py-2 px-3 text-right text-[var(--color-text)] font-mono">{row.max} %</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Card>
);

const DefaultDashboardContent = () => {
  const { activeAlertList, activeAlertCount, newAlertCount, resetNewAlertCount } = useAlerts();
  const [events, setEvents] = useState(generateEvents(8));

  useEffect(() => {
    resetNewAlertCount();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setEvents((prev) => {
        const newEvent = {
          id: Date.now(),
          name: EVENT_NAMES[Math.floor(Math.random() * EVENT_NAMES.length)],
          type: EVENT_TYPES[Math.floor(Math.random() * EVENT_TYPES.length)],
          severity: SEVERITIES[Math.floor(Math.random() * SEVERITIES.length)],
          count: Math.floor(1000 + Math.random() * 50000),
          lastTriggered: new Date().toISOString(),
        };
        return [newEvent, ...prev.slice(0, 7)];
      });
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const recentAlerts = activeAlertList.slice(-5).reverse();

  return (
    <div className="grid gap-4">
      {/* Stats */}
      <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">
        <Stat
          label="Active alerts"
          value={activeAlertCount}
          delta={`${newAlertCount} new`}
          tone="var(--color-crit)"
        />
        <Stat label="Hosts up" value="248" unit="/ 251" delta="99.2% fleet" />
        <Stat label="p95 latency" value="412" unit="ms" delta="-8% vs 24h" />
        <Stat label="Error rate" value="0.42" unit="%" delta="+0.11 pt" tone="var(--color-warn)" />
      </div>

      {/* Charts */}
      <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(320px,1fr))]">
        <Card title="Fleet CPU · avg %">
          <div style={{ height: 200 }}>
            <ResponsiveContainer>
              <AreaChart data={cpuSeries} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
                <defs>
                  <linearGradient id="cpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="t" stroke="var(--color-faint)" tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-faint)" tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="v" stroke="var(--color-accent)" strokeWidth={2} fill="url(#cpu)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Requests / min">
          <div style={{ height: 200 }}>
            <ResponsiveContainer>
              <BarChart data={reqSeries} margin={{ top: 8, right: 8, left: -14, bottom: 0 }}>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="t" stroke="var(--color-faint)" tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-faint)" tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                <Bar dataKey="v" fill="var(--color-accent)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent Alerts */}
      <Card title="Recent alerts" right={<span className="text-xs text-[var(--color-muted)]">Live</span>}>
        {recentAlerts.length === 0 ? (
          <div className="text-center py-4 text-[var(--color-muted)] text-sm">No recent alerts</div>
        ) : (
          <div className="grid gap-2">
            {recentAlerts.map((a) => (
              <div key={a.id} className="flex items-center gap-3 py-1">
                <StatusDot state={a.state === "active" ? "crit" : "ok"} />
                <span className="text-[var(--color-text)] text-sm flex-1">{a.grafana_folder}</span>
                <span className="text-[var(--color-muted)] text-xs">{a.contactPoint}</span>
                <span className="font-mono text-[var(--color-faint)] text-xs w-9 text-right">
                  {a.stateDuration}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Recent Events */}
      <Card title="Recent Events" right={<span className="text-xs text-[var(--color-muted)]">Auto-refresh every 10s</span>}>
        {events.length === 0 ? (
          <div className="text-center py-4 text-[var(--color-muted)] text-sm">No recent events</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] text-[var(--color-muted)] text-xs uppercase tracking-wider">
                  <th className="py-2 px-3 font-medium">Event</th>
                  <th className="py-2 px-3 font-medium">Type</th>
                  <th className="py-2 px-3 font-medium">Severity</th>
                  <th className="py-2 px-3 font-medium text-right">Count</th>
                  <th className="py-2 px-3 font-medium">Last Triggered</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-panel-alt)] transition-colors">
                    <td className="py-2 px-3 text-[var(--color-text)] font-mono text-xs">{event.name}</td>
                    <td className="py-2 px-3 text-[var(--color-muted)] text-xs">{event.type}</td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        event.severity === "High" || event.severity === "Critical"
                          ? "bg-[var(--color-crit)] text-white"
                          : event.severity === "Medium"
                          ? "bg-[var(--color-warn)] text-[#06222A]"
                          : "bg-[var(--color-ok)] text-[#06222A]"
                      }`}>
                        {event.severity}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right text-[var(--color-text)] font-mono text-sm">
                      {event.count.toLocaleString()}
                    </td>
                    <td className="py-2 px-3 text-[var(--color-faint)] text-xs">
                      {new Date(event.lastTriggered).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

// ---------- Main DashboardPage ----------
export default function DashboardPage({ go }) {
  const [dashboardName, setDashboardName] = useState("Main Dashboard");
  const [showBack, setShowBack] = useState(false);
  const [dashboardId, setDashboardId] = useState(null);

  // Load selected dashboard on mount
  useEffect(() => {
    const id = localStorage.getItem("selectedDashboard");
    if (id) {
      setDashboardId(id);
      const dashboards = JSON.parse(localStorage.getItem("dashboards") || "[]");
      const found = dashboards.find((d) => String(d.id) === String(id));
      if (found) {
        setDashboardName(found.name);
        setShowBack(true);
      } else {
        setDashboardName("Main Dashboard");
        setShowBack(false);
      }
    } else {
      setDashboardName("Main Dashboard");
      setShowBack(false);
    }
  }, []);

  const goBack = () => {
    localStorage.removeItem("selectedDashboard");
    go("Dashboards");
  };

  // Determine which content to render
  let Content;
  if (dashboardName.includes("Memory Utilization")) {
    Content = MemoryUtilizationReport;
  } else if (dashboardName.includes("CPU Load")) {
    Content = CpuUtilizationReport;
  } else {
    Content = DefaultDashboardContent;
  }

  return (
    <div className="space-y-4">
      {showBack && (
        <div className="flex items-center gap-4 pb-2 border-b border-[var(--color-border)]">
          <button
            onClick={goBack}
            className="text-sm text-[var(--color-accent)] hover:underline flex items-center gap-1"
          >
            ← Back to Dashboards
          </button>
          <span className="text-sm text-[var(--color-muted)]">|</span>
          <span className="text-sm text-[var(--color-text)] font-medium">
            {dashboardName}
          </span>
        </div>
      )}

      <Content />
    </div>
  );
}