// src/pages/DashboardPage.jsx
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
import HealthSummary from "../components/HealthSummary";
import MemoryUtilizationReport from "./dashboards/MemoryUtilizationReport";
import MemoryUtilizationReportLinux from "./dashboards/MemoryUtilizationReportLinux";
import CpuLoadReportWindows from "./dashboards/CpuLoadReportWindows";
import CpuLoadReportLinux from "./dashboards/CpuLoadReportLinux";
import DiskUtilizationReportWindows from "./dashboards/DiskUtilizationReportWindows";
import DiskUtilizationReportLinux from "./dashboards/DiskUtilizationReportLinux";
// ❌ Removed Oracle imports
import FirewallDashboard from "./dashboards/FirewallDashboard";
import FirewallRealTimeInfo from "./dashboards/FirewallRealTimeInfo";
import FirewallRealTimeInterfaceStatus from "./dashboards/FirewallRealTimeInterfaceStatus";
import FirewallRealTimeService from "./dashboards/FirewallRealTimeService";
import FirewallHistoricalPerformance from "./dashboards/FirewallHistoricalPerformance";
import NOCDashboard from "./dashboards/NOCDashboard";
import BangaloreDashboard from "./dashboards/BangaloreDashboard";
import { X, AlertCircle, Clock } from "lucide-react";

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

