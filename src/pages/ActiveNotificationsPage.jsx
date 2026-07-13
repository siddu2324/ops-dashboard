import { useState } from "react";
import { Search, ChevronDown, ChevronRight, Bell, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { toast } from "react-hot-toast";

// Mock data with expanded details
const mockNotifications = [
  {
    id: 1,
    alertname: "DatasourceNoData",
    grafana_folder: "Alert on IIS logs",
    contactPoint: "Loki",
    alertCount: 1,
    activeCount: 1,
    state: "Active",
    stateDuration: "for 2d 13h 49m",
    instanceLabels: {
      alertname: "DatasourceNoData",
      datasource_uid: "ffpa553cd2neoe",
      grafana_folder: "Alert on IIS logs",
      ref_id: "A",
      rulename: "Loki-alert on IIS logs 404",
    },
  },
  {
    id: 2,
    alertname: "DatasourceNoData",
    grafana_folder: "Database Connection Failures",
    contactPoint: "Loki",
    alertCount: 1,
    activeCount: 1,
    state: "Active",
    stateDuration: "for 10d 3h 46m",
    instanceLabels: {
      alertname: "DatasourceNoData",
      datasource_uid: "ffpa553cd2neoe",
      grafana_folder: "Database Connection Failures",
      ref_id: "A",
      rulename: "Loki-Database Connection Failures",
    },
  },
  {
    id: 3,
    alertname: "DatasourceNodata",
    grafana_folder: "Disk Full",
    contactPoint: "Loki",
    alertCount: 1,
    activeCount: 1,
    state: "Active",
    stateDuration: "for 5h 12m",
    instanceLabels: {
      alertname: "DatasourceNodata",
      datasource_uid: "ffpa553cd2neoe",
      grafana_folder: "Disk Full",
      ref_id: "B",
      rulename: "Disk-Usage-Alert",
    },
  },
  {
    id: 4,
    alertname: "DatasourceNoData",
    grafana_folder: "Failed Login Attempts",
    contactPoint: "Loki",
    alertCount: 1,
    activeCount: 1,
    state: "Active",
    stateDuration: "for 1h 30m",
    instanceLabels: {
      alertname: "DatasourceNoData",
      datasource_uid: "ffpa553cd2neoe",
      grafana_folder: "Failed Login Attempts",
      ref_id: "C",
      rulename: "Login-Failures-Alert",
    },
  },
  {
    id: 5,
    alertname: "DatasourceNodata",
    grafana_folder: "Loki Last 5min logs",
    contactPoint: "Loki",
    alertCount: 1,
    activeCount: 1,
    state: "Active",
    stateDuration: "for 20m",
    instanceLabels: {
      alertname: "DatasourceNodata",
      datasource_uid: "ffpa553cd2neoe",
      grafana_folder: "Loki Last 5min logs",
      ref_id: "D",
      rulename: "Loki-Last5min-Alert",
    },
  },
  {
    id: 6,
    alertname: "DatasourceNoData",
    grafana_folder: "Loki test",
    contactPoint: "Zabbix monitoring",
    alertCount: 1,
    activeCount: 1,
    state: "Active",
    stateDuration: "for 3d 5h",
    instanceLabels: {
      alertname: "DatasourceNoData",
      datasource_uid: "ffpa553cd2neoe",
      grafana_folder: "Loki test",
      ref_id: "E",
      rulename: "Loki-Test-Alert",
    },
  },
  {
    id: 7,
    alertname: "DatasourceNoData",
    grafana_folder: "PHP Fatal Errors",
    contactPoint: "Loki",
    alertCount: 1,
    activeCount: 1,
    state: "Active",
    stateDuration: "for 8h 22m",
    instanceLabels: {
      alertname: "DatasourceNoData",
      datasource_uid: "ffpa553cd2neoe",
      grafana_folder: "PHP Fatal Errors",
      ref_id: "F",
      rulename: "PHP-Fatal-Alert",
    },
  },
  {
    id: 8,
    alertname: "DatasourceNoData",
    grafana_folder: "SSH Login Failures",
    contactPoint: "Loki",
    alertCount: 1,
    activeCount: 1,
    state: "Active",
    stateDuration: "for 1d 4h",
    instanceLabels: {
      alertname: "DatasourceNoData",
      datasource_uid: "ffpa553cd2neoe",
      grafana_folder: "SSH Login Failures",
      ref_id: "G",
      rulename: "SSH-Login-Failures-Alert",
    },
  },
  {
    id: 9,
    alertname: "DatasourceNodata",
    grafana_folder: "Service Restart Detection",
    contactPoint: "Loki",
    alertCount: 1,
    activeCount: 1,
    state: "Active",
    stateDuration: "for 12h 15m",
    instanceLabels: {
      alertname: "DatasourceNodata",
      datasource_uid: "ffpa553cd2neoe",
      grafana_folder: "Service Restart Detection",
      ref_id: "H",
      rulename: "Service-Restart-Alert",
    },
  },
  {
    id: 10,
    alertname: "DatasourceNoData",
    grafana_folder: "Then create the alert using a metric query 500",
    contactPoint: "Loki",
    alertCount: 1,
    activeCount: 1,
    state: "Active",
    stateDuration: "for 45m",
    instanceLabels: {
      alertname: "DatasourceNoData",
      datasource_uid: "ffpa553cd2neoe",
      grafana_folder: "Then create the alert using a metric query 500",
      ref_id: "I",
      rulename: "Metric-Query-Alert",
    },
  },
];

export default function ActiveNotificationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [groupBy, setGroupBy] = useState("alertname,grafana_folder");
  const [contactPoint, setContactPoint] = useState("all");
  const [stateFilter, setStateFilter] = useState("active");
  const [expandedId, setExpandedId] = useState(null); // track which card is expanded

  const contactPoints = ["all", ...new Set(mockNotifications.map((n) => n.contactPoint))];

  const filteredNotifications = mockNotifications.filter((n) => {
    const matchesSearch =
      n.alertname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.grafana_folder.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesContact = contactPoint === "all" || n.contactPoint === contactPoint;
    return matchesSearch && matchesContact;
  });

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Active notifications</h1>
        <p className="text-sm text-[var(--color-muted)]">See grouped alerts with active notifications</p>
      </div>

      {/* Search and controls */}
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
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[var(--color-muted)] bg-[var(--color-panel-alt)] px-1.5 py-0.5 rounded border border-[var(--color-border)]">
            ctrl+k
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--color-muted)]">Group by</span>
          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value)}
            className="px-2 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] text-sm focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
          >
            <option value="alertname,grafana_folder">alertname, grafana_folder</option>
            <option value="alertname">alertname</option>
            <option value="grafana_folder">grafana_folder</option>
            <option value="contactPoint">contactPoint</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--color-muted)]">Filter by contact point</span>
          <select
            value={contactPoint}
            onChange={(e) => setContactPoint(e.target.value)}
            className="px-2 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] text-sm focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
          >
            {contactPoints.map((cp) => (
              <option key={cp} value={cp}>
                {cp === "all" ? "All" : cp}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* State filter buttons */}
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

      {/* Notification list */}
      {filteredNotifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-[var(--color-border)] rounded-lg bg-[var(--color-panel)]">
          <Bell size={24} className="text-[var(--color-faint)] mb-4" />
          <h3 className="text-[var(--color-text)] font-medium text-lg">No results</h3>
          <p className="text-[var(--color-muted)] text-sm max-w-sm mt-1">
            Try adjusting your search or filters to find what you're looking for.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotifications.map((notif) => {
            const isExpanded = expandedId === notif.id;
            return (
              <div
                key={notif.id}
                className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg overflow-hidden hover:border-[var(--color-accent)] transition"
              >
                {/* Card header (clickable to expand) */}
                <div
                  onClick={() => toggleExpand(notif.id)}
                  className="p-4 cursor-pointer hover:bg-[var(--color-panel-alt)] transition"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="text-sm text-[var(--color-text)] font-medium">
                          <span className="text-[var(--color-muted)]">alertname</span> {notif.alertname}
                        </div>
                        <div className="text-sm text-[var(--color-text)]">
                          <span className="text-[var(--color-muted)]">grafana_folder</span> {notif.grafana_folder}
                        </div>
                      </div>
                      <div className="text-xs text-[var(--color-faint)] bg-[var(--color-panel-alt)] px-2 py-1 rounded border border-[var(--color-border)] whitespace-nowrap">
                        {notif.alertCount} alert: {notif.activeCount} active
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-[var(--color-muted)]">
                        <span>Delivered to</span>
                        <span className="text-[var(--color-text)] font-medium">{notif.contactPoint}</span>
                      </div>
                      <div className="text-[var(--color-muted)]">
                        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-[var(--color-border)] pt-3 space-y-3 bg-[var(--color-panel-alt)]/20">
                    {/* Notification state */}
                    <div>
                      <div className="text-xs font-medium text-[var(--color-muted)] uppercase tracking-wider">Notification state</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-[var(--color-text)]">{notif.state}</span>
                        <span className="text-xs text-[var(--color-faint)]">{notif.stateDuration}</span>
                      </div>
                    </div>

                    {/* Instance labels */}
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
            );
          })}
        </div>
      )}
    </div>
  );
}