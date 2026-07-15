// src/context/AlertContext.jsx
import { createContext, useContext, useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { serverInventory, generateServerMetrics } from "../data/servers";

// ----- Realistic mock data -----
const hostnames = serverInventory.map(s => s.hostname);
const services = ["Microsoft IIS", "Microsoft Exchange", "MySQL", "PostgreSQL", "Apache", "Nginx", "Redis", "Elasticsearch"];
const databases = ["PostgreSQL", "MySQL", "Oracle", "MSSQL", "MongoDB"];
const contactPoints = ["Loki", "Zabbix monitoring", "Slack", "PagerDuty", "Email", "SMS"];

const problemTemplates = [
  {
    severity: "Critical",
    info: "Service unavailable",
    problem: "{{host}} is unreachable via ICMP",
    tags: ["Network", "Connectivity"],
  },
  {
    severity: "High",
    info: "High CPU usage",
    problem: "{{host}} CPU utilization exceeded 90%",
    tags: ["Performance", "CPU"],
  },
  {
    severity: "High",
    info: "Memory exhausted",
    problem: "{{host}} memory usage above 95%",
    tags: ["Performance", "Memory"],
  },
  {
    severity: "Medium",
    info: "Disk space warning",
    problem: "{{host}} disk usage above 85%",
    tags: ["Storage", "Disk"],
  },
  {
    severity: "Medium",
    info: "Service stopped",
    problem: "{{service}} service is not running on {{host}}",
    tags: ["Service", "Application"],
  },
  {
    severity: "Low",
    info: "SSL certificate expiring",
    problem: "SSL certificate for {{host}} expires in 7 days",
    tags: ["Security", "Certificate"],
  },
  {
    severity: "Information",
    info: "Configuration change",
    problem: "Configuration change detected on {{host}}",
    tags: ["Change", "Configuration"],
  },
  {
    severity: "Critical",
    info: "Database connection failed",
    problem: "Database connection to {{db}} failed on {{host}}",
    tags: ["Database", "Connection"],
  },
];

// Helper to generate a random alert
const generateMockAlert = (host, id = null) => {
  const template = problemTemplates[Math.floor(Math.random() * problemTemplates.length)];
  const service = services[Math.floor(Math.random() * services.length)];
  const db = databases[Math.floor(Math.random() * databases.length)];
  const contact = contactPoints[Math.floor(Math.random() * contactPoints.length)];

  const hostname = host || hostnames[Math.floor(Math.random() * hostnames.length)];

  const problemText = template.problem
    .replace(/{{host}}/g, hostname)
    .replace(/{{service}}/g, service)
    .replace(/{{db}}/g, db);

  const severity = template.severity;
  const durationDays = Math.floor(Math.random() * 10) + 1;
  const durationHours = Math.floor(Math.random() * 24);
  const state = "active";
  const stateDuration = `for ${durationDays}d ${durationHours}h`;

  const now = new Date();
  const triggerTime = new Date(now - Math.random() * 86400000 * 30); // up to 30 days ago

  return {
    id: id || Date.now() + Math.random() * 1000,
    alertname: problemText,
    grafana_folder: service,
    contactPoint: contact,
    alertCount: 1,
    activeCount: 1,
    state: state,
    stateDuration: stateDuration,
    severity: severity,
    timestamp: triggerTime.toISOString(),
    host: hostname,
    service: service,
    source: template.tags[0] || "Infrastructure",
    tags: template.tags,
    instanceLabels: {
      alertname: problemText,
      host: hostname,
      service: service,
      severity: severity,
      source: template.tags[0] || "Infrastructure",
    },
    title: `${hostname} · ${problemText}`,
    message: `Alert: ${problemText}`,
    triggeredBy: service,
    escalation: "Level 1",
    acknowledgedBy: "Not yet...",
    alertDefinition: `Alert: ${problemText}`,
    isAlert: true,
  };
};

// ----- Context -----
const AlertContext = createContext(null);

export const AlertProvider = ({ children }) => {
  // ---- Server statuses (centralized) ----
  const [serverStatuses, setServerStatuses] = useState(() => {
    const saved = localStorage.getItem("serverStatuses");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    const initial = {};
    serverInventory.forEach(s => {
      const metrics = generateServerMetrics(s.id);
      initial[s.hostname] = {
        status: metrics.status, // up, warning, down
        metrics: metrics,
        lastUpdated: new Date().toISOString(),
      };
    });
    return initial;
  });

  const [alerts, setAlerts] = useState(() => {
    const saved = localStorage.getItem("alerts");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {}
    }
    // Generate initial alerts from current server statuses
    const initialAlerts = [];
    const hostList = Object.keys(serverStatuses);
    for (let i = 0; i < 6; i++) {
      const host = hostList[i % hostList.length];
      const status = serverStatuses[host].status;
      if (status === "warning" || status === "down") {
        const alert = generateMockAlert(host, i + 1);
        initialAlerts.push(alert);
      }
    }
    return initialAlerts;
  });

  // ---- Save to localStorage ----
  useEffect(() => {
    localStorage.setItem("alerts", JSON.stringify(alerts));
  }, [alerts]);
  useEffect(() => {
    localStorage.setItem("serverStatuses", JSON.stringify(serverStatuses));
  }, [serverStatuses]);

  // ---- Derived data ----
  const activeAlertList = alerts.filter((a) => a.state === "active");
  const activeAlertCount = activeAlertList.length;

  const prevCountRef = useRef(activeAlertCount);
  const [newAlertCount, setNewAlertCount] = useState(0);

  useEffect(() => {
    if (activeAlertCount > prevCountRef.current) {
      setNewAlertCount((n) => n + (activeAlertCount - prevCountRef.current));
    }
    prevCountRef.current = activeAlertCount;
  }, [activeAlertCount]);

  const resetNewAlertCount = () => setNewAlertCount(0);

  // ---- Auto‑generate new alerts every 8-12 seconds ----
  const alertsRef = useRef(alerts);
  const serverStatusesRef = useRef(serverStatuses);

  useEffect(() => {
    alertsRef.current = alerts;
  }, [alerts]);
  useEffect(() => {
    serverStatusesRef.current = serverStatuses;
  }, [serverStatuses]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (alertsRef.current.length < 30) {
        // Pick a random server
        const hostList = Object.keys(serverStatusesRef.current);
        const host = hostList[Math.floor(Math.random() * hostList.length)];
        const currentStatus = serverStatusesRef.current[host].status;

        // Determine new status (randomly degrade or recover)
        let newStatus = currentStatus;
        const r = Math.random();
        if (r < 0.15) {
          newStatus = "down";
        } else if (r < 0.35) {
          newStatus = "warning";
        } else if (r < 0.65 && currentStatus !== "up") {
          newStatus = "up"; // recovery
        }

        // If status changed, create alert
        if (newStatus !== currentStatus) {
          // Update server status
          setServerStatuses(prev => ({
            ...prev,
            [host]: { ...prev[host], status: newStatus, lastUpdated: new Date().toISOString() }
          }));

          // Generate alert if not healthy
          if (newStatus !== "up") {
            const newAlert = generateMockAlert(host);
            setAlerts((prev) => [...prev, newAlert]);
            // Toast notifications removed (critical & high alerts no longer shown)
          }
        }
      }
    }, 8000 + Math.random() * 4000);
    return () => clearInterval(interval);
  }, []);

  // ---- CRUD for alerts (existing) ----
  const addAlert = (alert) => {
    const newAlert = { ...alert, id: Date.now() + Math.random() * 1000, state: "active" };
    setAlerts((prev) => [...prev, newAlert]);
  };

  const resolveAlert = (id) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, state: "resolved" } : a))
    );
  };

  const deleteAlert = (id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const updateAlert = (id, updates) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
  };

  // ---- Function to update server status manually (e.g., from UI) ----
  const updateServerStatus = (hostname, status) => {
    setServerStatuses(prev => ({
      ...prev,
      [hostname]: { ...prev[hostname], status, lastUpdated: new Date().toISOString() }
    }));
    // If status is up, we might want to clear alerts for that host (optional)
  };

  // ---- Get status for a specific host ----
  const getServerStatus = (hostname) => {
    return serverStatuses[hostname]?.status || "unknown";
  };

  // ---- NEW: resolve alert and update host status ----
  const resolveAlertWithHost = (id) => {
    // Find the alert
    const alert = alerts.find(a => a.id === id);
    if (!alert) return;

    // Resolve the alert
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, state: "resolved" } : a))
    );

    // If the alert has a host, update its status to up
    if (alert.host) {
      setServerStatuses(prev => ({
        ...prev,
        [alert.host]: { 
          ...prev[alert.host], 
          status: "up",
          lastUpdated: new Date().toISOString()
        }
      }));
      toast.success(`✅ Host ${alert.host} marked as up`);
    }
  };

  return (
    <AlertContext.Provider
      value={{
        alerts,
        activeAlertList,
        activeAlertCount,
        newAlertCount,
        resetNewAlertCount,
        addAlert,
        resolveAlert,
        deleteAlert,
        updateAlert,
        setAlerts,
        serverStatuses,
        updateServerStatus,
        getServerStatus,
        resolveAlertWithHost,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

export const useAlerts = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlerts must be used within an AlertProvider");
  }
  return context;
};