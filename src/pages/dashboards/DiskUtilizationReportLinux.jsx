// src/pages/dashboards/DiskUtilizationReportLinux.jsx
import { useState } from "react";
import Card from "../../components/common/Card";
import { X, Clock, AlertCircle, ChevronRight } from "lucide-react";

// Helper to generate realistic disk utilization stats (in percentage)
const generateDiskStats = () => {
  const min = Math.round(Math.random() * 30 + 10); // 10–40
  const avg = Math.round(Math.random() * 30 + min + 10); // min+10 to min+40
  const max = Math.round(Math.random() * 20 + avg + 5); // avg+5 to avg+25, capped at 100
  return { min, avg, max: Math.min(max, 100) };
};

// Linux Disk data with generated stats
const diskDataLinux = [
  { hostname: "VITBLRSRVZBC01", ip: "192.168.6.101" },
  { hostname: "VITBLRSRVZDB01", ip: "192.168.2.111" },
  { hostname: "Docker", ip: "192.168.2.73" },
  { hostname: "VITZBOXORACLE_192.168.2.164", ip: "192.168.2.164" },
  { hostname: "ASPL Pulse", ip: "192.168.2.111" },
  { hostname: "zbxkuibectl-JMX Tomcat", ip: "192.168.2.115" },
  { hostname: "Database Server", ip: "192.168.2.111" },
  { hostname: "vitblruat03", ip: "192.168.2.192" },
  { hostname: "SPLUNKTEST", ip: "192.168.4.172" },
  { hostname: "photon_machine", ip: "192.168.4.157" },
].map(host => {
  const stats = generateDiskStats();
  return { ...host, ...stats };
});

// Generate mock problems for a host
const generateProblemsForHost = (hostname) => {
  const problemTemplates = [
    { 
      status: "PROBLEM", 
      severity: "Critical", 
      info: "Host unreachable", 
      duration: "2d 14h 23m",
      detail: {
        title: `${hostname} · unreachable`,
        source: "Infrastructure",
        host: hostname,
        service: "Ubuntu 22.04",
        referenceId: `SRV-${hostname}-001`,
        ip: "10.2.1.12",
        confidence: "94%",
        rootCause: `${hostname} is under elevated network unreachability (100%). This has crossed the critical threshold (85%) and is likely impacting workloads scheduled on this host.`,
        metrics: [
          "Packet loss 100%",
          "Network I/O 0/0 Mbps (rx/tx)",
          "Last ping response 0ms"
        ],
        recommendation: "Check network connectivity, firewall rules, and ensure the host is powered on. Investigate any network outages or configuration changes."
      }
    },
    { 
      status: "PROBLEM", 
      severity: "High", 
      info: "High disk usage (>90%)", 
      duration: "5h 12m",
      detail: {
        title: `${hostname} · high disk usage`,
        source: "Infrastructure",
        host: hostname,
        service: "Ubuntu 22.04",
        referenceId: `SRV-${hostname}-002`,
        ip: "10.2.1.12",
        confidence: "88%",
        rootCause: `${hostname} is experiencing high disk utilization (92%). This has crossed the critical threshold (85%) and is likely impacting application performance.`,
        metrics: [
          "Disk utilization 92%",
          "Read IOPS 1.2k",
          "Write IOPS 800"
        ],
        recommendation: "Investigate processes causing high disk I/O on ${hostname}. Consider moving data to another disk or optimizing application queries."
      }
    },
    { 
      status: "PROBLEM", 
      severity: "Medium", 
      info: "Service not running", 
      duration: "1d 3h",
      detail: {
        title: `${hostname} · service failure`,
        source: "Infrastructure",
        host: hostname,
        service: "Ubuntu 22.04",
        referenceId: `SRV-${hostname}-003`,
        ip: "10.2.1.12",
        confidence: "76%",
        rootCause: `Critical service on ${hostname} is not running. This has impacted application availability.`,
        metrics: [
          "Service uptime 0%",
          "Restart attempts 3",
          "Last start time failed"
        ],
        recommendation: "Restart the service and check logs for errors. Verify service dependencies and configuration files."
      }
    },
    { 
      status: "PROBLEM", 
      severity: "Low", 
      info: "Disk space warning", 
      duration: "3d 8h",
      detail: {
        title: `${hostname} · disk space`,
        source: "Infrastructure",
        host: hostname,
        service: "Ubuntu 22.04",
        referenceId: `SRV-${hostname}-004`,
        ip: "10.2.1.12",
        confidence: "91%",
        rootCause: `${hostname} is running low on disk space (92% usage). This may cause performance degradation and application failures.`,
        metrics: [
          "Disk utilization 92%",
          "Available space 8%",
          "Inode usage 78%"
        ],
        recommendation: "Clean up unnecessary files, archive old logs, and consider increasing disk capacity for ${hostname}."
      }
    },
    { 
      status: "PROBLEM", 
      severity: "Information", 
      info: "Configuration change detected", 
      duration: "1h 30m",
      detail: {
        title: `${hostname} · config change`,
        source: "Infrastructure",
        host: hostname,
        service: "Ubuntu 22.04",
        referenceId: `SRV-${hostname}-005`,
        ip: "10.2.1.12",
        confidence: "68%",
        rootCause: `Configuration change detected on ${hostname}. This may affect system behavior.`,
        metrics: [
          "Config version changed",
          "Last change by admin",
          "Rollback available"
        ],
        recommendation: "Review the configuration changes and verify they are intended. If needed, rollback to previous version."
      }
    },
    { 
      status: "PROBLEM", 
      severity: "Not classified", 
      info: "Unknown error", 
      duration: "12h 45m",
      detail: {
        title: `${hostname} · unknown error`,
        source: "Infrastructure",
        host: hostname,
        service: "Ubuntu 22.04",
        referenceId: `SRV-${hostname}-006`,
        ip: "10.2.1.12",
        confidence: "45%",
        rootCause: `${hostname} encountered an unknown error. This may be due to a software bug or misconfiguration.`,
        metrics: [
          "Error logs 5",
          "Last error timestamp",
          "Stack trace available"
        ],
        recommendation: "Check system logs for details. Consider restarting the service and monitoring for recurrence."
      }
    }
  ];
  const count = Math.floor(Math.random() * 3) + 1;
  const shuffled = [...problemTemplates].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((p, idx) => ({
    id: idx,
    time: new Date(Date.now() - Math.random() * 86400000).toISOString().replace('T', ' ').slice(0, 19),
    ...p,
    host: hostname,
  }));
};

