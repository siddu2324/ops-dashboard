// src/pages/dashboards/BangaloreDashboard.jsx
import { useState } from "react";
import Card from "../../components/common/Card";
import { X, AlertCircle, ChevronRight, Clock, Server, Power, Wifi } from "lucide-react";

// ---- Data ----
const hostAvailability = {
  available: { total: 0, agent: 0, snmp: 0 },
  notAvailable: { total: 2, agent: 0, snmp: 2 },
  mixed: { total: 0, agent: 0, snmp: 0 },
  unknown: { total: 23, agent: 17, snmp: 9 },
  total: { total: 25, agent: 17, snmp: 11 },
};

const severityData = [
  { name: "Host group", critical: 1, high: 10, medium: 6, low: 76, information: 3, notClassified: 19 },
  { name: "Linux HO servers", critical: 1, high: 10, medium: 6, low: 76, information: 3, notClassified: 19 },
  { name: "Network Devices-HO", critical: 1, high: 10, medium: 6, low: 76, information: 3, notClassified: 19 },
  { name: "Windows HO Servers", critical: 1, high: 10, medium: 6, low: 76, information: 3, notClassified: 19 },
];

const problemHostsData = [
  { name: "Host group", without: 1, with: 8, total: 7, notClassified: 0 },
  { name: "Linux HO servers", without: 1, with: 8, total: 0, notClassified: 11 },
  { name: "Network Devices-HO", without: 1, with: 8, total: 9, notClassified: 0 },
  { name: "Windows HO Servers", without: 1, with: 8, total: 0, notClassified: 9 },
];

// Rack devices – problemCount is the exact number of problems each device has
const rackDevices = [
  { name: "ASPL-HO-ACCESS01", problemCount: 17, u: 1 },
  { name: "ASPL-HO-FW-01", problemCount: 2, u: 4 },
  { name: "Internal IT: VITBLRSRVLAB01", problemCount: 0, u: 7 },
  { name: "Internal IT: VITBLRSRVHO01", problemCount: 0, u: 10 },
  { name: "Internal IT: VITSWTPOE01", problemCount: 2, u: 13 },
  { name: "Internal IT: VITSWTPOE02", problemCount: 1, u: 16 },
];

