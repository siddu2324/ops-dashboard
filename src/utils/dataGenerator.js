// src/utils/dataGenerator.js

// ----- Existing functions -----
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

// ----- NEW: Realistic Windows Event Log generator -----
export const generateRealisticLogsFromState = (alerts, serverStatuses) => {
  const logs = [];
  const now = new Date();

  // Helper to create a detailed Windows Event Log entry
  const createWindowsEventLog = ({
    level,
    message,
    computer,
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
    const timestamp = new Date(now - Math.random() * 86400000 * 2).toISOString();
    const record_id = recordId || Math.floor(Math.random() * 1000000) + 100000;
    const pid = processId || Math.floor(Math.random() * 10000) + 100;
    const tid = threadId || Math.floor(Math.random() * 10000) + 100;

    return {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      timestamp: timestamp.replace('T', ' ').slice(0, 19) + '.' + (timestamp.split('.')[1]?.slice(0, 3) || '000'),
      level: level,
      channel: channel,
      computer: computer,
      event_id: { id: eventId, qualifiers: 0 },
      message: message,
      task: task,
      record_id: record_id,
      system_time: timestamp,
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

  // 1. Generate logs from alerts
  alerts.forEach((alert) => {
    const severity = alert.severity || "Information";
    const level = severity === "Critical" ? "Critical" : severity === "High" ? "Error" : severity === "Warning" ? "Warning" : "Information";
    const host = alert.host || "unknown";
    const message = alert.alertname || "Alert triggered";
    const task = alert.source || "Infrastructure";
    let eventId = 0;
    let channel = "System";
    let details = {};
    let provider = "Microsoft-Windows-Security-Auditing";

    switch (severity) {
      case "Critical":
        eventId = 41;
        channel = "System";
        details = {
          "BugcheckCode": Math.floor(Math.random() * 1000),
          "BugcheckParameter1": "0x00000000",
          "BugcheckParameter2": "0x00000000",
          "BugcheckParameter3": "0x00000000",
          "BugcheckParameter4": "0x00000000",
          "SleepInProgress": "false",
          "PowerButtonTimestamp": "0"
        };
        provider = "Microsoft-Windows-Kernel-Power";
        break;
      case "Warning":
        eventId = 1003;
        channel = "System";
        details = {
          "ErrorCode": Math.floor(Math.random() * 1000),
          "ErrorMessage": message
        };
        provider = "Microsoft-Windows-WER-SystemErrorReporting";
        break;
      case "Error":
        eventId = 1000;
        channel = "Application";
        details = {
          "EventData": {
            "Data": "Application: " + host + " crashed with exception code 0xc0000005"
          }
        };
        provider = "Application Error";
        break;
      default:
        eventId = 4688;
        channel = "Security";
        details = {
          "Subject": {
            "Security ID": "S-1-5-18",
            "Account Name": "SYSTEM",
            "Account Domain": "NT AUTHORITY",
            "Logon ID": "0x3e7"
          },
          "New Process": {
            "Process ID": `0x${Math.floor(Math.random() * 10000).toString(16)}`,
            "Process Name": `C:\\Windows\\System32\\${["services.exe", "lsass.exe", "winlogon.exe"][Math.floor(Math.random() * 3)]}`,
            "Token Elevation Type": "%%1936",
            "Mandatory Label": "S-1-16-16384"
          }
        };
        provider = "Microsoft-Windows-Security-Auditing";
        break;
    }

    logs.push(createWindowsEventLog({
      level: level,
      message: message,
      computer: host,
      channel: channel,
      eventId: eventId,
      task: task,
      details: details,
      providerName: provider,
      keywords: ["Audit Success"],
    }));
  });

  // 2. Generate logs from server statuses
  Object.entries(serverStatuses).forEach(([hostname, data]) => {
    const status = data.status || "up";
    const metrics = data.metrics || { cpu: 0, memory: 0, disk: 0 };

    if (status === "down") {
      logs.push(createWindowsEventLog({
        level: "Critical",
        message: `${hostname} is unreachable (ICMP timeout)`,
        computer: hostname,
        channel: "System",
        eventId: 41,
        task: "Connectivity",
        details: {
          "Network Status": "Unreachable",
          "Last Ping": "Timeout",
          "Packet Loss": "100%",
          "Interface": "eth0"
        },
        providerName: "Microsoft-Windows-Kernel-Power",
        keywords: ["Critical"],
      }));
    } else if (status === "warning") {
      let issue = "resource usage warning";
      if (metrics.cpu > 80) issue = `high CPU usage (${metrics.cpu}%)`;
      else if (metrics.memory > 80) issue = `high memory usage (${metrics.memory}%)`;
      else if (metrics.disk > 80) issue = `high disk usage (${metrics.disk}%)`;

      logs.push(createWindowsEventLog({
        level: "Warning",
        message: `${hostname} has ${issue}`,
        computer: hostname,
        channel: "System",
        eventId: 1003,
        task: "Resource Usage",
        details: {
          "CPU": `${metrics.cpu}%`,
          "Memory": `${metrics.memory}%`,
          "Disk": `${metrics.disk}%`,
          "Threshold": "80%"
        },
        providerName: "Microsoft-Windows-WER-SystemErrorReporting",
        keywords: ["Warning"],
      }));
    } else {
      // Healthy servers – occasional informational logs
      if (Math.random() > 0.6) {
        logs.push(createWindowsEventLog({
          level: "Information",
          message: `Health check passed for ${hostname}`,
          computer: hostname,
          channel: "System",
          eventId: 7036,
          task: "Health Check",
          details: {
            "Status": "Up",
            "Uptime": data.uptime || "N/A",
            "Last Check": new Date().toISOString()
          },
          providerName: "Service Control Manager",
          keywords: ["Audit Success"],
        }));
      }
    }
  });

  // 3. Add some random Security audit logs for realism
  const securityEvents = [
    { id: 4624, message: "An account was successfully logged on.", task: "Logon" },
    { id: 4634, message: "An account was logged off.", task: "Logoff" },
    { id: 4672, message: "Special privileges assigned to new logon.", task: "Privilege Use" },
    { id: 4690, message: "An attempt was made to duplicate a handle to an object.", task: "Handle Manipulation" },
    { id: 4656, message: "A handle to an object was requested.", task: "File System" },
    { id: 4658, message: "The handle to an object was closed.", task: "File System" },
  ];

  for (let i = 0; i < 5; i++) {
    const event = securityEvents[Math.floor(Math.random() * securityEvents.length)];
    const host = Object.keys(serverStatuses)[Math.floor(Math.random() * Object.keys(serverStatuses).length)] || "unknown";
    logs.push(createWindowsEventLog({
      level: "Information",
      message: event.message,
      computer: host,
      channel: "Security",
      eventId: event.id,
      task: event.task,
      details: {
        "Subject": {
          "Security ID": `S-1-5-${Math.floor(Math.random() * 100)}`,
          "Account Name": "SYSTEM",
          "Account Domain": "NT AUTHORITY",
          "Logon ID": `0x${Math.floor(Math.random() * 10000).toString(16)}`
        },
        "Process Information": {
          "Process ID": `0x${Math.floor(Math.random() * 10000).toString(16)}`,
          "Process Name": `C:\\Windows\\System32\\${["services.exe", "lsass.exe"][Math.floor(Math.random() * 2)]}`
        }
      },
      providerName: "Microsoft-Windows-Security-Auditing",
      keywords: ["Audit Success"],
    }));
  }

  // 4. Add some Application logs
  const appEvents = [
    { id: 1000, message: "Application error: The application failed to start.", task: "Application Error" },
    { id: 1001, message: "Application crash detected.", task: "Application Crash" },
    { id: 1002, message: "Application hang detected.", task: "Application Hang" },
  ];
  for (let i = 0; i < 3; i++) {
    const event = appEvents[Math.floor(Math.random() * appEvents.length)];
    const host = Object.keys(serverStatuses)[Math.floor(Math.random() * Object.keys(serverStatuses).length)] || "unknown";
    logs.push(createWindowsEventLog({
      level: "Error",
      message: event.message,
      computer: host,
      channel: "Application",
      eventId: event.id,
      task: event.task,
      details: {
        "Application": `C:\\Program Files\\App\\app.exe`,
        "Version": "1.2.3",
        "Exception Code": `0xc0000005`,
        "Faulting Module": `kernel32.dll`,
        "Faulting Offset": `0x00001234`
      },
      providerName: "Application Error",
      keywords: ["Error"],
    }));
  }

  // Sort by timestamp descending
  return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};