// ---- Problem Detail Modal ----
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
            <span className="text-xs font-mono text-[var(--color-faint)]">Reference ID {detail.referenceId}</span>
          </div>

          <div className="bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)] p-4">
            <p className="text-sm text-[var(--color-text)]">
              Live resource snapshot for {detail.host} ({detail.ip}).
            </p>
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
          <button
            onClick={() => alert('Marked as reviewed')}
            className="px-4 py-2 text-sm border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-border)]/10 transition text-[var(--color-text)]"
          >
            Mark reviewed
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
  );
};

// ---- Host Problems Modal ----
const HostProblemsModal = ({ isOpen, onClose, hostname, problems }) => {
  const [selectedProblem, setSelectedProblem] = useState(null);

  if (!isOpen) return null;

  const severityColors = {
    Critical: "bg-[var(--color-crit)] text-white",
    High: "bg-[var(--color-crit)]/80 text-white",
    Medium: "bg-[var(--color-warn)] text-[#06222A]",
    Low: "bg-[var(--color-ok)] text-[#06222A]",
    Information: "bg-[var(--color-accent)] text-[#06222A]",
    "Not classified": "bg-[var(--color-border)] text-[var(--color-muted)]",
  };

  const handleRowClick = (problem) => {
    setSelectedProblem(problem);
  };

  const closeDetail = () => {
    setSelectedProblem(null);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-2xl max-w-5xl w-full max-h-[85vh] overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
            <div className="flex items-center gap-3">
              <AlertCircle size={20} className="text-[var(--color-crit)]" />
              <div>
                <h3 className="text-xl font-bold text-[var(--color-text)]">Problems for {hostname}</h3>
                <p className="text-xs text-[var(--color-muted)]">{problems.length} problems found</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl hover:bg-[var(--color-border)]/10 transition flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-text)]"
            >
              <X size={22} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(85vh-100px)]">
            {problems.length === 0 ? (
              <div className="text-center py-12 text-[var(--color-muted)]">
                <p className="text-lg">No problems for {hostname}</p>
                <p className="text-sm mt-1">All systems are operating normally</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[var(--color-bg)] border-b border-[var(--color-border)]">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-faint)] uppercase tracking-wider">Time</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-faint)] uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-faint)] uppercase tracking-wider">Severity</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-faint)] uppercase tracking-wider">Info</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-faint)] uppercase tracking-wider">Duration</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-faint)] uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {problems.map((p) => (
                      <tr
                        key={p.id}
                        onClick={() => handleRowClick(p)}
                        className="border-b border-[var(--color-border)] hover:bg-[var(--color-border)]/10 transition cursor-pointer group"
                      >
                        <td className="px-4 py-3 text-[var(--color-text)] font-mono text-xs whitespace-nowrap">{p.time}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--color-crit)] text-white">
                            {p.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${severityColors[p.severity] || severityColors["Not classified"]}`}>
                            {p.severity}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[var(--color-text)]">{p.info}</td>
                        <td className="px-4 py-3 text-[var(--color-faint)] font-mono text-xs flex items-center gap-1">
                          <Clock size={12} />
                          {p.duration}
                        </td>
                        <td className="px-4 py-3">
                          <button className="text-xs text-[var(--color-accent)] hover:underline flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                            <ChevronRight size={12} />
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between p-4 border-t border-[var(--color-border)] bg-[var(--color-bg)] px-6">
            <span className="text-xs text-[var(--color-muted)]">Displaying {problems.length} of {problems.length} found</span>
            <button
              onClick={onClose}
              className="px-6 py-2 text-sm bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90 transition shadow-lg shadow-[var(--color-accent)]/20"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <ProblemDetailModal
        isOpen={!!selectedProblem}
        onClose={closeDetail}
        problem={selectedProblem}
      />
    </>
  );
};

// ---- Main Component ----
export default function DiskUtilizationReportLinux() {
  const [selectedHost, setSelectedHost] = useState(null);
  const [problems, setProblems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const handleRowClick = (hostname) => {
    const hostProblems = generateProblemsForHost(hostname);
    setSelectedHost(hostname);
    setProblems(hostProblems);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedHost(null);
    setProblems([]);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-[var(--color-text)]">Disk Utilization</h2>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-[var(--color-muted)] text-xs uppercase tracking-wider">
                <th className="py-2 px-3 font-medium">Host name</th>
                <th className="py-2 px-3 font-medium">IP Address</th>
                <th className="py-2 px-3 font-medium text-right">Disk Utilization MIN</th>
                <th className="py-2 px-3 font-medium text-right">Disk Utilization AVG</th>
                <th className="py-2 px-3 font-medium text-right">Disk Utilization MAX</th>
              </tr>
            </thead>
            <tbody>
              {diskDataLinux.map((row) => (
                <tr
                  key={row.ip}
                  onClick={() => handleRowClick(row.hostname)}
                  className="border-b border-[var(--color-border)] hover:bg-[var(--color-panel-alt)] transition-colors cursor-pointer group"
                >
                  <td className="py-2 px-3 text-[var(--color-text)] flex items-center gap-2">
                    {row.hostname}
                    <span className="text-[10px] text-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition">
                      (click to view problems)
                    </span>
                  </td>
                  <td className="py-2 px-3 text-[var(--color-text)] font-mono text-xs">{row.ip}</td>
                  <td className="py-2 px-3 text-right text-[var(--color-text)] font-mono">{row.min}%</td>
                  <td className="py-2 px-3 text-right text-[var(--color-text)] font-mono">{row.avg}%</td>
                  <td className="py-2 px-3 text-right text-[var(--color-text)] font-mono">{row.max}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <HostProblemsModal
        isOpen={modalOpen}
        onClose={closeModal}
        hostname={selectedHost}
        problems={problems}
      />
    </div>
  );
}