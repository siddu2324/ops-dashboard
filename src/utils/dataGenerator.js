// src/utils/dataGenerator.js

// ----- Existing functions (unchanged) -----
export const generateLogsFromAlerts = (alerts, serverStatuses) => {
  const logs = [];
  const now = Date.now();

  alerts.forEach((alert) => {
    const severity = alert.severity || "Information";
    const level = severity === "Critical" ? "error" : severity === "High" ? "warn" : "info";
    const host = alert.host || "unknown";
    const service = alert.service || "unknown";
    const msg = alert.alertname || "Alert triggered";

    logs.push({
      id: `log-${Date.now()}-${Math.random()}`,
      timestamp: new Date(now - Math.random() * 3600000).toISOString().replace('T', ' ').slice(0, 19),
      level: level,
      service: service,
      endpoint: `/api/${service.toLowerCase().replace(/\s/g, '')}`,
      message: `[${severity}] ${msg}`,
      traceId: `trace-${Math.random().toString(36).substring(2, 8)}`,
      requestId: `req-${Math.random().toString(36).substring(2, 8)}`,
      host: host,
    });
  });

  Object.entries(serverStatuses).forEach(([host, data]) => {
    if (data.status === "up" && Math.random() > 0.5) {
      logs.push({
        id: `log-${Date.now()}-${Math.random()}`,
        timestamp: new Date(now - Math.random() * 86400000).toISOString().replace('T', ' ').slice(0, 19),
        level: "info",
        service: "system",
        endpoint: "/health",
        message: `Health check passed for ${host}`,
        traceId: `trace-${Math.random().toString(36).substring(2, 8)}`,
        requestId: `req-${Math.random().toString(36).substring(2, 8)}`,
        host: host,
      });
    }
  });

  return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

export const generateTracesFromAlerts = (alerts, serverStatuses) => {
  const traces = [];
  const now = Date.now();

  const services = ["api-gateway", "auth-service", "order-service", "payment-service", "notification-service"];
  const spanNames = ["GET /users", "POST /order", "PUT /cart", "DELETE /item", "SELECT * FROM orders", "INSERT INTO logs"];
  const statuses = ["success", "error"];

  alerts.forEach((alert) => {
    const service = alert.service || services[Math.floor(Math.random() * services.length)];
    const status = alert.severity === "Critical" ? "error" : "success";
    const duration = Math.floor(100 + Math.random() * 2000);
    const spans = Array.from({ length: 2 + Math.floor(Math.random() * 3) }, () => ({
      name: spanNames[Math.floor(Math.random() * spanNames.length)],
      duration: Math.floor(10 + Math.random() * 500),
      status: Math.random() > 0.8 ? "error" : "success",
    }));

    traces.push({
      id: `trace-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      service: service,
      duration: duration,
      status: status,
      spans: spans,
      timestamp: new Date(now - Math.random() * 3600000).toISOString(),
      host: alert.host || "unknown",
    });
  });

  if (traces.length < 5) {
    traces.push({
      id: `trace-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      service: "api-gateway",
      duration: 120,
      status: "success",
      spans: [{ name: "GET /users", duration: 45, status: "success" }, { name: "SELECT * FROM users", duration: 75, status: "success" }],
      timestamp: new Date(now - Math.random() * 3600000).toISOString(),
      host: "healthy-host-01",
    });
  }

  return traces.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

export const getMetricsSummary = (serverStatuses) => {
  const total = Object.keys(serverStatuses).length;
  const up = Object.values(serverStatuses).filter(s => s.status === "up").length;
  const warning = Object.values(serverStatuses).filter(s => s.status === "warning").length;
  const down = Object.values(serverStatuses).filter(s => s.status === "down").length;

  return { total, up, warning, down };
};

export const generateChartDataFromStatuses = (serverStatuses, metricKey = "cpu", points = 20) => {
  const now = Date.now();
  const values = Object.values(serverStatuses).map(s => s.metrics?.[metricKey] || 0);
  const avg = values.reduce((a, b) => a + b, 0) / values.length || 0;
  const max = Math.max(...values) || 100;
  const min = Math.min(...values) || 0;

  return Array.from({ length: points }, (_, i) => {
    const time = new Date(now - (points - i) * 60000);
    const base = avg + (Math.sin(i / 3) * 10) + (Math.random() * 5);
    const value = Math.max(0, Math.min(100, Math.floor(base)));
    return {
      time: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      [metricKey]: value,
    };
  });
};

// ============================================================
// ✅ UPDATED generateRealisticLogsFromState – multiple logs per server, spaced 20–30 minutes
// ============================================================
export const generateRealisticLogsFromState = (alerts, serverStatuses) => {
  const logs = [];
  const now = new Date();

  // Helper to create a Windows Event Log entry with a given timestamp
  const createWindowsEventLog = ({
    level,
    message,
    computer,
    timestamp,
    channel = "System",
    eventId,
    task = "None",
    details = {},
    providerName = "Microsoft-Windows-Security-Auditing",
    providerGuid = "{54849625-5478-4994-a5ba-3e3b0328c30d}",
    keywords = ["Audit Success"],
    opcode = "Info",
    recordId,
    processId,
    threadId,
    subject = {},
  }) => {
    const ts = timestamp || new Date(now - Math.random() * 86400000 * 2);
    const record_id = recordId || Math.floor(Math.random() * 1000000) + 100000;
    const pid = processId || Math.floor(Math.random() * 10000) + 100;
    const tid = threadId || Math.floor(Math.random() * 10000) + 100;
    const tsStr = ts.toISOString();

    return {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      timestamp: tsStr.replace('T', ' ').slice(0, 19) + '.' + (tsStr.split('.')[1]?.slice(0, 3) || '000'),
      level: level,
      channel: channel,
      computer: computer,
      event_id: { id: eventId, qualifiers: 0 },
      message: message,
      task: task,
      record_id: record_id,
      system_time: tsStr,
      version: Math.floor(Math.random() * 3),
      opcode: opcode,
      keywords: keywords,
      provider: {
        name: providerName,
        guid: providerGuid,
        event_source: ""
      },
      execution: {
        process_id: pid,
        thread_id: tid
      },
      correlation: {},
      subject: subject,
      rendering_info: {
        channel: channel,
        culture: "en-IN",
        keywords: keywords,
        level: level,
        message: message,
        opcode: opcode,
        provider: "Microsoft Windows security auditing.",
        task: task
      },
      details: details
    };
  };

  // For each server with status 'warning' or 'down', generate multiple logs with timestamps spaced 20–30 minutes apart
  Object.entries(serverStatuses).forEach(([hostname, data]) => {
    const status = data.status || "up";
    const metrics = data.metrics || { cpu: 0, memory: 0, disk: 0 };

    // Only generate logs for problematic servers
    if (status === "down" || status === "warning") {
      // Determine how many logs to generate (between 5 and 15)
      const count = Math.floor(Math.random() * 11) + 5; // 5-15
      // Random interval between 20 and 30 minutes (in milliseconds)
      const intervalMs = (20 + Math.random() * 10) * 60 * 1000; // 20-30 min

      let baseMessage = "";
      let level = "";
      let eventId = 0;
      let task = "";
      let details = {};
      let providerName = "";
      let keywords = [];

      if (status === "down") {
        level = "Critical";
        baseMessage = `${hostname} is unreachable (ICMP timeout)`;
        eventId = 41;
        task = "Connectivity";
        details = {
          "Network Status": "Unreachable",
          "Last Ping": "Timeout",
          "Packet Loss": "100%",
          "Interface": "eth0"
        };
        providerName = "Microsoft-Windows-Kernel-Power";
        keywords = ["Critical"];
      } else { // warning
        level = "Warning";
        let issue = "resource usage warning";
        if (metrics.cpu > 80) issue = `high CPU usage (${metrics.cpu}%)`;
        else if (metrics.memory > 80) issue = `high memory usage (${metrics.memory}%)`;
        else if (metrics.disk > 80) issue = `high disk usage (${metrics.disk}%)`;
        baseMessage = `${hostname} has ${issue}`;
        eventId = 1003;
        task = "Resource Usage";
        details = {
          "CPU": `${metrics.cpu}%`,
          "Memory": `${metrics.memory}%`,
          "Disk": `${metrics.disk}%`,
          "Threshold": "80%"
        };
        providerName = "Microsoft-Windows-WER-SystemErrorReporting";
        keywords = ["Warning"];
      }

      // Generate logs with timestamps going back in time
      for (let i = 0; i < count; i++) {
        // Timestamp: now minus (i * interval) plus some small jitter
        const offsetMs = (i * intervalMs) + (Math.random() * 5 * 60 * 1000); // random jitter up to 5 minutes
        const logTime = new Date(now.getTime() - offsetMs);
        // Ensure we don't go too far back (limit to last 48 hours)
        if (now.getTime() - logTime.getTime() > 48 * 60 * 60 * 1000) break;

        logs.push(createWindowsEventLog({
          level: level,
          message: baseMessage,
          computer: hostname,
          timestamp: logTime,
          channel: "System",
          eventId: eventId,
          task: task,
          details: details,
          providerName: providerName,
          keywords: keywords,
        }));
      }
    }
  });

  // Sort by timestamp descending
  return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};