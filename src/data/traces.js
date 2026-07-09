// src/data/traces.js
const services = ["api-gateway", "auth-service", "order-service", "payment-service", "notification-service"];
const spanNames = ["GET /users", "POST /order", "PUT /cart", "DELETE /item", "SELECT * FROM orders", "INSERT INTO logs"];
const statuses = ["success", "error", "success", "success", "error"];

const generateSpan = () => ({
  name: spanNames[Math.floor(Math.random() * spanNames.length)],
  duration: Math.floor(10 + Math.random() * 500), // ms
  status: statuses[Math.floor(Math.random() * statuses.length)] === "error" ? "error" : "success",
});

const generateTrace = (id) => {
  const service = services[Math.floor(Math.random() * services.length)];
  const duration = Math.floor(100 + Math.random() * 2000);
  const status = Math.random() > 0.85 ? "error" : "success";
  const spans = Array.from({ length: 2 + Math.floor(Math.random() * 4) }, () => generateSpan());
  const timestamp = new Date(Date.now() - Math.random() * 3600000).toISOString();
  return {
    id: `trace-${id}`,
    service,
    duration,
    status,
    spans,
    timestamp,
  };
};

export const initialTraces = Array.from({ length: 50 }, (_, i) => generateTrace(i + 1));

export const generateNewTrace = () => {
  const id = Date.now();
  return generateTrace(id);
};