// ---- Generate problems for rack devices ----
const generateRackProblems = (deviceName, count) => {
  const templates = [
    {
      severity: "Critical",
      problem: `${deviceName} is unreachable via ICMP`,
      info: "Device offline",
      rootCause: (d) => `${d} is not responding to ICMP requests. This may be due to power failure, hardware fault, or network partition.`,
      metrics: ["ICMP timeout 100%", "SNMP no response", "Last seen: 2d 4h ago"],
      recommendation: (d) => `Check physical connectivity, power supply, and console logs. Schedule maintenance window for replacement if needed.`
    },
    {
      severity: "High",
      problem: `CPU utilization exceeded 90% on ${deviceName}`,
      info: "High CPU",
      rootCause: (d) => `CPU utilization has been consistently above 90% for the last 24 hours. This may be caused by broadcast storms or faulty firmware.`,
      metrics: ["CPU: 94%", "Memory: 62%", "Processes: 45"],
      recommendation: (d) => `Check for loops in the network. Upgrade firmware if needed. Monitor traffic patterns.`
    },
    {
      severity: "Medium",
      problem: `Port errors on ${deviceName}`,
      info: "Port errors",
      rootCause: (d) => `High error count on ports indicates physical layer issues or duplex mismatch.`,
      metrics: ["CRC errors: 1245", "Collisions: 89", "Speed: 1Gbps"],
      recommendation: (d) => `Inspect cables, replace if necessary. Check duplex settings on both ends.`
    },
    {
      severity: "High",
      problem: `Memory usage on ${deviceName} at 92%`,
      info: "High memory",
      rootCause: (d) => `Memory usage is critically high. This may be due to a memory leak or too many concurrent connections.`,
      metrics: ["Memory: 92%", "Connections: 12,450", "Swap: 0%"],
      recommendation: (d) => `Restart the service during maintenance. If issue persists, upgrade firmware.`
    },
    {
      severity: "Low",
      problem: `Firmware version on ${deviceName} is outdated`,
      info: "Old firmware",
      rootCause: (d) => `The device is running an outdated firmware with known security vulnerabilities.`,
      metrics: ["Current version: v5.2", "Latest: v6.0", "CVEs: 4"],
      recommendation: (d) => `Plan an upgrade to the latest firmware during a scheduled maintenance window.`
    },
    {
      severity: "Medium",
      problem: `PoE power budget exceeded on ${deviceName}`,
      info: "PoE overload",
      rootCause: (d) => `The PoE switch is trying to deliver more power than its budget allows. This may be due to additional powered devices.`,
      metrics: ["Budget: 120W", "Used: 110W", "Available: 10W"],
      recommendation: (d) => `Move some PoE devices to another switch or upgrade to a higher power model.`
    },
    {
      severity: "Low",
      problem: `Fan failure on ${deviceName}`,
      info: "Fan failure",
      rootCause: (d) => `One of the cooling fans has stopped spinning, which may lead to overheating.`,
      metrics: ["Temp: 68°C", "Fan1: OK", "Fan2: FAIL"],
      recommendation: (d) => `Replace the faulty fan immediately to prevent thermal shutdown.`
    },
    {
      severity: "Medium",
      problem: `Service 'VITSrvPDC01' is not running on ${deviceName}`,
      info: "Service failure",
      rootCause: (d) => `Critical service 'VITSrvPDC01' is not running. This has impacted application availability.`,
      metrics: ["Service uptime 0%", "Restart attempts 3", "Last start time failed"],
      recommendation: (d) => `Restart the service and check logs for errors. Verify service dependencies and configuration files.`
    }
  ];

  const problems = [];
  for (let i = 0; i < count; i++) {
    const t = templates[i % templates.length];
    const severity = t.severity;
    const status = "PROBLEM";
    const duration = `${Math.floor(Math.random() * 10) + 1}d ${Math.floor(Math.random() * 24)}h`;
    const time = new Date(Date.now() - Math.random() * 86400000 * 10)
      .toLocaleString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
    const problem = t.problem;
    const info = t.info;
    const rootCause = t.rootCause(deviceName);
    const recommendation = t.recommendation(deviceName);
    const metrics = t.metrics.map(m => m.replace(/\d+/, (n) => Math.floor(Number(n) + Math.random() * 20)));

    problems.push({
      id: `rack-${deviceName}-${i}`,
      time,
      status,
      severity,
      info,
      problem,
      duration,
      host: deviceName,
      detail: {
        title: `${deviceName} · ${info}`,
        source: "Infrastructure",
        host: deviceName,
        service: "Rack Device",
        referenceId: `RACK-${deviceName.slice(0,4)}-${String(i+1).padStart(3,'0')}`,
        ip: `192.168.${Math.floor(Math.random()*254+1)}.${Math.floor(Math.random()*254+1)}`,
        confidence: `${Math.floor(70 + Math.random() * 25)}%`,
        rootCause,
        metrics,
        recommendation
      }
    });
  }
  return problems;
};

// Pre‑generate problems for each rack device
const rackProblemsMap = {};
rackDevices.forEach(dev => {
  rackProblemsMap[dev.name] = generateRackProblems(dev.name, dev.problemCount);
});

