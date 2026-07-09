// src/data/alertRules.js
export const initialRules = [
  { id: 1, name: "CPU > 80%", severity: "critical", status: "firing", threshold: "80%", lastTriggered: "2 min ago" },
  { id: 2, name: "Memory > 90%", severity: "warning", status: "pending", threshold: "90%", lastTriggered: "15 min ago" },
  { id: 3, name: "Disk space < 10%", severity: "critical", status: "firing", threshold: "10%", lastTriggered: "1 hour ago" },
  { id: 4, name: "Service down", severity: "critical", status: "firing", threshold: "N/A", lastTriggered: "5 min ago" },
  { id: 5, name: "API latency > 200ms", severity: "warning", status: "firing", threshold: "200ms", lastTriggered: "30 min ago" },
  { id: 6, name: "Error rate > 5%", severity: "critical", status: "firing", threshold: "5%", lastTriggered: "10 min ago" },
  { id: 7, name: "DB connection pool", severity: "warning", status: "firing", threshold: "80%", lastTriggered: "45 min ago" },
  { id: 8, name: "SSL certificate expiry", severity: "warning", status: "firing", threshold: "7 days", lastTriggered: "2 days ago" },
];

export const generateNewAlertRule = () => {
  const names = ["CPU > 80%", "Memory > 90%", "Disk space < 10%", "Service down", "API latency > 200ms", "Error rate > 5%", "DB connection pool", "SSL certificate expiry"];
  const severities = ["critical", "warning"];
  const statuses = ["firing", "pending", "firing"];
  const thresholds = ["80%", "90%", "10%", "N/A", "200ms", "5%", "80%", "7 days"];
  const idx = Math.floor(Math.random() * names.length);
  return {
    id: Date.now(),
    name: names[idx],
    severity: severities[Math.floor(Math.random() * severities.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    threshold: thresholds[idx],
    lastTriggered: "Just now",
  };
};

export const initialAlertHistory = [
  { id: 1, ruleName: "CPU > 80%", severity: "critical", timestamp: "2026-07-09 10:23:45", status: "triggered" },
  { id: 2, ruleName: "Service down", severity: "critical", timestamp: "2026-07-09 09:15:20", status: "triggered" },
  { id: 3, ruleName: "Memory > 90%", severity: "warning", timestamp: "2026-07-09 08:45:10", status: "resolved" },
  { id: 4, ruleName: "CPU > 80%", severity: "critical", timestamp: "2026-07-09 08:10:05", status: "acknowledged" },
  { id: 5, ruleName: "Error rate > 5%", severity: "critical", timestamp: "2026-07-09 07:30:00", status: "triggered" },
];