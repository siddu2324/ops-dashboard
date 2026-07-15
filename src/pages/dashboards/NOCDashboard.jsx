// src/pages/dashboards/NOCDashboard.jsx
import { useState, useEffect, useRef } from "react";
import {
  RefreshCw, AlertCircle, CheckCircle, XCircle,
  Activity, Globe, Box, AlertTriangle, Bell,
  Monitor, ChevronDown, ChevronRight, Calendar,
  Download, Cpu, HardDrive, Network, MemoryStick,
  MapPin, ZoomIn, ZoomOut, Clock, Filter,
  Server, Wifi, Database, Cloud, Radio, Signal,
  X, Info, ExternalLink, Tag
} from "lucide-react";
import { toast } from "react-hot-toast";
import Card from "../../components/common/Card";
import StatusDot from "../../components/common/StatusDot";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import IndiaMap from "../../assets/india-map.png";

// City coordinates
const cityCoordinates = {
  Delhi:   { left: "40%", top: "43%" },
  Mumbai:  { left: "35%",  top: "57%" },
  Bangalore: { left: "41%", top: "70%" },
};

// Date Picker Component
const DatePicker = ({ value, onChange, label }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-[var(--color-muted)]">{label}</span>
      <div className="relative">
        <input 
          type="datetime-local" 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="px-3 py-1.5 pl-8 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg)] text-[var(--color-text)] text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent w-[220px]"
        />
        <Calendar size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
      </div>
    </div>
  );
};