// ---- Main problems table (shown below the rack) ----
const baseProblemsData = [
  {
    id: 1,
    time: "2026-07-09 02:04:26 AM",
    recoveryTime: "",
    status: "PROBLEM",
    info: "",
    host: "ASPL HO Demo Proxy 192.168.4.190",
    problem: "Zabbix ASPL HO Demo Proxy Not communicated Last 3 Mins",
    severity: "High",
    duration: "5d 21h",
  },
  {
    id: 2,
    time: "2026-07-07 01:17:04 AM",
    recoveryTime: "",
    status: "PROBLEM",
    info: "",
    host: "VITBLRHORODC-windows",
    problem: '"wuauser" (Windows Update) is not running (startup type automatic)',
    severity: "Medium",
    duration: "7d 21h 48m",
  },
  {
    id: 3,
    time: "2026-07-06 02:30:23 PM",
    recoveryTime: "",
    status: "PROBLEM",
    info: "",
    host: "VITBLRHORODC-windows",
    problem: '"TrustedInstaller" (Windows Modules Installer) is not running (startup type automatic)',
    severity: "Medium",
    duration: "8d 8h 34m",
  },
  {
    id: 4,
    time: "2026-07-04 06:29:22 PM",
    recoveryTime: "",
    status: "PROBLEM",
    info: "",
    host: "ASPL HO Demo Proxy 192.168.4.190",
    problem: "/: Disk space is critically low (used > 90%)",
    severity: "Critical",
    duration: "10d 4h 35m",
  },
  {
    id: 5,
    time: "2026-07-02 08:56:55 PM",
    recoveryTime: "",
    status: "PROBLEM",
    info: "",
    host: "VITBLRHORODC-windows",
    problem: '"GoogleUpdaterService151.0.7910.0" is not running (startup type automatic)',
    severity: "Low",
    duration: "12d 2h 8m",
  },
  {
    id: 6,
    time: "2026-07-02 07:56:49 PM",
    recoveryTime: "",
    status: "PROBLEM",
    info: "",
    host: "VITBLRHORODC-windows",
    problem: '"GoogleUpdaterInternalService151.0.7910.0" is not running (startup type automatic)',
    severity: "Low",
    duration: "12d 3h 8m",
  },
  {
    id: 7,
    time: "2026-07-01 02:05:12 PM",
    recoveryTime: "",
    status: "PROBLEM",
    info: "",
    host: "VITBLRHORODC-windows",
    problem: '"GoogleUpdaterInternalService150.0.7863.0" is not running (startup type automatic)',
    severity: "Low",
    duration: "13d 9h",
  },
];

// ---- Generate detail for a problem (for table rows) ----
const generateProblemDetail = (problem) => {
  const detailMap = {
    "Zabbix ASPL HO Demo Proxy Not communicated Last 3 Mins": {
      rootCause: `The Zabbix proxy is not communicating with the Zabbix server. This may be due to network connectivity issues, firewall blocking, or the proxy service being down.`,
      metrics: ["Last communication: 4 mins ago", "Proxy status: Offline", "Network latency: 150ms"],
      recommendation: "Check network connectivity between the proxy and server. Verify the proxy service is running and firewall rules allow traffic."
    },
    '"wuauser" (Windows Update) is not running (startup type automatic)': {
      rootCause: `The Windows Update service is not running on the host. This may affect system updates and security patches.`,
      metrics: ["Service status: Stopped", "Startup type: Automatic", "Last start attempt: Failed"],
      recommendation: "Restart the Windows Update service. Check for corrupted service configuration or dependencies."
    },
    '"TrustedInstaller" (Windows Modules Installer) is not running (startup type automatic)': {
      rootCause: `The Windows Modules Installer service is not running. This may affect the installation of updates and system components.`,
      metrics: ["Service status: Stopped", "Startup type: Automatic", "Last start attempt: Failed"],
      recommendation: "Restart the Windows Modules Installer service. Verify system file integrity."
    },
    "/: Disk space is critically low (used > 90%)": {
      rootCause: `Disk space on the root partition is critically low. This may cause system instability and application failures.`,
      metrics: ["Disk usage: 94%", "Free space: 6%", "Inode usage: 85%"],
      recommendation: "Clean up unnecessary files, archive old logs, and increase disk capacity if needed."
    },
    '"GoogleUpdaterService151.0.7910.0" is not running (startup type automatic)': {
      rootCause: `The Google Updater Service is not running. This may affect Google software updates.`,
      metrics: ["Service status: Stopped", "Startup type: Automatic", "Last start attempt: Failed"],
      recommendation: "Restart the Google Updater Service. Check for corrupted configuration or dependencies."
    },
    '"GoogleUpdaterInternalService151.0.7910.0" is not running (startup type automatic)': {
      rootCause: `The Google Updater Internal Service is not running. This may affect Google software updates.`,
      metrics: ["Service status: Stopped", "Startup type: Automatic", "Last start attempt: Failed"],
      recommendation: "Restart the Google Updater Internal Service. Check for corrupted configuration or dependencies."
    },
    '"GoogleUpdaterInternalService150.0.7863.0" is not running (startup type automatic)': {
      rootCause: `The Google Updater Internal Service is not running. This may affect Google software updates.`,
      metrics: ["Service status: Stopped", "Startup type: Automatic", "Last start attempt: Failed"],
      recommendation: "Restart the Google Updater Internal Service. Check for corrupted configuration or dependencies."
    }
  };

  let detail = detailMap[problem.problem];
  if (!detail) {
    detail = {
      rootCause: `${problem.host} is experiencing an issue: ${problem.problem}. This may affect system operations.`,
      metrics: ["Issue detected", "Check logs for details", "Investigate further"],
      recommendation: "Review system logs and configuration. Take corrective action as needed."
    };
  }
  return {
    ...problem,
    detail: {
      title: `${problem.host} · ${problem.problem}`,
      source: "Infrastructure",
      host: problem.host,
      service: "Bangalore Host",
      referenceId: `BLR-${problem.id}`,
      ip: "10.2.1.0",
      confidence: Math.floor(70 + Math.random() * 25) + "%",
      rootCause: detail.rootCause,
      metrics: detail.metrics,
      recommendation: detail.recommendation,
    }
  };
};

