// src/hooks/useHostProblems.js
export const generateProblemsForHost = (hostname) => {
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
      info: "High memory usage (>90%)",
      duration: "5h 12m",
      detail: {
        title: `${hostname} · memory pressure`,
        source: "Infrastructure",
        host: hostname,
        service: "Ubuntu 22.04",
        referenceId: `SRV-${hostname}-002`,
        ip: "10.2.1.12",
        confidence: "84%",
        rootCause: `${hostname} is under elevated memory pressure (91%). This has crossed the critical threshold (85%) and is likely impacting workloads scheduled on this host.`,
        metrics: [
          "Memory utilization 91%",
          "Swap usage 45%",
          "Cache hit ratio 62%"
        ],
        recommendation: "Investigate memory-consuming processes on ${hostname}. Consider increasing memory resources or redistributing workloads."
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
        rootCause: `Critical service '${hostname}' is not running. This has impacted application availability.`,
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