// Popup Modal Component
const PopupModal = ({ isOpen, onClose, title, data, severity, areaName, totalCount }) => {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);

  if (!isOpen) return null;

  const severityConfig = {
    Critical: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', badge: 'bg-red-500/20 text-red-400 border-red-500/30', icon: '🔴' },
    High: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', badge: 'bg-orange-500/20 text-orange-400 border-orange-500/30', icon: '🟠' },
    Medium: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400', badge: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: '🟡' },
    Low: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: '🔵' },
    Information: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', badge: 'bg-purple-500/20 text-purple-400 border-purple-500/30', icon: '🟣' },
    'Not classified': { bg: 'bg-gray-500/10', border: 'border-gray-500/30', text: 'text-gray-400', badge: 'bg-gray-500/20 text-gray-400 border-gray-500/30', icon: '⚪' }
  };

  const colors = severityConfig[severity] || severityConfig['Not classified'];

  // Compute average duration in hours
  const avgHours = data.length > 0
    ? Math.round(data.reduce((acc, d) => acc + parseInt(d.duration, 10), 0) / data.length)
    : 0;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center text-2xl`}>
              {colors.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-[var(--color-text)]">{title}</h3>
              <div className="flex items-center gap-3 mt-1">
                <span className={`text-xs px-3 py-1 rounded-full border font-medium ${colors.badge}`}>
                  {severity}
                </span>
                <span className="text-xs text-[var(--color-muted)]">
                  <span className="font-mono text-[var(--color-text)]">{totalCount}</span> problems found in <span className="text-[var(--color-text)] font-medium">{areaName}</span>
                </span>
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

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {data.length === 0 ? (
            <div className="text-center py-16 text-[var(--color-muted)]">
              <Info size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg">No {severity.toLowerCase()} problems found in {areaName}</p>
              <p className="text-sm mt-1 opacity-60">All systems are operating normally</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <div className="bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)] p-3">
                  <p className="text-xs text-[var(--color-faint)]">Total Problems</p>
                  <p className="text-lg font-bold text-[var(--color-text)]">{data.length}</p>
                </div>
                <div className="bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)] p-3">
                  <p className="text-xs text-[var(--color-faint)]">Unique Hosts</p>
                  <p className="text-lg font-bold text-[var(--color-text)]">{new Set(data.map(d => d.host)).size}</p>
                </div>
                <div className="bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)] p-3">
                  <p className="text-xs text-[var(--color-faint)]">Avg Duration</p>
                  <p className="text-lg font-bold text-[var(--color-text)]">{avgHours}h</p>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[var(--color-bg)] border-b border-[var(--color-border)]">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-faint)] uppercase tracking-wider">Time</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-faint)] uppercase tracking-wider">Host</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-faint)] uppercase tracking-wider">Problem</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-faint)] uppercase tracking-wider">Duration</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-faint)] uppercase tracking-wider">Tags</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, index) => (
                      <tr
                        key={index}
                        onClick={() => {
                          setSelectedDetail(item);
                          setShowDetailModal(true);
                        }}
                        className={`border-b border-[var(--color-border)] hover:bg-[var(--color-border)]/5 transition cursor-pointer ${index === data.length - 1 ? 'border-b-0' : ''}`}
                      >
                        <td className="px-4 py-3 text-[var(--color-text)] font-mono text-xs whitespace-nowrap">
                          {item.time}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[var(--color-ok)]"></div>
                            <span className="text-[var(--color-text)] font-medium">{item.host}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 max-w-xs">
                          <div className="flex items-start gap-2">
                            <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${colors.text.replace('text-', 'bg-')}`}></span>
                            <span className="text-[var(--color-text)] text-sm leading-relaxed">{item.problem}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <Clock size={14} className="text-[var(--color-muted)]" />
                            <span className="text-[var(--color-muted)] font-mono text-xs">{item.duration}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1.5">
                            {item.tags.map((tag, i) => (
                              <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-[var(--color-border)]/20 text-[var(--color-muted)] border border-[var(--color-border)]/50 hover:border-[var(--color-border)] transition">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-[var(--color-border)] bg-[var(--color-bg)] px-6">
          <div className="flex items-center gap-4 text-xs text-[var(--color-muted)]">
            <span>Showing <span className="text-[var(--color-text)] font-medium">{data.length}</span> problems</span>
            <span className="w-px h-4 bg-[var(--color-border)]"></span>
            <span>Severity: <span className={`font-medium ${colors.text}`}>{severity}</span></span>
            <span className="w-px h-4 bg-[var(--color-border)]"></span>
            <span>Area: <span className="text-[var(--color-text)] font-medium">{areaName}</span></span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => toast.success('Exporting problems...')}
              className="px-4 py-2 text-sm border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-border)]/10 transition text-[var(--color-muted)] hover:text-[var(--color-text)] flex items-center gap-2"
            >
              <Download size={16} />
              Export
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 text-sm bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90 transition shadow-lg shadow-[var(--color-accent)]/20"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Detail Sub-Modal */}
      {showDetailModal && selectedDetail && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[70] p-4"
          onClick={() => setShowDetailModal(false)}
        >
          <div
            className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
              <div className="flex items-center gap-3">
                <AlertCircle size={20} className="text-[var(--color-crit)]" />
                <div>
                  <h3 className="text-xl font-bold text-[var(--color-text)]">
                    {selectedDetail.host} · {selectedDetail.problem}
                  </h3>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs bg-[var(--color-panel-alt)] px-2 py-0.5 rounded border border-[var(--color-border)] text-[var(--color-muted)]">
                      {severity}
                    </span>
                    <span className="text-xs text-[var(--color-muted)]">Host {selectedDetail.host}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="w-10 h-10 rounded-xl hover:bg-[var(--color-border)]/10 transition flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-text)]"
              >
                <X size={22} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] space-y-5">
              {/* Root Cause */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-sm font-semibold text-[var(--color-text)] uppercase tracking-wider">Root Cause Analysis</h4>
                  <span className="text-xs font-bold text-[var(--color-accent)] bg-[var(--color-accent)]/10 px-2 py-0.5 rounded-full border border-[var(--color-accent)]/20">
                    {selectedDetail.confidence || "85%"} CONFIDENCE
                  </span>
                </div>
                <p className="text-sm text-[var(--color-text)] leading-relaxed">
                  {selectedDetail.rootCause || "No root cause analysis available."}
                </p>
                <ul className="mt-3 space-y-1">
                  {(selectedDetail.metrics || []).map((metric, i) => (
                    <li key={i} className="text-sm text-[var(--color-muted)] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]"></span>
                      {metric}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Action */}
              <div>
                <h4 className="text-sm font-semibold text-[var(--color-text)] uppercase tracking-wider mb-2">Recommended Action</h4>
                <div className="bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)] p-4">
                  <p className="text-sm text-[var(--color-text)] leading-relaxed">
                    {selectedDetail.recommendation || "No recommendation available."}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end p-4 border-t border-[var(--color-border)] bg-[var(--color-bg)] px-6">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-6 py-2 text-sm bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90 transition shadow-lg shadow-[var(--color-accent)]/20"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// GeoMap with India map image
const GeoMap = ({ problemGroups, onDotClick }) => {
  const cities = problemGroups.map(group => ({
    ...group,
    ...(cityCoordinates[group.name] || { left: "50%", top: "50%" })
  }));

  return (
    <div className="relative w-full max-w-[700px] mx-auto">
      <img
        src={IndiaMap}
        alt="India Map"
        className="w-full h-auto select-none"
      />
      {cities.map((city) => {
        let color = "#00ff88";
        if (city.critical > 0) color = "#ff4444";
        else if (city.high > 0) color = "#ffaa00";

        return (
          <button
            key={city.name}
            className="absolute"
            style={{ left: city.left, top: city.top, transform: "translate(-50%,-50%)" }}
            onClick={() => onDotClick(city.name, city.critical > 0 ? "Critical" : city.high > 0 ? "High" : "Low", city.critical + city.high + city.medium)}
          >
            <span className="absolute w-6 h-6 rounded-full animate-ping" style={{ background: color, opacity: 0.3 }} />
            <span className="block w-4 h-4 rounded-full border-2 border-white" style={{ background: color }} />
            <div className="mt-1 text-xs font-semibold text-white whitespace-nowrap">{city.name}</div>
          </button>
        );
      })}
    </div>
  );
};

// Generate popup data – durations now in hours (11–30h)
const generatePopupDataForArea = (areaName, severity, count) => {
  const problems = [
    { problem: "Service is unavailable - HTTP 503 error", rootCause: "The service is not responding to health checks. This may be due to a deployment failure, configuration error, or resource exhaustion.", recommendation: "Check the service logs for errors. Verify the deployment status. Restart the service if needed." },
    { problem: "High CPU usage detected - exceeding 90% threshold", rootCause: "CPU utilization has exceeded the critical threshold. This is likely caused by a runaway process, high system load, or insufficient resources.", recommendation: "Investigate the top processes using 'top' or 'task manager'. Consider scaling resources or optimizing application code." },
    { problem: "Memory exhausted - swap usage at 95%", rootCause: "Memory usage is critically high. This may indicate a memory leak, excessive caching, or insufficient RAM for the running services.", recommendation: "Check memory consumption per process. Increase swap space or add more RAM. Investigate for memory leaks." },
    { problem: "Disk full - no space left on device", rootCause: "Disk space is fully utilized. This may cause system performance degradation and application failures.", recommendation: "Clean up temporary files, archive old logs, and consider increasing disk capacity or moving data to another volume." },
    { problem: "Network latency spike - response time > 500ms", rootCause: "Network latency has increased significantly. This may be due to network congestion, routing issues, or overloaded network devices.", recommendation: "Check network utilization and identify the source of congestion. Verify routing tables and consider QoS policies." },
    { problem: "Database connection failed - connection pool exhausted", rootCause: "The database connection pool is exhausted. This may be due to a connection leak, insufficient pool size, or database overload.", recommendation: "Increase the connection pool size. Investigate for connection leaks in the application. Monitor database performance." },
    { problem: "SSL certificate expired - unable to establish secure connection", rootCause: "The SSL certificate has expired. This prevents secure connections and may cause service disruption.", recommendation: "Renew the SSL certificate and deploy it to all affected services. Update the certificate renewal automation." },
    { problem: "Backup failed - insufficient storage space", rootCause: "The backup process failed due to insufficient storage space. This may compromise data recovery capabilities.", recommendation: "Free up storage space by removing old backups. Increase storage capacity or implement a retention policy." },
    { problem: "Service not responding - health check timeout", rootCause: "The service is not responding to health checks within the timeout period. This may indicate a hung process or deadlock.", recommendation: "Restart the service and check logs for errors. Investigate potential deadlocks or resource contention." },
    { problem: "High error rate - 5% of requests failing", rootCause: "The error rate has exceeded the acceptable threshold. This may be due to application bugs, dependency failures, or infrastructure issues.", recommendation: "Analyze error logs to identify the root cause. Check dependencies and infrastructure health. Deploy fixes as needed." },
    { problem: "JVM heap memory usage critical", rootCause: "JVM heap memory usage is critically high. This may be due to a memory leak or excessive object allocation.", recommendation: "Analyze heap dumps to identify memory leaks. Increase heap size if needed. Optimize application code." },
    { problem: "Database replication lag detected", rootCause: "Database replication lag is exceeding acceptable limits. This may affect read consistency and failover capabilities.", recommendation: "Check network latency between replicas. Investigate write load and optimize replication settings." },
    { problem: "Cache miss ratio high - performance degraded", rootCause: "The cache miss ratio is high, causing performance degradation. This may be due to cache eviction policies or changing access patterns.", recommendation: "Review cache configuration and increase cache size if needed. Analyze cache access patterns." },
    { problem: "API rate limit exceeded", rootCause: "API rate limits have been exceeded. This may be due to increased usage or a misconfigured client.", recommendation: "Review API usage patterns and consider increasing rate limits. Implement client‑side throttling." },
    { problem: "Pod crash loop detected", rootCause: "Kubernetes pods are in a crash loop. This may be due to application errors, resource constraints, or configuration issues.", recommendation: "Check pod logs for errors. Verify resource limits and application configuration. Investigate cluster health." },
    { problem: "Container health check failed", rootCause: "Container health checks are failing. This may be due to application errors or dependency failures within the container.", recommendation: "Check container logs for errors. Verify health check configuration. Investigate application state." },
    { problem: "DNS resolution failed", rootCause: "DNS resolution is failing for critical services. This may be due to DNS server issues or incorrect DNS configuration.", recommendation: "Check DNS server health and connectivity. Verify DNS configuration and fallback settings." },
    { problem: "Firewall rule blocking traffic", rootCause: "Firewall rules are blocking legitimate traffic. This may be due to misconfigured rules or security policy changes.", recommendation: "Review firewall logs to identify blocked traffic. Update rules to allow necessary traffic while maintaining security." }
  ];

  const hosts = [
    "VITBLRUATMSSQL", "VITBLRSRVAAC01", "VITBLRSRVD01", "vitblrsrvbkp01",
    "VITBLRSRVAAC02", "VITBLRSRVVW01", "VITSRVADC02", "VITBLRSRVPW01",
    "ASPL_VITBLRSRVT51", "VITSRVPRTG01", "PROD-WEB-01", "PROD-DB-01",
    "STG-APP-01", "DEV-CACHE-01", "AZSHPWEB01v", "AZSHPWEB02v",
    "EASTARM01v", "EASTFILE01v", "EASTROOTCA", "NOCFILE01v"
  ];

  const tags = [
    "Application: MSSQL", "Service: Web Server", "Environment: Production",
    "Priority: High", "Application: Database", "Service: API Gateway",
    "Environment: Staging", "Priority: Medium", "Application: Cache",
    "Service: Load Balancer", "Environment: Development", "Team: DevOps",
    "Team: Backend", "Component: Authentication"
  ];

  const data = [];
  const countToGenerate = Math.min(count || 5, 20);

  for (let i = 0; i < countToGenerate; i++) {
    const now = new Date();
    const pastDate = new Date(now);
    pastDate.setDate(now.getDate() - Math.floor(Math.random() * 365));
    pastDate.setHours(Math.floor(Math.random() * 24));
    pastDate.setMinutes(Math.floor(Math.random() * 60));
    pastDate.setSeconds(Math.floor(Math.random() * 60));

    // Duration: hours only, between 11 and 30
    const durationHours = Math.floor(Math.random() * 20) + 11; // 11–30
    const duration = `${durationHours}h`;

    const numTags = Math.floor(Math.random() * 2) + 2;
    const selectedTags = [];
    const shuffledTags = [...tags].sort(() => Math.random() - 0.5);
    for (let j = 0; j < numTags && j < shuffledTags.length; j++) {
      if (!selectedTags.includes(shuffledTags[j])) {
        selectedTags.push(shuffledTags[j]);
      }
    }

    const problemData = problems[i % problems.length];
    data.push({
      time: pastDate.toISOString().replace('T', ' ').slice(0, 19),
      info: severity.charAt(0).toUpperCase() + severity.slice(1),
      host: hosts[Math.floor(Math.random() * hosts.length)],
      problem: problemData.problem,
      duration: duration,
      tags: selectedTags,
      rootCause: problemData.rootCause,
      recommendation: problemData.recommendation,
      confidence: `${Math.floor(70 + Math.random() * 25)}%`,
      metrics: [
        `Status: ${severity}`,
        `Host: ${hosts[Math.floor(Math.random() * hosts.length)]}`,
        `Detected: ${new Date(pastDate).toLocaleDateString()}`
      ]
    });
  }

  return data;
};

// Mock data generator
const generateNOCData = () => {
  const problemGroups = [
    { name: "Bangalore", critical: 1, high: 16, medium: 69, low: 8, information: 14, notClassified: 1 },
    { name: "Mumbai", critical: 0, high: 8, medium: 23, low: 3, information: 5, notClassified: 0 },
    { name: "Delhi", critical: 2, high: 4, medium: 12, low: 1, information: 3, notClassified: 1 },
  ];
  return { problemGroups };
};

export default function NOCDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState(() => {
    const now = new Date();
    const fourDaysAgo = new Date(now);
    fourDaysAgo.setDate(now.getDate() - 4);
    return fourDaysAgo.toISOString().slice(0, 16);
  });
  const [toDate, setToDate] = useState(() => {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const mapRef = useRef(null);
  const [popupState, setPopupState] = useState({
    isOpen: false,
    title: '',
    severity: '',
    areaName: '',
    data: [],
    totalCount: 0
  });
  const [expandedSections, setExpandedSections] = useState({
    problems: true,
    map: true,
  });

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(false), 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = (showToast = true) => {
    setIsRefreshing(true);
    setLoading(true);
    setTimeout(() => {
      const data = generateNOCData();
      setDashboardData(data);
      setLoading(false);
      setIsRefreshing(false);
      if (showToast) toast.success("Dashboard updated");
    }, 800);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleApplyDateRange = () => {
    if (fromDate && toDate) {
      const from = new Date(fromDate);
      const to = new Date(toDate);
      if (from > to) {
        toast.error("From date must be before To date");
        return;
      }
      toast.success(`Date range applied: ${from.toLocaleString()} to ${to.toLocaleString()}`);
      fetchData(true);
    } else {
      toast.error("Please select both dates");
    }
  };

  const openPopup = (areaName, severity, count) => {
    if (!dashboardData) return;
    const data = generatePopupDataForArea(areaName, severity, count);
    setPopupState({
      isOpen: true,
      title: `${severity} Problems in ${areaName}`,
      severity: severity,
      areaName: areaName,
      data: data,
      totalCount: count
    });
  };

  const closePopup = () => {
    setPopupState({
      isOpen: false,
      title: '',
      severity: '',
      areaName: '',
      data: [],
      totalCount: 0
    });
  };

  const exportToPDF = async () => {
    setIsExporting(true);
    const toastId = toast.loading("Generating PDF...");
    try {
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      let yPos = 20;
      const margin = 20;
      const pageWidth = 280;
      const pageHeight = 210;
      
      pdf.setFontSize(18);
      pdf.setTextColor('#000000');
      pdf.text('NOC Dashboard', margin, yPos);
      yPos += 10;
      
      pdf.setFontSize(10);
      pdf.setTextColor('#666666');
      pdf.text(`From: ${fromDate}  To: ${toDate}`, margin, yPos);
      yPos += 10;
      
      pdf.setDrawColor(200, 200, 200);
      pdf.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 8;
      
      const mapElement = document.querySelector('.map-container');
      if (mapElement) {
        const canvas = await html2canvas(mapElement, {
          scale: 1.5,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          width: mapElement.scrollWidth,
          height: mapElement.scrollHeight,
        });
        const imgData = canvas.toDataURL('image/jpeg', 0.9);
        const imgWidth = pageWidth - (margin * 2);
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        if (yPos + imgHeight > pageHeight - 20) {
          pdf.addPage();
          yPos = 20;
        }
        pdf.addImage(imgData, 'JPEG', margin, yPos, imgWidth, imgHeight);
        yPos += imgHeight + 10;
      }
      
      if (yPos > pageHeight - 50) {
        pdf.addPage();
        yPos = 20;
      }
      
      pdf.setFontSize(14);
      pdf.setTextColor('#000000');
      pdf.text('Problems by severity', margin, yPos);
      yPos += 10;
      
      const headers = ['Host group', 'Critical', 'High', 'Medium', 'Low', 'Information', 'Not classified'];
      let xPos = margin;
      const colWidths = [45, 22, 22, 22, 22, 28, 32];
      pdf.setFontSize(9);
      pdf.setTextColor('#666666');
      headers.forEach((header, i) => {
        pdf.text(header, xPos, yPos);
        xPos += colWidths[i];
      });
      yPos += 5;
      
      pdf.setTextColor('#333333');
      dashboardData.problemGroups.forEach((group) => {
        if (yPos > pageHeight - 20) {
          pdf.addPage();
          yPos = 20;
        }
        xPos = margin;
        const rowData = [
          group.name,
          group.critical || '-',
          group.high || '-',
          group.medium || '-',
          group.low || '-',
          group.information || '-',
          group.notClassified || '-'
        ];
        rowData.forEach((data, i) => {
          pdf.text(String(data), xPos, yPos);
          xPos += colWidths[i];
        });
        yPos += 6;
      });
      
      pdf.setFontSize(8);
      pdf.setTextColor('#999999');
      pdf.text(`Generated on: ${new Date().toLocaleString()}`, margin, pageHeight - 10);
      pdf.save(`NOC_Dashboard_${new Date().toISOString().slice(0, 10)}.pdf`);
      toast.success("PDF exported successfully!", { id: toastId });
    } catch (error) {
      console.error("PDF Export Error:", error);
      toast.error("Failed to export PDF: " + error.message, { id: toastId });
    } finally {
      setIsExporting(false);
    }
  };

  if (loading && !dashboardData) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size={48} />
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Date Range Selector */}
      <Card className="overflow-hidden">
        <div className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <DatePicker value={fromDate} onChange={setFromDate} label="From" />
            <DatePicker value={toDate} onChange={setToDate} label="To" />
            <button 
              onClick={handleApplyDateRange}
              className="px-4 py-1.5 bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-80 transition"
            >
              Apply
            </button>
          </div>
        </div>
      </Card>

      {/* Problems by Severity */}
      <Card className="overflow-hidden">
        <div 
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-[var(--color-border)]/10 transition"
          onClick={() => toggleSection('problems')}
        >
          <div className="flex items-center gap-3">
            {expandedSections.problems ? <ChevronDown size={20} className="text-[var(--color-muted)]" /> : <ChevronRight size={20} className="text-[var(--color-muted)]" />}
            <AlertTriangle size={20} className="text-[var(--color-muted)]" />
            <h3 className="font-semibold text-[var(--color-text)]">Problems by severity</h3>
          </div>
        </div>
        {expandedSections.problems && (
          <div className="p-4 border-t border-[var(--color-border)] overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--color-bg)] border-b border-[var(--color-border)]">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-faint)] uppercase tracking-wider">Host group</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-[var(--color-faint)] uppercase tracking-wider">
                    <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span>Critical</span>
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-[var(--color-faint)] uppercase tracking-wider">
                    <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500"></span>High</span>
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-[var(--color-faint)] uppercase tracking-wider">
                    <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500"></span>Medium</span>
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-[var(--color-faint)] uppercase tracking-wider">
                    <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span>Low</span>
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-[var(--color-faint)] uppercase tracking-wider">
                    <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500"></span>Information</span>
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-[var(--color-faint)] uppercase tracking-wider">
                    <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-500"></span>Not classified</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.problemGroups.map((group, i) => (
                  <tr key={i} className={`border-b border-[var(--color-border)] hover:bg-[var(--color-border)]/5 transition ${i % 2 === 0 ? 'bg-[var(--color-bg)]/30' : ''}`}>
                    <td className="px-4 py-3 text-[var(--color-text)] font-medium">{group.name}</td>
                    <td className="px-4 py-3 text-center">
                      {group.critical > 0 ? (
                        <button onClick={() => openPopup(group.name, 'Critical', group.critical)} className="px-3 py-1 rounded-lg bg-red-500/10 text-red-400 font-bold hover:bg-red-500/20 transition cursor-pointer border border-red-500/20 hover:border-red-500/40">
                          {group.critical}
                        </button>
                      ) : <span className="text-[var(--color-faint)]">—</span>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {group.high > 0 ? (
                        <button onClick={() => openPopup(group.name, 'High', group.high)} className="px-3 py-1 rounded-lg bg-orange-500/10 text-orange-400 font-bold hover:bg-orange-500/20 transition cursor-pointer border border-orange-500/20 hover:border-orange-500/40">
                          {group.high}
                        </button>
                      ) : <span className="text-[var(--color-faint)]">—</span>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {group.medium > 0 ? (
                        <button onClick={() => openPopup(group.name, 'Medium', group.medium)} className="px-3 py-1 rounded-lg bg-yellow-500/10 text-yellow-400 font-bold hover:bg-yellow-500/20 transition cursor-pointer border border-yellow-500/20 hover:border-yellow-500/40">
                          {group.medium}
                        </button>
                      ) : <span className="text-[var(--color-faint)]">—</span>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {group.low > 0 ? (
                        <button onClick={() => openPopup(group.name, 'Low', group.low)} className="px-3 py-1 rounded-lg bg-blue-500/10 text-blue-400 font-bold hover:bg-blue-500/20 transition cursor-pointer border border-blue-500/20 hover:border-blue-500/40">
                          {group.low}
                        </button>
                      ) : <span className="text-[var(--color-faint)]">—</span>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {group.information > 0 ? (
                        <button onClick={() => openPopup(group.name, 'Information', group.information)} className="px-3 py-1 rounded-lg bg-purple-500/10 text-purple-400 font-bold hover:bg-purple-500/20 transition cursor-pointer border border-purple-500/20 hover:border-purple-500/40">
                          {group.information}
                        </button>
                      ) : <span className="text-[var(--color-faint)]">—</span>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {group.notClassified > 0 ? (
                        <button onClick={() => openPopup(group.name, 'Not classified', group.notClassified)} className="px-3 py-1 rounded-lg bg-gray-500/10 text-gray-400 font-bold hover:bg-gray-500/20 transition cursor-pointer border border-gray-500/20 hover:border-gray-500/40">
                          {group.notClassified}
                        </button>
                      ) : <span className="text-[var(--color-faint)]">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Popup Modal */}
      <PopupModal
        isOpen={popupState.isOpen}
        onClose={closePopup}
        title={popupState.title}
        data={popupState.data}
        severity={popupState.severity}
        areaName={popupState.areaName}
        totalCount={popupState.totalCount}
      />

      {/* India Map */}
      <Card className="overflow-hidden">
        <div 
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-[var(--color-border)]/10 transition"
          onClick={() => toggleSection('map')}
        >
          <div className="flex items-center gap-3">
            {expandedSections.map ? <ChevronDown size={20} className="text-[var(--color-muted)]" /> : <ChevronRight size={20} className="text-[var(--color-muted)]" />}
            <Globe size={20} className="text-[var(--color-muted)]" />
            <h3 className="font-semibold text-[var(--color-text)]">India Network Status</h3>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1 text-[var(--color-ok)]">● 1 Healthy</span>
            <span className="inline-flex items-center gap-1 text-[var(--color-warn)]">● 1 Warning</span>
            <span className="inline-flex items-center gap-1 text-[var(--color-crit)]">● 1 Critical</span>
          </div>
        </div>
        {expandedSections.map && (
          <div className="p-4 border-t border-[var(--color-border)] map-container" ref={mapRef}>
            <GeoMap
              problemGroups={dashboardData.problemGroups}
              onDotClick={(cityName, severity, count) => openPopup(cityName, severity, count)}
            />
          </div>
        )}
      </Card>
    </div>
  );
}