// ---- Modals ----
const ProblemDetailModal = ({ isOpen, onClose, problem }) => {
  if (!isOpen || !problem) return null;
  const { detail } = problem;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
          <div className="flex items-center gap-3">
            <AlertCircle size={20} className="text-[var(--color-crit)]" />
            <div>
              <h3 className="text-xl font-bold text-[var(--color-text)]">{detail.title}</h3>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-xs bg-[var(--color-panel-alt)] px-2 py-0.5 rounded border border-[var(--color-border)] text-[var(--color-muted)]">
                  {detail.source}
                </span>
                <span className="text-xs text-[var(--color-muted)]">Host {detail.host}</span>
                <span className="text-xs text-[var(--color-muted)]">Service {detail.service}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-xl hover:bg-[var(--color-border)]/10 transition flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-text)]">
            <X size={22} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <span className="text-[var(--color-muted)]">As of {new Date().toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
            <span className="text-xs font-mono text-[var(--color-faint)]">Reference ID {detail.referenceId}</span>
          </div>

          <div className="bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)] p-4">
            <p className="text-sm text-[var(--color-text)]">Live resource snapshot for {detail.host} ({detail.ip}).</p>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-2">
              <h4 className="text-sm font-semibold text-[var(--color-text)] uppercase tracking-wider">Root Cause Analysis</h4>
              <span className="text-xs font-bold text-[var(--color-accent)] bg-[var(--color-accent)]/10 px-2 py-0.5 rounded-full border border-[var(--color-accent)]/20">
                {detail.confidence} CONFIDENCE
              </span>
            </div>
            <p className="text-sm text-[var(--color-text)] leading-relaxed">{detail.rootCause}</p>
            <ul className="mt-3 space-y-1">
              {detail.metrics.map((metric, i) => (
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
              <p className="text-sm text-[var(--color-text)] leading-relaxed">{detail.recommendation}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-4 border-t border-[var(--color-border)] bg-[var(--color-bg)] px-6">
          <button onClick={() => alert('Marked as reviewed')} className="px-4 py-2 text-sm border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-border)]/10 transition text-[var(--color-text)]">
            Mark reviewed
          </button>
          <button onClick={onClose} className="px-6 py-2 text-sm bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90 transition shadow-lg shadow-[var(--color-accent)]/20">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const RackDeviceProblemsModal = ({ isOpen, onClose, deviceName, problems, onProblemClick }) => {
  if (!isOpen) return null;

  const severityColors = {
    Critical: "bg-[var(--color-crit)] text-white",
    High: "bg-[var(--color-crit)]/80 text-white",
    Medium: "bg-[var(--color-warn)] text-[#06222A]",
    Low: "bg-[var(--color-ok)] text-[#06222A]",
    Information: "bg-[var(--color-accent)] text-[#06222A]",
    "Not classified": "bg-[var(--color-border)] text-[var(--color-muted)]",
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
          <div className="flex items-center gap-3">
            <AlertCircle size={20} className="text-[var(--color-crit)]" />
            <div>
              <h3 className="text-xl font-bold text-[var(--color-text)]">Problems on {deviceName}</h3>
              <p className="text-xs text-[var(--color-muted)]">{problems.length} problems found</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-xl hover:bg-[var(--color-border)]/10 transition flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-text)]">
            <X size={22} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(85vh-120px)]">
          {problems.length === 0 ? (
            <div className="text-center py-12 text-[var(--color-muted)]">
              <p className="text-lg">No problems for {deviceName}</p>
              <p className="text-sm mt-1">All systems are operating normally</p>
            </div>
          ) : (
            <div className="space-y-3">
              {problems.map((p) => (
                <div key={p.id} onClick={() => onProblemClick(p)} className="border border-[var(--color-border)] rounded-lg p-4 hover:bg-[var(--color-border)]/5 transition cursor-pointer group">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-[var(--color-faint)] font-mono">{p.time}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${severityColors[p.severity]}`}>{p.severity}</span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--color-crit)] text-white">{p.status}</span>
                      </div>
                      <div className="mt-1 text-sm text-[var(--color-text)]">{p.problem}</div>
                      <div className="mt-0.5 text-xs text-[var(--color-muted)] flex items-center gap-3">
                        <span>Host: {p.host}</span>
                        <Clock size={12} className="inline" />
                        <span>{p.duration}</span>
                      </div>
                    </div>
                    <button className="text-[var(--color-accent)] text-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition flex-shrink-0">
                      <ChevronRight size={14} /> Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end p-4 border-t border-[var(--color-border)] bg-[var(--color-bg)] px-6">
          <button onClick={onClose} className="px-6 py-2 text-sm bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90 transition shadow-lg shadow-[var(--color-accent)]/20">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ---- Main Component ----
export default function BangaloreDashboard({ go }) {
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [rackModalOpen, setRackModalOpen] = useState(false);
  const [selectedRackDevice, setSelectedRackDevice] = useState(null);
  const [rackProblems, setRackProblems] = useState([]);

  const goBack = () => {
    localStorage.removeItem("selectedDashboard");
    if (go) go("Dashboards");
  };

  const handleRackDeviceClick = (device) => {
    const problems = rackProblemsMap[device.name] || [];
    setSelectedRackDevice(device.name);
    setRackProblems(problems);
    setRackModalOpen(true);
  };

  const handleRackProblemClick = (problem) => {
    setRackModalOpen(false);
    // Rack problems already have detail, so just set it
    setSelectedProblem(problem);
  };

  const closeDetail = () => setSelectedProblem(null);
  const closeRackModal = () => {
    setRackModalOpen(false);
    setSelectedRackDevice(null);
    setRackProblems([]);
  };

  const severityColors = {
    Critical: "bg-[var(--color-crit)] text-white",
    High: "bg-[var(--color-crit)]/80 text-white",
    Medium: "bg-[var(--color-warn)] text-[#06222A]",
    Low: "bg-[var(--color-ok)] text-[#06222A]",
    Information: "bg-[var(--color-accent)] text-[#06222A]",
    "Not classified": "bg-[var(--color-border)] text-[var(--color-muted)]",
  };

  const getStatusColor = (problems) => {
    if (problems === 0) return "var(--color-ok)";
    if (problems <= 2) return "var(--color-warn)";
    return "var(--color-crit)";
  };

  const totalUs = 18;
  const rackSlots = [];
  for (let u = totalUs; u >= 1; u--) {
    const device = rackDevices.find(d => d.u === u);
    rackSlots.push({ u, device });
  }

  // Main table row click – generate detail if missing
  const handleRowClick = (problem) => {
    if (!problem.detail) {
      const enriched = generateProblemDetail(problem);
      setSelectedProblem(enriched);
    } else {
      setSelectedProblem(problem);
    }
  };

  return (
    <div className="space-y-4">
      {/* Back button is provided by parent – no duplicate */}

      <h2 className="text-xl font-bold text-[var(--color-text)]">HO Rack Layout</h2>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {/* Host availability */}
          <Card title="Host availability">
            <div className="space-y-2 text-sm">
              <div className="font-medium text-[var(--color-text)]">Available</div>
              <div className="flex justify-between text-[var(--color-muted)]">
                <span>Total Hosts</span>
                <span className="text-[var(--color-ok)]">{hostAvailability.available.total}</span>
              </div>
              <div className="flex justify-between text-[var(--color-muted)] pl-4">
                <span>Agent (passive)</span>
                <span className="text-[var(--color-ok)]">{hostAvailability.available.agent}</span>
              </div>
              <div className="flex justify-between text-[var(--color-muted)] pl-4">
                <span>SNMP</span>
                <span className="text-[var(--color-ok)]">{hostAvailability.available.snmp}</span>
              </div>

              <div className="font-medium text-[var(--color-text)] mt-2">Not available</div>
              <div className="flex justify-between text-[var(--color-muted)]">
                <span>Total Hosts</span>
                <span className="text-[var(--color-crit)]">{hostAvailability.notAvailable.total}</span>
              </div>
              <div className="flex justify-between text-[var(--color-muted)] pl-4">
                <span>Agent (passive)</span>
                <span className="text-[var(--color-crit)]">{hostAvailability.notAvailable.agent}</span>
              </div>
              <div className="flex justify-between text-[var(--color-muted)] pl-4">
                <span>SNMP</span>
                <span className="text-[var(--color-crit)]">{hostAvailability.notAvailable.snmp}</span>
              </div>

              <div className="font-medium text-[var(--color-text)] mt-2">Mixed</div>
              <div className="flex justify-between text-[var(--color-muted)]">
                <span>Total Hosts</span>
                <span className="text-[var(--color-warn)]">{hostAvailability.mixed.total}</span>
              </div>
              <div className="flex justify-between text-[var(--color-muted)] pl-4">
                <span>Agent (passive)</span>
                <span className="text-[var(--color-warn)]">{hostAvailability.mixed.agent}</span>
              </div>
              <div className="flex justify-between text-[var(--color-muted)] pl-4">
                <span>SNMP</span>
                <span className="text-[var(--color-warn)]">{hostAvailability.mixed.snmp}</span>
              </div>

              <div className="font-medium text-[var(--color-text)] mt-2">Unknown</div>
              <div className="flex justify-between text-[var(--color-muted)]">
                <span>Total Hosts</span>
                <span className="text-[var(--color-faint)]">{hostAvailability.unknown.total}</span>
              </div>
              <div className="flex justify-between text-[var(--color-muted)] pl-4">
                <span>Agent (passive)</span>
                <span className="text-[var(--color-faint)]">{hostAvailability.unknown.agent}</span>
              </div>
              <div className="flex justify-between text-[var(--color-muted)] pl-4">
                <span>SNMP</span>
                <span className="text-[var(--color-faint)]">{hostAvailability.unknown.snmp}</span>
              </div>

              <div className="font-medium text-[var(--color-text)] mt-2 border-t border-[var(--color-border)] pt-2">Total</div>
              <div className="flex justify-between text-[var(--color-muted)]">
                <span>Total Hosts</span>
                <span className="text-[var(--color-text)] font-bold">{hostAvailability.total.total}</span>
              </div>
              <div className="flex justify-between text-[var(--color-muted)] pl-4">
                <span>Agent (passive)</span>
                <span className="text-[var(--color-text)]">{hostAvailability.total.agent}</span>
              </div>
              <div className="flex justify-between text-[var(--color-muted)] pl-4">
                <span>SNMP</span>
                <span className="text-[var(--color-text)]">{hostAvailability.total.snmp}</span>
              </div>
            </div>
          </Card>

          {/* Problems by severity */}
          <Card title="Problems by severity">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-border)] text-[var(--color-muted)] text-xs uppercase tracking-wider">
                    <th className="py-1 px-2 text-left font-medium">Host group</th>
                    <th className="py-1 px-2 text-center font-medium text-[var(--color-crit)]">C</th>
                    <th className="py-1 px-2 text-center font-medium text-[var(--color-crit)]/80">H</th>
                    <th className="py-1 px-2 text-center font-medium text-[var(--color-warn)]">M</th>
                    <th className="py-1 px-2 text-center font-medium text-[var(--color-ok)]">L</th>
                    <th className="py-1 px-2 text-center font-medium text-[var(--color-accent)]">I</th>
                    <th className="py-1 px-2 text-center font-medium text-[var(--color-faint)]">NC</th>
                  </tr>
                </thead>
                <tbody>
                  {severityData.map((row, idx) => (
                    <tr key={idx} className="border-b border-[var(--color-border)] hover:bg-[var(--color-border)]/5">
                      <td className="py-1 px-2 text-[var(--color-text)] text-xs">{row.name}</td>
                      <td className="py-1 px-2 text-center text-[var(--color-crit)] font-bold">{row.critical}</td>
                      <td className="py-1 px-2 text-center text-[var(--color-crit)]/80">{row.high}</td>
                      <td className="py-1 px-2 text-center text-[var(--color-warn)]">{row.medium}</td>
                      <td className="py-1 px-2 text-center text-[var(--color-ok)]">{row.low}</td>
                      <td className="py-1 px-2 text-center text-[var(--color-accent)]">{row.information}</td>
                      <td className="py-1 px-2 text-center text-[var(--color-faint)]">{row.notClassified}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Problem hosts */}
          <Card title="Problem hosts">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-border)] text-[var(--color-muted)] text-xs uppercase tracking-wider">
                    <th className="py-1 px-2 text-left font-medium">Host group</th>
                    <th className="py-1 px-2 text-center font-medium text-[var(--color-ok)]">WO</th>
                    <th className="py-1 px-2 text-center font-medium text-[var(--color-crit)]">W</th>
                    <th className="py-1 px-2 text-center font-medium text-[var(--color-text)]">T</th>
                    <th className="py-1 px-2 text-center font-medium text-[var(--color-faint)]">NC</th>
                  </tr>
                </thead>
                <tbody>
                  {problemHostsData.map((row, idx) => (
                    <tr key={idx} className="border-b border-[var(--color-border)] hover:bg-[var(--color-border)]/5">
                      <td className="py-1 px-2 text-[var(--color-text)] text-xs">{row.name}</td>
                      <td className="py-1 px-2 text-center text-[var(--color-ok)]">{row.without}</td>
                      <td className="py-1 px-2 text-center text-[var(--color-crit)]">{row.with}</td>
                      <td className="py-1 px-2 text-center text-[var(--color-text)] font-bold">{row.total || "—"}</td>
                      <td className="py-1 px-2 text-center text-[var(--color-faint)]">{row.notClassified || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right side */}
        <div className="lg:col-span-3 space-y-4">
          {/* Rack Layout */}
          <Card title="HO Rack Layout">
            <div className="flex flex-col lg:flex-row gap-6 p-4 bg-[var(--color-bg)] rounded-lg border border-[var(--color-border)]">
              <div className="flex-1 min-w-0">
                <div className="relative bg-[var(--color-panel)] border-2 border-[var(--color-border)] rounded-lg shadow-inner overflow-hidden">
                  <div className="bg-[var(--color-border)]/20 text-center py-1 text-[10px] font-mono text-[var(--color-faint)] tracking-widest border-b border-[var(--color-border)]">
                    RACK 01
                  </div>
                  <div className="relative px-2 py-1">
                    <div className="absolute left-1 top-0 bottom-0 flex flex-col justify-between text-[8px] text-[var(--color-faint)] font-mono opacity-60 py-1">
                      {Array.from({ length: totalUs }, (_, i) => totalUs - i).map((u) => (
                        <span key={u} className="leading-none">{u}</span>
                      ))}
                    </div>
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[var(--color-border)] opacity-20"></div>
                    <div className="absolute right-4 top-0 bottom-0 w-0.5 bg-[var(--color-border)] opacity-20"></div>
                    <div className="ml-6 mr-6 space-y-0.5 py-1">
                      {rackSlots.map(({ u, device }) => (
                        <div
                          key={u}
                          className={`relative h-6 rounded-sm transition-all duration-200 ${
                            device ? 'hover:scale-[1.02] hover:z-10 cursor-pointer' : ''
                          }`}
                          style={{
                            background: device
                              ? `color-mix(in srgb, ${getStatusColor(device.problemCount)} 25%, var(--color-panel-alt))`
                              : "transparent",
                            border: device
                              ? `1px solid ${getStatusColor(device.problemCount)}`
                              : "1px dashed var(--color-border)",
                            opacity: device ? 1 : 0.3,
                          }}
                          onClick={() => device && handleRackDeviceClick(device)}
                          title={device ? `Click to view ${device.problemCount} problems` : ''}
                        >
                          {device ? (
                            <div className="flex items-center justify-between h-full px-2">
                              <div className="flex items-center gap-2 overflow-hidden">
                                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: getStatusColor(device.problemCount) }}></span>
                                <span className="text-[10px] font-mono text-[var(--color-text)] truncate max-w-[140px] lg:max-w-[200px]">
                                  {device.name}
                                </span>
                              </div>
                              <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                                device.problemCount === 0
                                  ? "bg-[var(--color-ok)] text-[#06222A]"
                                  : "bg-[var(--color-crit)] text-white"
                              }`}>
                                {device.problemCount === 0 ? "OK" : device.problemCount}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center h-full px-2">
                              <span className="text-[8px] text-[var(--color-faint)] opacity-30">empty</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="bg-[var(--color-border)]/10 text-center py-0.5 text-[8px] font-mono text-[var(--color-faint)] border-t border-[var(--color-border)]">
                      18U
                    </div>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-col justify-between min-w-[140px] space-y-3">
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-[var(--color-text)]">Status Legend</div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-3 h-3 rounded-full bg-[var(--color-ok)]"></span>
                    <span className="text-[var(--color-text)]">OK (0 problems)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-3 h-3 rounded-full bg-[var(--color-warn)]"></span>
                    <span className="text-[var(--color-text)]">Warning (1–2)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-3 h-3 rounded-full bg-[var(--color-crit)]"></span>
                    <span className="text-[var(--color-text)]">Critical (3+)</span>
                  </div>
                </div>
                <div className="border-t border-[var(--color-border)] pt-2 space-y-1">
                  <div className="flex items-center gap-2 text-[var(--color-muted)] text-xs">
                    <Server size={14} /> <span>Total: {rackDevices.length} devices</span>
                  </div>
                  <div className="flex items-center gap-2 text-[var(--color-muted)] text-xs">
                    <span className="w-2 h-2 rounded-full bg-[var(--color-ok)]"></span>
                    <span>{rackDevices.filter(d => d.problemCount === 0).length} healthy</span>
                    <span className="mx-0.5">·</span>
                    <span className="w-2 h-2 rounded-full bg-[var(--color-crit)]"></span>
                    <span>{rackDevices.filter(d => d.problemCount > 0).length} with issues</span>
                  </div>
                  <div className="flex items-center gap-2 text-[var(--color-muted)] text-xs">
                    <Power size={12} /> <span>Power: On</span>
                  </div>
                  <div className="flex items-center gap-2 text-[var(--color-muted)] text-xs">
                    <Wifi size={12} /> <span>Network: Connected</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Problems table */}
          <Card title="Problems">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-border)] text-[var(--color-muted)] text-xs uppercase tracking-wider">
                    <th className="py-2 px-3 font-medium">Time</th>
                    <th className="py-2 px-3 font-medium">Recovery time</th>
                    <th className="py-2 px-3 font-medium">Status</th>
                    <th className="py-2 px-3 font-medium">Info</th>
                    <th className="py-2 px-3 font-medium">Host</th>
                    <th className="py-2 px-3 font-medium">Problem • Severity</th>
                    <th className="py-2 px-3 font-medium">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {baseProblemsData.map((row) => (
                    <tr key={row.id} onClick={() => handleRowClick(row)} className="border-b border-[var(--color-border)] hover:bg-[var(--color-border)]/10 transition cursor-pointer group">
                      <td className="py-2 px-3 text-[var(--color-text)] text-xs">{row.time}</td>
                      <td className="py-2 px-3 text-[var(--color-faint)] text-xs">{row.recoveryTime || "—"}</td>
                      <td className="py-2 px-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--color-crit)] text-white">{row.status}</span>
                      </td>
                      <td className="py-2 px-3 text-[var(--color-muted)] text-xs">{row.info || "—"}</td>
                      <td className="py-2 px-3 text-[var(--color-text)]">{row.host}</td>
                      <td className="py-2 px-3 text-[var(--color-text)]">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs">{row.problem}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium inline-block w-fit ${severityColors[row.severity] || severityColors["Not classified"]}`}>
                            {row.severity}
                          </span>
                        </div>
                      </td>
                      <td className="py-2 px-3 text-[var(--color-faint)] text-xs flex items-center gap-1">
                        <Clock size={12} /> {row.duration}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <RackDeviceProblemsModal
        isOpen={rackModalOpen}
        onClose={closeRackModal}
        deviceName={selectedRackDevice}
        problems={rackProblems}
        onProblemClick={handleRackProblemClick}
      />

      <ProblemDetailModal
        isOpen={!!selectedProblem}
        onClose={closeDetail}
        problem={selectedProblem}
      />
    </div>
  );
}