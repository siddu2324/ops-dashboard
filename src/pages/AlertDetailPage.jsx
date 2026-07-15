// src/pages/AlertDetailPage.jsx
import { useState, useEffect } from "react";
import { useAlerts } from "../context/AlertContext";
import { toast } from "react-hot-toast";
import Card from "../components/common/Card";

export default function AlertDetailPage({ go }) {
  const { alerts, resolveAlertWithHost } = useAlerts(); // 👈 get resolveAlertWithHost
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [returnPage, setReturnPage] = useState("Active notifications");

  useEffect(() => {
    const directData = localStorage.getItem("selectedAlertData");
    const returnTo = localStorage.getItem("returnTo") || "Active notifications";
    setReturnPage(returnTo);

    if (directData) {
      // If we have direct data (from modal), it may not have an id
      const parsed = JSON.parse(directData);
      setAlert({
        ...parsed,
        id: parsed.id || Date.now(), // fallback id
      });
      localStorage.removeItem("selectedAlertData");
      localStorage.removeItem("returnTo");
      setLoading(false);
      return;
    }

    const id = localStorage.getItem("selectedAlertId");
    if (id) {
      const found = alerts.find(a => String(a.id) === String(id));
      if (found) {
        // Store the full alert (with id) so we can resolve it later
        setAlert({
          id: found.id,
          title: found.grafana_folder || found.alertname,
          status: found.state || "Triggered",
          severity: found.severity || "Critical",
          activeTime: found.stateDuration || "N/A",
          message: found.alertname || "Alert message",
          triggerTime: found.timestamp || "N/A",
          triggeredBy: found.alertname || "Unknown",
          escalation: "Level 1",
          acknowledgedBy: "Not yet...",
          alertDefinition: found.alertname || "Alert",
          isAlert: true,
          host: found.host, // might be needed for resolve
        });
      } else {
        toast.error("Alert not found");
      }
    } else {
      toast.error("No alert selected");
    }
    setLoading(false);
  }, [alerts]);

  const goBack = () => {
    localStorage.removeItem("selectedAlertId");
    if (go) {
      go(returnPage);
    }
  };

  const handleAcknowledge = () => {
    toast.success("Alert acknowledged");
  };

  // ---- New: Resolve alert and update host status ----
  const handleResolve = () => {
    if (window.confirm("Resolve this alert and mark the host as healthy?")) {
      if (alert.id) {
        resolveAlertWithHost(alert.id);
        toast.success("Alert resolved and host marked as healthy");
        // Optionally navigate back after resolving
        setTimeout(() => goBack(), 1000);
      } else {
        toast.error("Unable to resolve: alert ID missing");
      }
    }
  };

  if (loading) return <div className="text-center py-10 text-[var(--color-muted)]">Loading...</div>;
  if (!alert) return <div className="text-center py-10 text-[var(--color-muted)]">Alert not found</div>;

  const isAlert = alert.isAlert !== undefined ? alert.isAlert : true;

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 pb-2 border-b border-[var(--color-border)]">
        <button
          onClick={goBack}
          className="text-sm text-[var(--color-accent)] hover:underline flex items-center gap-1"
        >
          ← Back
        </button>
        <span className="text-sm text-[var(--color-muted)]">|</span>
        <span className="text-sm text-[var(--color-text)] font-medium">
          {isAlert ? "Active Alert Details" : "Application Status"} – {alert.title || "Application"}
        </span>
      </div>

      <h2 className="text-xl font-bold text-[var(--color-text)] flex items-center gap-2">
        <span className={isAlert ? "text-[var(--color-crit)]" : "text-[var(--color-ok)]"}>
          {isAlert ? "🔴" : "✅"}
        </span>
        {alert.message || alert.title} – {alert.triggeredBy || "Microsoft IIS"}
      </h2>

      {/* Management actions (only for alerts) */}
      {isAlert && (
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleAcknowledge}
            className="px-4 py-2 bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90 transition"
          >
            Acknowledge Alert
          </button>
          {/* 👇 NEW: Resolve Alert button */}
          <button
            onClick={handleResolve}
            className="px-4 py-2 bg-[var(--color-ok)] text-[#06222A] font-semibold rounded-lg hover:opacity-90 transition"
          >
            Resolve Alert
          </button>
          <button className="px-4 py-2 border border-[var(--color-border)] text-[var(--color-text)] rounded-lg hover:bg-[var(--color-panel-alt)] transition">
            Edit Alert Definition
          </button>
          <button className="px-4 py-2 border border-[var(--color-border)] text-[var(--color-text)] rounded-lg hover:bg-[var(--color-panel-alt)] transition">
            Turn Off this alert definition
          </button>
        </div>
      )}

      <Card title="Status Overview">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-[var(--color-muted)] text-xs uppercase tracking-wider">Current Status</div>
            <div className={`text-lg font-bold ${isAlert ? "text-[var(--color-crit)]" : "text-[var(--color-ok)]"}`}>
              {isAlert ? "Triggered" : "Healthy"}
            </div>
          </div>
          <div>
            <div className="text-[var(--color-muted)] text-xs uppercase tracking-wider">Active Time</div>
            <div className="text-lg font-bold text-[var(--color-text)]">{alert.activeTime || "N/A"}</div>
          </div>
          <div>
            <div className="text-[var(--color-muted)] text-xs uppercase tracking-wider">Severity</div>
            <div className={`text-lg font-bold ${alert.severity === "Critical" ? "text-[var(--color-crit)]" : alert.severity === "Warning" ? "text-[var(--color-warn)]" : alert.severity === "High" ? "text-[var(--color-crit)]" : "text-[var(--color-ok)]"}`}>
              {alert.severity || "Information"}
            </div>
          </div>
        </div>
      </Card>

      <Card title="Message">
        <p className="text-[var(--color-text)]">{alert.message || "Alert message"}</p>
      </Card>

      <Card title="More Details">
        <div className="space-y-1 text-sm">
          <div className="flex flex-wrap gap-2">
            <span className="text-[var(--color-muted)] w-36">Trigger time:</span>
            <span className="text-[var(--color-text)]">{alert.triggerTime || "N/A"}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-[var(--color-muted)] w-36">Triggered by:</span>
            <span className="text-[var(--color-text)]">{alert.triggeredBy || "Unknown"}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-[var(--color-muted)] w-36">Alert Definition:</span>
            <span className="text-[var(--color-text)]">{alert.alertDefinition || "Alert"}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-[var(--color-muted)] w-36">Escalation:</span>
            <span className="text-[var(--color-text)]">{alert.escalation || "Level 1"}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-[var(--color-muted)] w-36">Acknowledged by:</span>
            <span className="text-[var(--color-text)]">{alert.acknowledgedBy || "Not yet..."}</span>
          </div>
          {isAlert && (
            <div className="flex flex-wrap gap-2">
              <span className="text-[var(--color-muted)] w-36">Acknowledge:</span>
              <button
                onClick={handleAcknowledge}
                className="text-[var(--color-accent)] hover:underline"
              >
                Acknowledge
              </button>
            </div>
          )}
        </div>
      </Card>

      <Card title="Definition Details">
        <div className="text-sm text-[var(--color-text)]">
          <p>HELP – Contact administrator for details.</p>
        </div>
      </Card>
    </div>
  );
}