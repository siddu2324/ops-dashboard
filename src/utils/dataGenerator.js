// src/utils/dataGenerator.js
export const generateLogsFromAlerts = (alerts, serverStatuses) => {
  const logs = [];
  const now = Date.now();

  // Generate logs for each alert
  alerts.forEach((alert) => {
    const severity = alert.severity || "Information";
    const level = severity === "Critical" ? "error" : severity === "High" ? "warn" : "info";
    const host = alert.host || "unknown";
    const service = alert.service || "unknown";
    const msg = alert.alertname || "Alert triggered";

    // Generate a log entry for the alert
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

  // Also generate periodic info logs for healthy servers
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

  // Sort by timestamp descending
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

  // Add some healthy traces
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