// Parse actual Windows Event / OpenTelemetry log data

const services = [
  "otelcol-contrib",
  "payments-api",
  "inventory-service",
  "gateway",
  "auth-service",
  "kafka-exporter",
];

const endpoints = [
  "/v1/export",
  "/api/login",
  "/api/orders",
  "/metrics",
  "/health",
];

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getSeverity(level) {
  switch ((level || "").toLowerCase()) {
    case "error":
      return "error";
    case "warning":
    case "warn":
      return "warn";
    case "debug":
      return "debug";
    default:
      return "info";
  }
}

export const initialLogs = [
  {
    id: 1,
    timestamp: "2026-07-14T13:10:00.570+05:30",
    severity: "info",
    service: "otelcol-contrib",
    endpoint: "/v1/export",
    message:
      "Exporting failed. Will retry request after interval. OTLP endpoint unavailable.",
    traceId: "5aece34a-b6ee",
    computer: "WIN-IPU7LMP28TG",
    channel: "Application",
  },
  {
    id: 2,
    timestamp: "2026-07-14T13:10:00.145+05:30",
    severity: "info",
    service: "otelcol-contrib",
    endpoint: "/v1/export",
    message:
      "rpc error: transport: Error while dialing tcp 192.168.2.63:4317",
    traceId: "88601546e94b",
    computer: "WIN-IPU7LMP28TG",
    channel: "Application",
  },
  {
    id: 3,
    timestamp: "2026-07-14T13:09:59.089+05:30",
    severity: "warn",
    service: "otelcol-contrib",
    endpoint: "/v1/export",
    message:
      "Connection attempt failed because remote host failed to respond.",
    traceId: "34727cb8d8bc",
    computer: "WindowsServerUAT",
    channel: "Application",
  },
  {
    id: 4,
    timestamp: "2026-07-14T13:09:57.627+05:30",
    severity: "error",
    service: "payments-api",
    endpoint: "/api/orders",
    message:
      "Kafka producer unavailable. Failed to publish transaction event.",
    traceId: "cb83992a81",
    computer: "APP-SERVER-01",
    channel: "Application",
  },
  {
    id: 5,
    timestamp: "2026-07-14T13:09:56.210+05:30",
    severity: "debug",
    service: "gateway",
    endpoint: "/health",
    message:
      "Health check completed successfully.",
    traceId: "7d8219af2d",
    computer: "Gateway01",
    channel: "System",
  },
];

let nextId = initialLogs.length + 1;

export function generateNewLogs(count = 5) {
  const logs = [];

  for (let i = 0; i < count; i++) {
    const sev = random(["info", "info", "info", "warn", "error", "debug"]);

    let message = "";

    switch (sev) {
      case "error":
        message =
          "rpc error: code=Unavailable. Unable to connect to OTLP exporter.";
        break;

      case "warn":
        message =
          "Retrying failed export because destination endpoint is unavailable.";
        break;

      case "debug":
        message =
          "Processing telemetry batch successfully.";
        break;

      default:
        message =
          "Exporting logs to OTLP collector.";
    }

    logs.push({
      id: nextId++,
      timestamp: new Date().toISOString(),
      severity: sev,
      service: random(services),
      endpoint: random(endpoints),
      message,
      traceId: Math.random().toString(16).substring(2, 14),
      computer:
        Math.random() > 0.5
          ? "WIN-IPU7LMP28TG"
          : "WindowsServerUAT",
      channel: "Application",
    });
  }

  return logs;
}