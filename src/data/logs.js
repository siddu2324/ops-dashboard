// src/data/logs.js
const services = ["api-gateway", "auth-service", "order-service", "payment-service", "notification-service", "db-master", "cache-service"];
const messages = [
  "Connection pool exhausted",
  "Request timed out",
  "User authentication failed",
  "Order placed successfully",
  "Payment processed",
  "Notification sent",
  "Cache miss",
  "Database query slow",
  "Service started",
  "Service stopped",
  "Health check passed",
  "Health check failed",
  "Config reloaded",
  "Disk usage high",
  "Memory pressure detected",
];

const severities = ["error", "warn", "info", "debug"];

const generateLog = (index) => {
  const severity = severities[Math.floor(Math.random() * severities.length)];
  const service = services[Math.floor(Math.random() * services.length)];
  const message = messages[Math.floor(Math.random() * messages.length)];
  const now = new Date();
  // generate timestamps going backwards
  const time = new Date(now.getTime() - index * 10000);
  return {
    id: index,
    timestamp: time.toISOString(),
    severity,
    service,
    message: `${message} (${service})`,
  };
};

export const initialLogs = Array.from({ length: 1000 }, (_, i) => generateLog(i));

// function to generate new logs (for auto-refresh)
export const generateNewLogs = (count = 1) => {
  return Array.from({ length: count }, (_, i) => {
    const severity = severities[Math.floor(Math.random() * severities.length)];
    const service = services[Math.floor(Math.random() * services.length)];
    const message = messages[Math.floor(Math.random() * messages.length)];
    return {
      id: Date.now() + i,
      timestamp: new Date().toISOString(),
      severity,
      service,
      message: `${message} (${service})`,
    };
  });
};