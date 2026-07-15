// hooks/useAlertPolling.js
import { useState, useEffect, useRef } from "react";
import { alerts as initialAlerts } from "../data/alerts"; // your mock data

export function useAlertPolling(interval = 5000) {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [newAlertCount, setNewAlertCount] = useState(0);
  const previousCountRef = useRef(alerts.length);

  // Function to manually refresh alerts
  const refreshAlerts = () => {
    // Simulate fetching new alerts – in reality, call an API
    // For demo, we'll randomly add a new alert sometimes, or just keep same data
    // We'll randomly alter the list to simulate new alerts
    const shouldUpdate = Math.random() < 0.3; // 30% chance of a new alert
    if (shouldUpdate) {
      const newAlert = {
        name: `New alert ${Date.now().toString().slice(-4)}`,
        sev: ["crit", "warn", "ok"][Math.floor(Math.random() * 3)],
        src: `host-${Math.floor(Math.random() * 10)}`,
        age: "0s",
      };
      setAlerts((prev) => [newAlert, ...prev.slice(0, 9)]); // keep max 10
      setNewAlertCount((c) => c + 1);
    } else {
      // Optionally shuffle ages to simulate time passing
      setAlerts((prev) =>
        prev.map((a) => ({
          ...a,
          age: a.age.includes("s") ? `${parseInt(a.age) + 5}s` : a.age,
        }))
      );
    }
  };

  useEffect(() => {
    // --- DISABLED: Auto-polling removed to stop frequent alerts ---
    // Only set initial data on mount
    setAlerts(initialAlerts);
    setNewAlertCount(0);
    // No interval set

    // Optional: if you want to keep the interval but reduce frequency,
    // uncomment and change the interval value (e.g., 300000 = 5 minutes)
    // const timer = setInterval(refreshAlerts, 300000); // 5 minutes
    // return () => clearInterval(timer);
  }, []);

  const resetNewAlertCount = () => setNewAlertCount(0);

  return { alerts, newAlertCount, resetNewAlertCount, refreshAlerts };
}