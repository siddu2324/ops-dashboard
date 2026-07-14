import { createContext, useContext, useState, useEffect, useRef } from "react";

// Generate a single mock alert
const generateMockAlert = (id) => {
  const folders = [
    "Alert on IIS logs",
    "Database Connection Failures",
    "Disk Full",
    "Failed Login Attempts",
    "Loki Last 5min logs",
    "Loki test",
    "PHP Fatal Errors",
    "SSH Login Failures",
    "Service Restart Detection",
    "Then create the alert using a metric query 500",
  ];
  const contactPoints = ["Loki", "Zabbix monitoring", "Slack", "PagerDuty"];
  const folder = folders[Math.floor(Math.random() * folders.length)];
  return {
    id: id || Date.now(),
    alertname: "DatasourceNoData",
    grafana_folder: folder,
    contactPoint: contactPoints[Math.floor(Math.random() * contactPoints.length)],
    alertCount: 1,
    activeCount: 1,
    state: "active",
    stateDuration: `for ${Math.floor(Math.random() * 10)}d ${Math.floor(Math.random() * 24)}h`,
    instanceLabels: {
      alertname: "DatasourceNoData",
      datasource_uid: "ffpa553cd2neoe",
      grafana_folder: folder,
      ref_id: String.fromCharCode(65 + Math.floor(Math.random() * 26)),
      rulename: `${folder.replace(/\s/g, "-")}-Alert`,
    },
  };
};

// Generate initial alerts
const generateInitialAlerts = (count = 4) => {
  return Array.from({ length: count }, (_, i) => generateMockAlert(i + 1));
};

const AlertContext = createContext(null);

export const AlertProvider = ({ children }) => {
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
    return generateInitialAlerts(4);
  });

  useEffect(() => {
    localStorage.setItem("alerts", JSON.stringify(alerts));
  }, [alerts]);

  // ---- Active alerts (array and count) ----
  const activeAlertList = alerts.filter((a) => a.state === "active");
  const activeAlertCount = activeAlertList.length;

  // ---- New alert count ----
  const prevCountRef = useRef(activeAlertCount);
  const [newAlertCount, setNewAlertCount] = useState(0);

  useEffect(() => {
    if (activeAlertCount > prevCountRef.current) {
      setNewAlertCount((n) => n + (activeAlertCount - prevCountRef.current));
    }
    prevCountRef.current = activeAlertCount;
  }, [activeAlertCount]);

  const resetNewAlertCount = () => setNewAlertCount(0);

  // ---- Auto‑generate new alerts ----
  const alertsRef = useRef(alerts);
  useEffect(() => {
    alertsRef.current = alerts;
  }, [alerts]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (alertsRef.current.length < 20) {
        const newAlert = generateMockAlert(Date.now());
        setAlerts((prev) => [...prev, newAlert]);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // ---- CRUD ----
  const addAlert = (alert) => {
    setAlerts((prev) => [...prev, { ...alert, id: Date.now(), state: "active" }]);
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

  return (
    <AlertContext.Provider
      value={{
        alerts,                // all alerts (active + resolved)
        activeAlertList,       // array of active alerts
        activeAlertCount,      // number of active alerts
        newAlertCount,
        resetNewAlertCount,
        addAlert,
        resolveAlert,
        deleteAlert,
        updateAlert,
        setAlerts,
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