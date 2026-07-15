import { useState } from "react";
import { Search, ChevronDown, ChevronRight, Bell } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAlerts } from "../context/AlertContext";

export default function ActiveNotificationsPage({ go }) {
  const { activeAlertList } = useAlerts();
  const [searchTerm, setSearchTerm] = useState("");
  const [contactPoint, setContactPoint] = useState("all");
  const [stateFilter, setStateFilter] = useState("active");
  const [expandedId, setExpandedId] = useState(null);

  // Get unique contact points
  const contactPoints = ["all", ...new Set(activeAlertList.map((n) => n.contactPoint))];

  const filtered = activeAlertList.filter((n) => {
    const matchesSearch =
      n.alertname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.grafana_folder.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesContact = contactPoint === "all" || n.contactPoint === contactPoint;
    return matchesSearch && matchesContact;
  });

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const openAlertDetail = (id) => {
    localStorage.setItem("selectedAlertId", String(id));
    go("Alert Detail");
  };

  const statusColor = {
    Critical: "bg-[var(--color-crit)] text-white",
    High: "bg-[var(--color-crit)]/80 text-white",
    Medium: "bg-[var(--color-warn)] text-[#06222A]",
    Low: "bg-[var(--color-ok)] text-[#06222A]",
    Information: "bg-[var(--color-accent)] text-[#06222A]",
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Active notifications</h1>
        <p className="text-sm text-[var(--color-muted)]">See grouped alerts with active notifications</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-faint)]" />
          <input
            type="text"
            placeholder="Search by label"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-faint)] text-sm focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--color-muted)]">Group by</span>
          <select className="px-2 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] text-sm">
            <option>alertname, grafana_folder</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--color-muted)]">Filter by contact point</span>
          <select
            value={contactPoint}
            onChange={(e) => setContactPoint(e.target.value)}
            className="px-2 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] text-sm"
          >
            {contactPoints.map((cp) => (
              <option key={cp} value={cp}>{cp === "all" ? "All" : cp}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setStateFilter("active")}
          className={`px-3 py-1 text-sm rounded-full border transition ${
            stateFilter === "active"
              ? "bg-[var(--color-accent)] text-[#06222A] border-[var(--color-accent)]"
              : "bg-transparent text-[var(--color-muted)] border-[var(--color-border)] hover:border-[var(--color-text)]"
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setStateFilter("suppressed")}
          className={`px-3 py-1 text-sm rounded-full border transition ${
            stateFilter === "suppressed"
              ? "bg-[var(--color-accent)] text-[#06222A] border-[var(--color-accent)]"
              : "bg-transparent text-[var(--color-muted)] border-[var(--color-border)] hover:border-[var(--color-text)]"
          }`}
        >
          Suppressed
        </button>
        <button
          onClick={() => setStateFilter("unprocessed")}
          className={`px-3 py-1 text-sm rounded-full border transition ${
            stateFilter === "unprocessed"
              ? "bg-[var(--color-accent)] text-[#06222A] border-[var(--color-accent)]"
              : "bg-transparent text-[var(--color-muted)] border-[var(--color-border)] hover:border-[var(--color-text)]"
          }`}
        >
          Unprocessed
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-[var(--color-border)] rounded-lg bg-[var(--color-panel)]">
          <Bell size={24} className="text-[var(--color-faint)] mb-4" />
          <h3 className="text-[var(--color-text)] font-medium text-lg">No results</h3>
          <p className="text-[var(--color-muted)] text-sm max-w-sm mt-1">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((notif) => (
            <div
              key={notif.id}
              className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg overflow-hidden hover:border-[var(--color-accent)] transition"
            >
              <div className="p-4 cursor-pointer hover:bg-[var(--color-panel-alt)] transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1" onClick={() => toggleExpand(notif.id)}>
                    <div className="text-sm text-[var(--color-text)] font-medium">
                      <span className="text-[var(--color-muted)]">alertname</span> {notif.alertname}
                    </div>
                    <div className="text-sm text-[var(--color-text)]">
                      <span className="text-[var(--color-muted)]">grafana_folder</span> {notif.grafana_folder}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-[var(--color-muted)] mt-1">
                      <span>Severity:</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${statusColor[notif.severity] || statusColor.Low}`}>
                        {notif.severity}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-[var(--color-muted)] mt-1">
                      <span>Delivered to</span>
                      <span className="text-[var(--color-text)] font-medium">{notif.contactPoint}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); openAlertDetail(notif.id); }}
                      className="text-xs text-[var(--color-accent)] hover:underline"
                    >
                      Details
                    </button>
                    <div onClick={() => toggleExpand(notif.id)}>
                      {expandedId === notif.id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </div>
                  </div>
                </div>
              </div>
              {expandedId === notif.id && (
                <div className="px-4 pb-4 border-t border-[var(--color-border)] pt-3 space-y-3 bg-[var(--color-panel-alt)]/20">
                  <div>
                    <div className="text-xs font-medium text-[var(--color-muted)] uppercase tracking-wider">Notification state</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-[var(--color-text)]">{notif.state}</span>
                      <span className="text-xs text-[var(--color-faint)]">{notif.stateDuration}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-[var(--color-muted)] uppercase tracking-wider">Instance labels</div>
                    <div className="space-y-1 mt-1">
                      {Object.entries(notif.instanceLabels).map(([key, value]) => (
                        <div key={key} className="text-xs flex items-start gap-2">
                          <span className="text-[var(--color-muted)]">{key}</span>
                          <span className="text-[var(--color-text)] font-mono break-all">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}