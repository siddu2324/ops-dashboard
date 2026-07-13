// src/components/TracesListView.jsx
import { useState } from "react";
import { Search, ChevronDown, ChevronUp } from "lucide-react";

// Generate mock trace data
const generateMockTraces = (count = 20) => {
  const services = ["zabbix-web", "api-gateway", "auth-service", "order-service", "payment-service"];
  const traceNames = [
    "/zabbix/api_jsonrpc.php",
    "/api/v1/users",
    "/api/v1/orders",
    "/api/v1/payments",
    "/graphql/query",
    "/metrics",
  ];
  const now = Date.now();
  return Array.from({ length: count }, (_, i) => {
    const timeOffset = Math.floor(Math.random() * 30 * 60 * 1000); // up to 30 min ago
    const startTime = new Date(now - timeOffset);
    return {
      id: i,
      startTime: startTime.toISOString().replace("T", " ").slice(0, 19),
      service: services[Math.floor(Math.random() * services.length)],
      traceName: traceNames[Math.floor(Math.random() * traceNames.length)],
      duration: Math.floor(100 + Math.random() * 400), // ms
    };
  }).sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
};

export default function TracesListView() {
  const [traces] = useState(generateMockTraces(20));
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("startTime");
  const [sortDirection, setSortDirection] = useState("desc");

  const filteredTraces = traces.filter((t) =>
    t.traceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.service.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedTraces = [...filteredTraces].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];
    if (sortField === "startTime") {
      aVal = new Date(a.startTime);
      bVal = new Date(b.startTime);
    }
    if (sortField === "duration") {
      aVal = Number(aVal);
      bVal = Number(bVal);
    }
    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronUp size={12} className="opacity-30" />;
    return sortDirection === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-faint)]" />
          <input
            type="text"
            placeholder="Search by service or trace name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-faint)] text-sm focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
          />
        </div>
        <span className="text-xs text-[var(--color-muted)]">
          {filteredTraces.length} traces found
        </span>
      </div>

      <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--color-panel-alt)] border-b border-[var(--color-border)]">
            <tr>
              <th
                onClick={() => toggleSort("startTime")}
                className="px-3 py-2 text-[var(--color-muted)] text-xs font-medium cursor-pointer hover:text-[var(--color-text)] transition"
              >
                <div className="flex items-center gap-1">
                  Start time
                  <SortIcon field="startTime" />
                </div>
              </th>
              <th
                onClick={() => toggleSort("service")}
                className="px-3 py-2 text-[var(--color-muted)] text-xs font-medium cursor-pointer hover:text-[var(--color-text)] transition"
              >
                <div className="flex items-center gap-1">
                  Trace Service
                  <SortIcon field="service" />
                </div>
              </th>
              <th
                onClick={() => toggleSort("traceName")}
                className="px-3 py-2 text-[var(--color-muted)] text-xs font-medium cursor-pointer hover:text-[var(--color-text)] transition"
              >
                <div className="flex items-center gap-1">
                  Trace Name
                  <SortIcon field="traceName" />
                </div>
              </th>
              <th
                onClick={() => toggleSort("duration")}
                className="px-3 py-2 text-[var(--color-muted)] text-xs font-medium cursor-pointer hover:text-[var(--color-text)] transition text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  Duration
                  <SortIcon field="duration" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedTraces.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-8 text-[var(--color-muted)]">
                  No traces match your search.
                </td>
              </tr>
            ) : (
              sortedTraces.map((trace) => (
                <tr
                  key={trace.id}
                  className="border-b border-[var(--color-border)] hover:bg-[var(--color-panel-alt)] transition-colors cursor-pointer"
                >
                  <td className="px-3 py-2 text-[var(--color-text)] font-mono text-xs">
                    {trace.startTime}
                  </td>
                  <td className="px-3 py-2 text-[var(--color-text)]">{trace.service}</td>
                  <td className="px-3 py-2 text-[var(--color-text)] font-mono text-xs">
                    {trace.traceName}
                  </td>
                  <td className="px-3 py-2 text-[var(--color-text)] font-mono text-xs text-right">
                    {trace.duration} ms
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}