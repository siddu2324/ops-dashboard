// src/pages/cloud/GCPPage.jsx
import { useState } from "react";
import { Cloud, Search, RefreshCw, Plus, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import Card from "../../components/common/Card";
import { toast } from "react-hot-toast";

export default function GCPPage() {
  const [search, setSearch] = useState("");
  const [selectedZone, setSelectedZone] = useState("all");

  // Mock GCP resources
  const gcpResources = [
    { id: 1, name: "prod-vm-01", type: "Compute Engine", zone: "us-central1-a", status: "running", cpu: "38%", memory: "55%", disk: "62%", uptime: "92d 8h", ip: "10.1.0.4" },
    { id: 2, name: "prod-vm-02", type: "Compute Engine", zone: "us-central1-a", status: "running", cpu: "28%", memory: "48%", disk: "34%", uptime: "50d 3h", ip: "10.1.0.5" },
    { id: 3, name: "prod-vm-03", type: "Compute Engine", zone: "us-east1-b", status: "stopped", cpu: "0%", memory: "0%", disk: "18%", uptime: "0d 0h", ip: "10.2.0.4" },
    { id: 4, name: "prod-sql-01", type: "Cloud SQL", zone: "us-central1-a", status: "running", cpu: "22%", memory: "52%", disk: "48%", uptime: "125d 6h", ip: "10.1.0.10" },
    { id: 5, name: "prod-redis-01", type: "Memorystore", zone: "europe-west1-b", status: "running", cpu: "8%", memory: "32%", disk: "8%", uptime: "65d 0h", ip: "10.3.0.8" },
    { id: 6, name: "prod-storage-01", type: "Cloud Storage", zone: "us-central1-a", status: "running", cpu: "0%", memory: "0%", disk: "72%", uptime: "185d 0h", ip: "10.1.0.20" },
    { id: 7, name: "prod-app-01", type: "App Engine", zone: "us-east1-b", status: "warning", cpu: "82%", memory: "79%", disk: "28%", uptime: "35d 2h", ip: "10.2.0.15" },
    { id: 8, name: "prod-db-02", type: "Cloud Spanner", zone: "europe-west1-b", status: "running", cpu: "31%", memory: "45%", disk: "38%", uptime: "95d 0h", ip: "10.3.0.12" },
    { id: 9, name: "prod-gke-01", type: "GKE Cluster", zone: "us-central1-a", status: "running", cpu: "56%", memory: "63%", disk: "41%", uptime: "78d 4h", ip: "10.1.0.30" },
  ];

  const zones = ["all", "us-central1-a", "us-east1-b", "europe-west1-b", "asia-east1-a"];

  const getStatusColor = (status) => {
    if (status === "running") return "text-[var(--color-ok)]";
    if (status === "warning") return "text-[var(--color-warn)]";
    if (status === "stopped") return "text-[var(--color-crit)]";
    return "text-[var(--color-muted)]";
  };

  const getStatusIcon = (status) => {
    if (status === "running") return <CheckCircle size={16} className="text-[var(--color-ok)]" />;
    if (status === "warning") return <AlertCircle size={16} className="text-[var(--color-warn)]" />;
    if (status === "stopped") return <XCircle size={16} className="text-[var(--color-crit)]" />;
    return null;
  };

  const filteredResources = gcpResources.filter(resource => {
    const matchesSearch = resource.name.toLowerCase().includes(search.toLowerCase()) ||
                          resource.type.toLowerCase().includes(search.toLowerCase());
    const matchesZone = selectedZone === "all" || resource.zone === selectedZone;
    return matchesSearch && matchesZone;
  });

  return (
    <div className="space-y-6">
      {/* GCP Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">Total Resources</p>
              <p className="text-2xl font-bold text-[var(--color-text)] mt-1">{gcpResources.length}</p>
            </div>
            <Cloud size={24} className="text-[var(--color-muted)]" />
          </div>
        </div>
        <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">Running</p>
              <p className="text-2xl font-bold text-[var(--color-ok)] mt-1">
                {gcpResources.filter(r => r.status === "running").length}
              </p>
            </div>
            <CheckCircle size={24} className="text-[var(--color-ok)]" />
          </div>
        </div>
        <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">Warning</p>
              <p className="text-2xl font-bold text-[var(--color-warn)] mt-1">
                {gcpResources.filter(r => r.status === "warning").length}
              </p>
            </div>
            <AlertCircle size={24} className="text-[var(--color-warn)]" />
          </div>
        </div>
        <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">Stopped</p>
              <p className="text-2xl font-bold text-[var(--color-crit)] mt-1">
                {gcpResources.filter(r => r.status === "stopped").length}
              </p>
            </div>
            <XCircle size={24} className="text-[var(--color-crit)]" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="px-3 py-1.5 text-sm rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          >
            {zones.map(zone => (
              <option key={zone} value={zone}>
                {zone === "all" ? "All Zones" : zone}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-faint)]" />
            <input
              type="text"
              placeholder="Search GCP resources..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64 pl-9 pr-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            />
          </div>
          <button 
            onClick={() => toast.success('GCP resources refreshed')}
            className="p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] text-[var(--color-muted)] hover:text-[var(--color-text)] transition"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Resources Table */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[var(--color-text)]">
              GCP Resources
              <span className="ml-2 text-xs font-normal text-[var(--color-muted)]">
                {filteredResources.length} resources
              </span>
            </h3>
            <button 
              onClick={() => toast.success('Create Resource clicked')}
              className="px-3 py-1.5 text-sm bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-80 transition flex items-center gap-1"
            >
              <Plus size={14} />
              Create Resource
            </button>
          </div>
        </div>
        <div className="p-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[var(--color-faint)] border-b border-[var(--color-border)]">
                <th className="pb-2 font-medium">Name</th>
                <th className="pb-2 font-medium">Type</th>
                <th className="pb-2 font-medium">Zone</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 font-medium">CPU</th>
                <th className="pb-2 font-medium">Memory</th>
                <th className="pb-2 font-medium">Disk</th>
                <th className="pb-2 font-medium">Uptime</th>
              </tr>
            </thead>
            <tbody>
              {filteredResources.map((resource) => (
                <tr key={resource.id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-border)]/5 transition">
                  <td className="py-2 text-[var(--color-text)] font-medium">{resource.name}</td>
                  <td className="py-2 text-[var(--color-muted)]">{resource.type}</td>
                  <td className="py-2 text-[var(--color-muted)]">{resource.zone}</td>
                  <td className="py-2">
                    <div className="flex items-center gap-1.5">
                      {getStatusIcon(resource.status)}
                      <span className={`capitalize ${getStatusColor(resource.status)}`}>
                        {resource.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-2 text-[var(--color-text)] font-mono">{resource.cpu}</td>
                  <td className="py-2 text-[var(--color-text)] font-mono">{resource.memory}</td>
                  <td className="py-2 text-[var(--color-text)] font-mono">{resource.disk}</td>
                  <td className="py-2 text-[var(--color-muted)] font-mono">{resource.uptime}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredResources.length === 0 && (
            <div className="text-center py-8 text-[var(--color-muted)]">
              <Cloud size={32} className="mx-auto mb-2 opacity-30" />
              <p>No resources found matching your filters</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}