// ---- Problem Detail Modal (Auto-opened from Incidents) ----
const ProblemDetailModal = ({ isOpen, onClose, problemData }) => {
  if (!isOpen || !problemData) return null;

  const { detail, hostname, problem, severity, time, duration } = problemData;

  // If detail is missing, create a basic one
  const detailData = detail || {
    title: `${hostname} · ${problem}`,
    source: "Infrastructure",
    host: hostname,
    service: "Server",
    referenceId: `SRV-${hostname}-${Date.now()}`,
    ip: "N/A",
    confidence: "85%",
    rootCause: `${hostname} is experiencing an issue: ${problem}. Please check the dashboard for more details.`,
    metrics: ["Status: Active", `Host: ${hostname}`, `Severity: ${severity}`],
    recommendation: "Review the system logs and take appropriate action based on the specific issue."
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
          <div className="flex items-center gap-3">
            <AlertCircle size={20} className="text-[var(--color-crit)]" />
            <div>
              <h3 className="text-xl font-bold text-[var(--color-text)]">{detailData.title}</h3>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-xs bg-[var(--color-panel-alt)] px-2 py-0.5 rounded border border-[var(--color-border)] text-[var(--color-muted)]">
                  {detailData.source}
                </span>
                <span className="text-xs text-[var(--color-muted)]">Host {detailData.host}</span>
                <span className="text-xs text-[var(--color-muted)]">Service {detailData.service}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl hover:bg-[var(--color-border)]/10 transition flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-text)]"
          >
            <X size={22} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <span className="text-[var(--color-muted)]">As of {new Date().toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
            <span className="text-xs font-mono text-[var(--color-faint)]">Reference ID {detailData.referenceId}</span>
          </div>

          <div className="bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)] p-4">
            <p className="text-sm text-[var(--color-text)]">
              <span className="font-semibold">Problem:</span> {problem}
            </p>
            <p className="text-sm text-[var(--color-muted)] mt-1">
              <span className="font-semibold">Host:</span> {hostname} | 
              <span className="font-semibold ml-2">Severity:</span> {severity} | 
              <span className="font-semibold ml-2">Duration:</span> {duration}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-2">
              <h4 className="text-sm font-semibold text-[var(--color-text)] uppercase tracking-wider">Root Cause Analysis</h4>
              <span className="text-xs font-bold text-[var(--color-accent)] bg-[var(--color-accent)]/10 px-2 py-0.5 rounded-full border border-[var(--color-accent)]/20">
                {detailData.confidence} CONFIDENCE
              </span>
            </div>
            <p className="text-sm text-[var(--color-text)] leading-relaxed">{detailData.rootCause}</p>
            <ul className="mt-3 space-y-1">
              {detailData.metrics.map((metric, i) => (
                <li key={i} className="text-sm text-[var(--color-muted)] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]"></span>
                  {metric}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[var(--color-text)] uppercase tracking-wider mb-2">Recommended Action</h4>
            <div className="bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)] p-4">
              <p className="text-sm text-[var(--color-text)] leading-relaxed">{detailData.recommendation}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end p-4 border-t border-[var(--color-border)] bg-[var(--color-bg)] px-6">
          <button
            onClick={() => {
              localStorage.removeItem("selectedProblemData");
              onClose();
            }}
            className="px-6 py-2 text-sm bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90 transition shadow-lg shadow-[var(--color-accent)]/20"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ---------- Default Dashboard Content ----------
const DefaultDashboardContent = ({ go }) => {
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

  const openAlertDetail = (id) => {
    localStorage.setItem("selectedAlertId", String(id));
    go("Alert Detail");
  };

  return (
    <div className="grid gap-4">
      <HealthSummary />
      <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">
        <Stat label="Active alerts" value={activeAlertCount} delta={`${newAlertCount} new`} tone="var(--color-crit)" />
        <Stat label="Hosts up" value="248" unit="/ 251" delta="99.2% fleet" />
        <Stat label="p95 latency" value="412" unit="ms" delta="-8% vs 24h" />
        <Stat label="Error rate" value="0.42" unit="%" delta="+0.11 pt" tone="var(--color-warn)" />
      </div>
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
      <Card title="Recent alerts" right={<span className="text-xs text-[var(--color-muted)]">Live</span>}>
        {recentAlerts.length === 0 ? <div className="text-center py-4 text-[var(--color-muted)] text-sm">No recent alerts</div> :
          <div className="grid gap-2">
            {recentAlerts.map((a) => (
              <div
                key={a.id}
                onClick={() => openAlertDetail(a.id)}
                className="flex items-center gap-3 py-1 cursor-pointer hover:bg-[var(--color-panel-alt)] rounded px-2 transition"
              >
                <StatusDot state={a.state === "active" ? "crit" : "ok"} />
                <span className="text-[var(--color-text)] text-sm flex-1">{a.grafana_folder}</span>
                <span className="text-[var(--color-muted)] text-xs">{a.contactPoint}</span>
                <span className="font-mono text-[var(--color-faint)] text-xs w-9 text-right">{a.stateDuration}</span>
              </div>
            ))}
          </div>
        }
      </Card>
      <Card title="Recent Events" right={<span className="text-xs text-[var(--color-muted)]">Auto-refresh every 10s</span>}>
        {events.length === 0 ? <div className="text-center py-4 text-[var(--color-muted)] text-sm">No recent events</div> :
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
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${event.severity === "High" || event.severity === "Critical" ? "bg-[var(--color-crit)] text-white" : event.severity === "Medium" ? "bg-[var(--color-warn)] text-[#06222A]" : "bg-[var(--color-ok)] text-[#06222A]"}`}>
                        {event.severity}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right text-[var(--color-text)] font-mono text-sm">{event.count.toLocaleString()}</td>
                    <td className="py-2 px-3 text-[var(--color-faint)] text-xs">{new Date(event.lastTriggered).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        }
      </Card>
    </div>
  );
};

// ---------- Dashboard Component Mapping ----------
const dashboardComponents = {
  "Memory Utilization Report - Windows": MemoryUtilizationReport,
  "Memory Utilization Report - Linux": MemoryUtilizationReportLinux,
  "CPU Load Report - Windows": CpuLoadReportWindows,
  "CPU Load Report - Linux": CpuLoadReportLinux,
  '"C" Disk Utilization Report - Windows': DiskUtilizationReportWindows,
  '"/" Disk Utilization Report - Linux': DiskUtilizationReportLinux,
  "Firewall Dashboard": FirewallDashboard,
  "Real-time_Firewall info": FirewallRealTimeInfo,
  "Real-time_Firewall Interface status": FirewallRealTimeInterfaceStatus,
  "Real-time_Firewall Service": FirewallRealTimeService,
  "Firewall_Historical Performance": FirewallHistoricalPerformance,
  "NOC Dashboard": NOCDashboard,
  "Bangalore Dashboard": BangaloreDashboard,
  // ❌ Oracle entries already removed
};

// ---------- Main DashboardPage ----------
export default function DashboardPage({ go, active }) {
  const [dashboardName, setDashboardName] = useState("Main Dashboard");
  const [showBack, setShowBack] = useState(false);
  const [showProblemModal, setShowProblemModal] = useState(false);
  const [problemData, setProblemData] = useState(null);

  useEffect(() => {
    // Check if there's a problem from Incidents page
    const storedProblem = localStorage.getItem("selectedProblemData");
    if (storedProblem) {
      try {
        const parsed = JSON.parse(storedProblem);
        setProblemData(parsed);
        setShowProblemModal(true);
      } catch {}
    }

    const id = localStorage.getItem("selectedDashboard");
    if (id) {
      const dashboards = JSON.parse(localStorage.getItem("dashboards") || "[]");
      const found = dashboards.find((d) => String(d.id) === String(id));
      if (found) {
        setDashboardName(found.name);
      } else {
        setDashboardName("Dashboard View");
      }
      setShowBack(true);
    } else {
      setDashboardName("Main Dashboard");
      setShowBack(false);
    }
  }, [active]);

  const goBack = () => {
    localStorage.removeItem("selectedDashboard");
    go("Dashboards");
  };

  const closeProblemModal = () => {
    localStorage.removeItem("selectedProblemData");
    setShowProblemModal(false);
    setProblemData(null);
  };

  const getDashboardComponent = () => {
    for (const [key, Component] of Object.entries(dashboardComponents)) {
      if (dashboardName.includes(key)) {
        return Component;
      }
    }
    return DefaultDashboardContent;
  };

  const Content = getDashboardComponent();

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

      <Content go={go} />

      {/* Auto-open Problem Detail Modal */}
      <ProblemDetailModal
        isOpen={showProblemModal}
        onClose={closeProblemModal}
        problemData={problemData}
      />
    </div>
  );
}