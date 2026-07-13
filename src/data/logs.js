// src/data/logs.js
const services = [
  "api-gateway", "auth-service", "order-service", "payment-service", 
  "notification-service", "db-master", "cache-service", "user-service",
  "inventory-service", "shipping-service", "analytics-service", "kafka-broker"
];

const endpoints = [
  "/api/v1/users", "/api/v1/orders", "/api/v1/payments", "/api/v1/auth/login",
  "/api/v1/auth/refresh", "/api/v1/products", "/api/v1/cart", "/api/v1/checkout",
  "/api/v1/notifications", "/api/v1/webhooks", "/graphql/query", "/metrics"
];

const errorMessages = [
  "Connection pool exhausted", "Request timed out after 30s",
  "Database connection failed", "Invalid JWT token",
  "Rate limit exceeded", "Service unavailable",
  "SSL handshake failed", "DNS resolution failed",
  "Memory allocation error", "Disk I/O error",
  "Unhandled exception", "Null pointer exception",
  "Transaction rollback", "Deadlock detected",
  "Authentication failed", "Authorization denied"
];

const infoMessages = [
  "User authenticated successfully", "Order placed successfully",
  "Payment processed", "Cache hit",
  "Cache miss", "Database query executed",
  "Service started", "Service stopped",
  "Health check passed", "Health check failed",
  "Configuration reloaded", "Schema migration completed",
  "Backup completed", "Cron job executed",
  "Webhook delivered", "Email sent successfully"
];

const warnMessages = [
  "High memory usage detected", "CPU usage exceeded threshold",
  "Slow query detected: 2.5s", "Cache memory pressure",
  "SSL certificate expires in 7 days", "Disk usage at 85%",
  "High network latency", "Connection pool at 90% capacity",
  "Rogue process detected", "Deprecated API used"
];

const debugMessages = [
  "Debug: request headers", "Debug: response payload",
  "Debug: stack trace", "Debug: variable state",
  "Debug: SQL query", "Debug: cache key",
  "Debug: middleware execution", "Debug: route match"
];

const severities = ["error", "warn", "info", "debug", "error", "info", "info", "warn"];

const getRandomMessage = (severity) => {
  const pools = {
    error: errorMessages,
    warn: warnMessages,
    info: infoMessages,
    debug: debugMessages,
  };
  const pool = pools[severity] || infoMessages;
  return pool[Math.floor(Math.random() * pool.length)];
};

const generateLog = (index) => {
  const severity = severities[Math.floor(Math.random() * severities.length)];
  const service = services[Math.floor(Math.random() * services.length)];
  const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
  const message = getRandomMessage(severity);
  const now = new Date();
  const time = new Date(now.getTime() - index * 5000 + Math.random() * 2000);
  
  return {
    id: index,
    timestamp: time.toISOString(),
    severity,
    service,
    endpoint,
    message: `${message} [${service}${endpoint}]`,
    traceId: `trace-${Math.random().toString(36).substring(2, 8)}`,
    requestId: `req-${Math.random().toString(36).substring(2, 8)}`,
  };
};

export const initialLogs = Array.from({ length: 1000 }, (_, i) => generateLog(i));

export const generateNewLogs = (count = 1) => {
  return Array.from({ length: count }, (_, i) => {
    const severity = severities[Math.floor(Math.random() * severities.length)];
    const service = services[Math.floor(Math.random() * services.length)];
    const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
    const message = getRandomMessage(severity);
    return {
      id: Date.now() + i,
      timestamp: new Date().toISOString(),
      severity,
      service,
      endpoint,
      message: `${message} [${service}${endpoint}]`,
      traceId: `trace-${Math.random().toString(36).substring(2, 8)}`,
      requestId: `req-${Math.random().toString(36).substring(2, 8)}`,
    };
  });
};