// pages/KubernetesPage.jsx
import { useState, useEffect, useMemo } from "react";
import { 
  Search, RefreshCw, Plus, AlertCircle, CheckCircle, 
  XCircle, Server, HardDrive, Cpu, Activity, 
  Layers, Box, Network, Clock, Zap, TrendingUp,
  ChevronDown, ChevronRight, Filter
} from "lucide-react";
import { toast } from "react-hot-toast";
import Card from "../components/common/Card";
import StatusDot from "../components/common/StatusDot";
import LoadingSpinner from "../components/common/LoadingSpinner";

// Mock data generator
const generateClusterData = () => ({
  name: "production-cluster",
  version: "v1.28.4",
  status: ["healthy", "degraded", "unhealthy"][Math.floor(Math.random() * 3)],
  nodes: {
    total: 12,
    ready: 0,
    notReady: 0,
    details: Array.from({ length: 12 }, (_, i) => ({
      id: `node-${String(i + 1).padStart(2, '0')}`,
      name: `worker-${String(i + 1).padStart(2, '0')}`,
      status: ["Ready", "NotReady"][Math.floor(Math.random() * 4) === 0 ? 1 : 0],
      cpu: {
        total: 16,
        used: Math.round(4 + Math.random() * 10),
      },
      memory: {
        total: 64,
        used: Math.round(20 + Math.random() * 35),
      },
      disk: {
        total: 500,
        used: Math.round(100 + Math.random() * 300),
      },
      pods: Math.round(5 + Math.random() * 25),
      role: ["control-plane", "worker"][i < 3 ? 0 : 1],
      uptime: `${Math.round(2 + Math.random() * 30)}d ${Math.round(Math.random() * 23)}h`,
      conditions: [
        { type: "Ready", status: "True" },
        { type: "MemoryPressure", status: "False" },
        { type: "DiskPressure", status: "False" },
        { type: "PIDPressure", status: "False" },
      ],
    })),
  },
  namespaces: {
    total: 24,
    active: 0,
    details: [
      { name: "default", status: "Active", pods: 8, age: "180d" },
      { name: "kube-system", status: "Active", pods: 45, age: "180d" },
      { name: "monitoring", status: "Active", pods: 23, age: "120d" },
      { name: "production", status: "Active", pods: 67, age: "90d" },
      { name: "staging", status: "Active", pods: 34, age: "45d" },
      { name: "development", status: "Active", pods: 56, age: "30d" },
      { name: "test", status: "Active", pods: 12, age: "15d" },
      { name: "logging", status: "Active", pods: 18, age: "60d" },
    ],
  },
  pods: {
    total: 312,
    running: 0,
    pending: 0,
    failed: 0,
    details: Array.from({ length: 20 }, (_, i) => ({
      name: `pod-${String(i + 1).padStart(3, '0')}`,
      namespace: ["default", "production", "staging", "monitoring", "kube-system"][Math.floor(Math.random() * 5)],
      status: ["Running", "Pending", "Failed", "Succeeded"][Math.floor(Math.random() * 4)],
      node: `worker-${String(Math.floor(Math.random() * 10) + 1).padStart(2, '0')}`,
      restarts: Math.floor(Math.random() * 10),
      age: `${Math.floor(Math.random() * 30)}d`,
      cpu: Math.round(10 + Math.random() * 80),
      memory: Math.round(20 + Math.random() * 70),
    })),
  },
  services: {
    total: 45,
    details: [
      { name: "api-gateway", type: "LoadBalancer", clusterIP: "10.96.0.1", ports: "80,443", age: "90d" },
      { name: "user-service", type: "ClusterIP", clusterIP: "10.96.0.2", ports: "8080", age: "60d" },
      { name: "payment-service", type: "ClusterIP", clusterIP: "10.96.0.3", ports: "8080", age: "45d" },
      { name: "redis-cache", type: "ClusterIP", clusterIP: "10.96.0.4", ports: "6379", age: "180d" },
      { name: "postgres-db", type: "ClusterIP", clusterIP: "10.96.0.5", ports: "5432", age: "180d" },
    ],
  },
  deployments: {
    total: 28,
    details: [
      { name: "api-gateway", replicas: 3, ready: 3, strategy: "RollingUpdate", age: "90d" },
      { name: "user-service", replicas: 5, ready: 5, strategy: "RollingUpdate", age: "60d" },
      { name: "payment-service", replicas: 3, ready: 2, strategy: "RollingUpdate", age: "45d" },
      { name: "notification-service", replicas: 2, ready: 2, strategy: "RollingUpdate", age: "30d" },
      { name: "analytics-worker", replicas: 4, ready: 4, strategy: "Recreate", age: "20d" },
    ],
  },
  events: Array.from({ length: 10 }, (_, i) => ({
    type: ["Normal", "Warning", "Error"][Math.floor(Math.random() * 3)],
    reason: ["Started", "Killing", "Failed", "Scheduled", "Pulled"][Math.floor(Math.random() * 5)],
    object: `pod-${String(Math.floor(Math.random() * 100) + 1).padStart(3, '0')}`,
    namespace: ["default", "production", "staging"][Math.floor(Math.random() * 3)],
    message: "Event message placeholder",
    age: `${Math.floor(Math.random() * 60)}m`,
  })),
});

export default function KubernetesPage() {
  const [clusterData, setClusterData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [view, setView] = useState("overview"); // overview, nodes, pods, services, deployments, namespaces
  const [selectedNode, setSelectedNode] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    nodes: true,
    pods: true,
    services: true,
    deployments: true,
    events: true,
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(false), 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = (showToast = true) => {
    setIsRefreshing(true);
    setLoading(true);
    setTimeout(() => {
      const data = generateClusterData();
      // Calculate derived stats
      data.nodes.ready = data.nodes.details.filter(n => n.status === "Ready").length;
      data.nodes.notReady = data.nodes.total - data.nodes.ready;
      data.pods.running = data.pods.details.filter(p => p.status === "Running").length;
      data.pods.pending = data.pods.details.filter(p => p.status === "Pending").length;
      data.pods.failed = data.pods.details.filter(p => p.status === "Failed").length;
      data.namespaces.active = data.namespaces.details.filter(n => n.status === "Active").length;
      
      setClusterData(data);
      setFilteredData(data);
      setLoading(false);
      setIsRefreshing(false);
      if (showToast) toast.success("Cluster data updated");
    }, 800);
  };

  useEffect(() => {
    if (!clusterData) return;
    let result = { ...clusterData };
    
    if (search.trim()) {
      const term = search.toLowerCase();
      // Filter nodes
      result.nodes.details = clusterData.nodes.details.filter(n => 
        n.name.toLowerCase().includes(term)
      );
      // Filter pods
      result.pods.details = clusterData.pods.details.filter(p => 
        p.name.toLowerCase().includes(term) || 
        p.namespace.toLowerCase().includes(term)
      );
      result.namespaces.details = clusterData.namespaces.details.filter(n => 
        n.name.toLowerCase().includes(term)
      );
      result.services.details = clusterData.services.details.filter(s => 
        s.name.toLowerCase().includes(term)
      );
      result.deployments.details = clusterData.deployments.details.filter(d => 
        d.name.toLowerCase().includes(term)
      );
      setFilteredData(result);
    } else {
      setFilteredData(clusterData);
    }
  }, [search, clusterData]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getStatusColor = (status) => {
    if (status === "Ready" || status === "Active" || status === "Running" || status === "healthy") 
      return "var(--color-ok)";
    if (status === "Warning" || status === "Pending" || status === "degraded") 
      return "var(--color-warn)";
    if (status === "Error" || status === "Failed" || status === "NotReady" || status === "unhealthy") 
      return "var(--color-crit)";
    return "var(--color-muted)";
  };

  const getStatusIcon = (status) => {
    const color = getStatusColor(status);
    if (status === "Ready" || status === "Active" || status === "Running" || status === "healthy") 
      return <CheckCircle size={16} style={{ color }} />;
    if (status === "Warning" || status === "Pending" || status === "degraded") 
      return <AlertCircle size={16} style={{ color }} />;
    if (status === "Error" || status === "Failed" || status === "NotReady" || status === "unhealthy") 
      return <XCircle size={16} style={{ color }} />;
    return null;
  };

  if (loading && !clusterData) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size={48} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Kubernetes</h1>
          <p className="text-[var(--color-muted)] text-sm mt-1">
            Cluster: {clusterData?.name} • Version: {clusterData?.version}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <StatusDot state={clusterData?.status} size="md" />
          <span className="text-sm text-[var(--color-text)] capitalize">
            {clusterData?.status}
          </span>
          <button
            onClick={() => fetchData(true)}
            disabled={isRefreshing}
            className="p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] text-[var(--color-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-text)] transition disabled:opacity-50"
          >
            <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
          </button>
          <button className="px-4 py-2 bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-80 transition flex items-center gap-2">
            <Plus size={16} />
            Add Cluster
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">Nodes</p>
              <p className="text-2xl font-bold text-[var(--color-text)] mt-1">
                {clusterData?.nodes.total}
              </p>
            </div>
            <Server size={24} className="text-[var(--color-muted)]" />
          </div>
          <div className="mt-2 flex gap-2 text-xs">
            <span className="text-[var(--color-ok)]">Ready: {clusterData?.nodes.ready}</span>
            {clusterData?.nodes.notReady > 0 && (
              <span className="text-[var(--color-crit)]">NotReady: {clusterData?.nodes.notReady}</span>
            )}
          </div>
        </div>

        <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">Pods</p>
              <p className="text-2xl font-bold text-[var(--color-text)] mt-1">
                {clusterData?.pods.total}
              </p>
            </div>
            <Box size={24} className="text-[var(--color-muted)]" />
          </div>
          <div className="mt-2 flex gap-2 text-xs">
            <span className="text-[var(--color-ok)]">Running: {clusterData?.pods.running}</span>
            {clusterData?.pods.pending > 0 && (
              <span className="text-[var(--color-warn)]">Pending: {clusterData?.pods.pending}</span>
            )}
            {clusterData?.pods.failed > 0 && (
              <span className="text-[var(--color-crit)]">Failed: {clusterData?.pods.failed}</span>
            )}
          </div>
        </div>

        <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">Namespaces</p>
              <p className="text-2xl font-bold text-[var(--color-text)] mt-1">
                {clusterData?.namespaces.total}
              </p>
            </div>
            <Layers size={24} className="text-[var(--color-muted)]" />
          </div>
          <div className="mt-2 flex gap-2 text-xs">
            <span className="text-[var(--color-ok)]">Active: {clusterData?.namespaces.active}</span>
          </div>
        </div>

        <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">Services</p>
              <p className="text-2xl font-bold text-[var(--color-text)] mt-1">
                {clusterData?.services.total}
              </p>
            </div>
            <Network size={24} className="text-[var(--color-muted)]" />
          </div>
        </div>

        <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">Deployments</p>
              <p className="text-2xl font-bold text-[var(--color-text)] mt-1">
                {clusterData?.deployments.total}
              </p>
            </div>
            <TrendingUp size={24} className="text-[var(--color-muted)]" />
          </div>
        </div>

        <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">Events</p>
              <p className="text-2xl font-bold text-[var(--color-text)] mt-1">
                {clusterData?.events.length}
              </p>
            </div>
            <Zap size={24} className="text-[var(--color-muted)]" />
          </div>
          <div className="mt-2 flex gap-2 text-xs">
            <span className="text-[var(--color-warn)]">
              Recent: {clusterData?.events.filter(e => e.type === "Warning").length} warnings
            </span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-faint)]" />
          <input
            type="text"
            placeholder="Search nodes, pods, services, deployments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition"
          />
        </div>
        <div className="flex items-center gap-2">
          {["overview", "nodes", "pods", "services", "deployments"].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1.5 text-sm rounded-lg transition ${
                view === v
                  ? "bg-[var(--color-accent)] text-[#06222A] font-medium"
                  : "bg-transparent text-[var(--color-muted)] border border-[var(--color-border)] hover:border-[var(--color-text)]"
              }`}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-4">
        {/* Nodes Section */}
        {(view === "overview" || view === "nodes") && (
          <Card className="overflow-hidden">
            <div 
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-[var(--color-border)]/10 transition"
              onClick={() => toggleSection('nodes')}
            >
              <div className="flex items-center gap-3">
                {expandedSections.nodes ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                <Server size={20} className="text-[var(--color-muted)]" />
                <h3 className="font-semibold text-[var(--color-text)]">Nodes</h3>
                <span className="text-xs text-[var(--color-muted)]">
                  {filteredData?.nodes.details.length} of {clusterData?.nodes.total}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-[var(--color-ok)]">{filteredData?.nodes.ready} Ready</span>
                <span className="text-[var(--color-crit)]">{filteredData?.nodes.notReady} NotReady</span>
              </div>
            </div>
            {expandedSections.nodes && (
              <div className="p-4 border-t border-[var(--color-border)]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredData?.nodes.details.map((node) => (
                    <div 
                      key={node.id}
                      className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg p-4 hover:border-[var(--color-accent)] transition cursor-pointer"
                      onClick={() => setSelectedNode(node)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(node.status)}
                            <span className="font-medium text-[var(--color-text)]">{node.name}</span>
                          </div>
                          <div className="text-xs text-[var(--color-muted)] mt-1">
                            Role: {node.role} • Uptime: {node.uptime}
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full border`}
                          style={{ 
                            color: getStatusColor(node.status),
                            borderColor: getStatusColor(node.status)
                          }}
                        >
                          {node.status}
                        </span>
                      </div>
                      
                      <div className="mt-3 space-y-2">
                        <div>
                          <div className="flex justify-between text-xs">
                            <span className="text-[var(--color-muted)]">CPU</span>
                            <span className="font-mono text-[var(--color-text)]">{node.cpu.used} / {node.cpu.total} cores</span>
                          </div>
                          <div className="w-full h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden mt-0.5">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${(node.cpu.used / node.cpu.total) * 100}%`,
                                background: (node.cpu.used / node.cpu.total) > 0.8 ? "var(--color-crit)" : 
                                            (node.cpu.used / node.cpu.total) > 0.6 ? "var(--color-warn)" : "var(--color-ok)"
                              }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs">
                            <span className="text-[var(--color-muted)]">Memory</span>
                            <span className="font-mono text-[var(--color-text)]">{node.memory.used} / {node.memory.total} GB</span>
                          </div>
                          <div className="w-full h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden mt-0.5">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${(node.memory.used / node.memory.total) * 100}%`,
                                background: (node.memory.used / node.memory.total) > 0.8 ? "var(--color-crit)" : 
                                            (node.memory.used / node.memory.total) > 0.6 ? "var(--color-warn)" : "var(--color-ok)"
                              }}
                            />
                          </div>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-[var(--color-muted)]">Pods</span>
                          <span className="font-mono text-[var(--color-text)]">{node.pods}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Pods Section */}
        {(view === "overview" || view === "pods") && (
          <Card className="overflow-hidden">
            <div 
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-[var(--color-border)]/10 transition"
              onClick={() => toggleSection('pods')}
            >
              <div className="flex items-center gap-3">
                {expandedSections.pods ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                <Box size={20} className="text-[var(--color-muted)]" />
                <h3 className="font-semibold text-[var(--color-text)]">Pods</h3>
                <span className="text-xs text-[var(--color-muted)]">
                  {filteredData?.pods.details.length} of {clusterData?.pods.total}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-[var(--color-ok)]">{filteredData?.pods.running} Running</span>
                <span className="text-[var(--color-warn)]">{filteredData?.pods.pending} Pending</span>
                <span className="text-[var(--color-crit)]">{filteredData?.pods.failed} Failed</span>
              </div>
            </div>
            {expandedSections.pods && (
              <div className="p-4 border-t border-[var(--color-border)] overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[var(--color-faint)] border-b border-[var(--color-border)]">
                      <th className="pb-2 font-medium">Name</th>
                      <th className="pb-2 font-medium">Namespace</th>
                      <th className="pb-2 font-medium">Status</th>
                      <th className="pb-2 font-medium">Node</th>
                      <th className="pb-2 font-medium">Restarts</th>
                      <th className="pb-2 font-medium">Age</th>
                      <th className="pb-2 font-medium">CPU</th>
                      <th className="pb-2 font-medium">Memory</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData?.pods.details.map((pod, i) => (
                      <tr key={i} className="border-b border-[var(--color-border)] last:border-0">
                        <td className="py-2 text-[var(--color-text)] font-mono text-xs">{pod.name}</td>
                        <td className="py-2 text-[var(--color-muted)]">{pod.namespace}</td>
                        <td className="py-2">
                          <div className="flex items-center gap-1.5">
                            {getStatusIcon(pod.status)}
                            <span style={{ color: getStatusColor(pod.status) }}>{pod.status}</span>
                          </div>
                        </td>
                        <td className="py-2 text-[var(--color-muted)]">{pod.node}</td>
                        <td className="py-2 text-[var(--color-muted)]">{pod.restarts}</td>
                        <td className="py-2 text-[var(--color-muted)]">{pod.age}</td>
                        <td className="py-2">
                          <div className="flex items-center gap-2">
                            <div className="w-12 h-1 bg-[var(--color-border)] rounded-full overflow-hidden">
                              <div className="h-full bg-[var(--color-ok)] rounded-full" style={{ width: `${pod.cpu}%` }} />
                            </div>
                            <span className="text-xs font-mono text-[var(--color-text)]">{pod.cpu}%</span>
                          </div>
                        </td>
                        <td className="py-2">
                          <div className="flex items-center gap-2">
                            <div className="w-12 h-1 bg-[var(--color-border)] rounded-full overflow-hidden">
                              <div className="h-full bg-[var(--color-ok)] rounded-full" style={{ width: `${pod.memory}%` }} />
                            </div>
                            <span className="text-xs font-mono text-[var(--color-text)]">{pod.memory}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}

        {/* Services Section */}
        {(view === "overview" || view === "services") && (
          <Card className="overflow-hidden">
            <div 
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-[var(--color-border)]/10 transition"
              onClick={() => toggleSection('services')}
            >
              <div className="flex items-center gap-3">
                {expandedSections.services ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                <Network size={20} className="text-[var(--color-muted)]" />
                <h3 className="font-semibold text-[var(--color-text)]">Services</h3>
                <span className="text-xs text-[var(--color-muted)]">
                  {filteredData?.services.details.length} of {clusterData?.services.total}
                </span>
              </div>
            </div>
            {expandedSections.services && (
              <div className="p-4 border-t border-[var(--color-border)] overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[var(--color-faint)] border-b border-[var(--color-border)]">
                      <th className="pb-2 font-medium">Name</th>
                      <th className="pb-2 font-medium">Type</th>
                      <th className="pb-2 font-medium">Cluster IP</th>
                      <th className="pb-2 font-medium">Ports</th>
                      <th className="pb-2 font-medium">Age</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData?.services.details.map((service, i) => (
                      <tr key={i} className="border-b border-[var(--color-border)] last:border-0">
                        <td className="py-2 text-[var(--color-text)] font-medium">{service.name}</td>
                        <td className="py-2">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-border)] text-[var(--color-muted)]">
                            {service.type}
                          </span>
                        </td>
                        <td className="py-2 font-mono text-xs text-[var(--color-muted)]">{service.clusterIP}</td>
                        <td className="py-2 font-mono text-xs text-[var(--color-muted)]">{service.ports}</td>
                        <td className="py-2 text-[var(--color-muted)]">{service.age}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}

        {/* Deployments Section */}
        {(view === "overview" || view === "deployments") && (
          <Card className="overflow-hidden">
            <div 
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-[var(--color-border)]/10 transition"
              onClick={() => toggleSection('deployments')}
            >
              <div className="flex items-center gap-3">
                {expandedSections.deployments ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                <TrendingUp size={20} className="text-[var(--color-muted)]" />
                <h3 className="font-semibold text-[var(--color-text)]">Deployments</h3>
                <span className="text-xs text-[var(--color-muted)]">
                  {filteredData?.deployments.details.length} of {clusterData?.deployments.total}
                </span>
              </div>
            </div>
            {expandedSections.deployments && (
              <div className="p-4 border-t border-[var(--color-border)] overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[var(--color-faint)] border-b border-[var(--color-border)]">
                      <th className="pb-2 font-medium">Name</th>
                      <th className="pb-2 font-medium">Replicas</th>
                      <th className="pb-2 font-medium">Ready</th>
                      <th className="pb-2 font-medium">Strategy</th>
                      <th className="pb-2 font-medium">Age</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData?.deployments.details.map((deployment, i) => (
                      <tr key={i} className="border-b border-[var(--color-border)] last:border-0">
                        <td className="py-2 text-[var(--color-text)] font-medium">{deployment.name}</td>
                        <td className="py-2 text-[var(--color-muted)]">{deployment.replicas}</td>
                        <td className="py-2">
                          <span className={deployment.ready === deployment.replicas ? "text-[var(--color-ok)]" : "text-[var(--color-warn)]"}>
                            {deployment.ready}/{deployment.replicas}
                          </span>
                        </td>
                        <td className="py-2">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-border)] text-[var(--color-muted)]">
                            {deployment.strategy}
                          </span>
                        </td>
                        <td className="py-2 text-[var(--color-muted)]">{deployment.age}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}

        {/* Events Section */}
        {view === "overview" && (
          <Card className="overflow-hidden">
            <div 
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-[var(--color-border)]/10 transition"
              onClick={() => toggleSection('events')}
            >
              <div className="flex items-center gap-3">
                {expandedSections.events ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                <Zap size={20} className="text-[var(--color-muted)]" />
                <h3 className="font-semibold text-[var(--color-text)]">Recent Events</h3>
              </div>
              <span className="text-xs text-[var(--color-muted)]">Last 10 events</span>
            </div>
            {expandedSections.events && (
              <div className="p-4 border-t border-[var(--color-border)] overflow-x-auto">
                <div className="space-y-2">
                  {clusterData?.events.map((event, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm p-2 bg-[var(--color-bg)] rounded-lg">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        event.type === "Error" ? "bg-[var(--color-crit)]" :
                        event.type === "Warning" ? "bg-[var(--color-warn)]" :
                        "bg-[var(--color-ok)]"
                      }`} />
                      <span className="text-xs font-mono text-[var(--color-faint)]">{event.age}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        event.type === "Error" ? "bg-[var(--color-crit)]/10 text-[var(--color-crit)]" :
                        event.type === "Warning" ? "bg-[var(--color-warn)]/10 text-[var(--color-warn)]" :
                        "bg-[var(--color-ok)]/10 text-[var(--color-ok)]"
                      }`}>
                        {event.type}
                      </span>
                      <span className="font-medium text-[var(--color-text)]">{event.reason}</span>
                      <span className="text-[var(--color-muted)]">{event.object}</span>
                      <span className="text-[var(--color-faint)] text-xs">in {event.namespace}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        )}
      </div>

      {/* Node Detail Modal */}
      {selectedNode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedNode(null)}>
          <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-[var(--color-text)]">{selectedNode.name}</h3>
                <p className="text-sm text-[var(--color-muted)]">Role: {selectedNode.role} • Uptime: {selectedNode.uptime}</p>
              </div>
              <button onClick={() => setSelectedNode(null)} className="text-[var(--color-muted)] hover:text-[var(--color-text)]">
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[var(--color-bg)] p-3 rounded-lg">
                  <p className="text-xs text-[var(--color-faint)]">CPU</p>
                  <p className="text-lg font-bold text-[var(--color-text)]">{selectedNode.cpu.used} / {selectedNode.cpu.total} cores</p>
                  <div className="w-full h-2 bg-[var(--color-border)] rounded-full overflow-hidden mt-1">
                    <div className="h-full rounded-full bg-[var(--color-ok)]" 
                      style={{ width: `${(selectedNode.cpu.used / selectedNode.cpu.total) * 100}%` }} />
                  </div>
                </div>
                <div className="bg-[var(--color-bg)] p-3 rounded-lg">
                  <p className="text-xs text-[var(--color-faint)]">Memory</p>
                  <p className="text-lg font-bold text-[var(--color-text)]">{selectedNode.memory.used} / {selectedNode.memory.total} GB</p>
                  <div className="w-full h-2 bg-[var(--color-border)] rounded-full overflow-hidden mt-1">
                    <div className="h-full rounded-full bg-[var(--color-ok)]" 
                      style={{ width: `${(selectedNode.memory.used / selectedNode.memory.total) * 100}%` }} />
                  </div>
                </div>
              </div>
              
              <div className="bg-[var(--color-bg)] p-3 rounded-lg">
                <p className="text-xs text-[var(--color-faint)] mb-2">Conditions</p>
                <div className="space-y-1">
                  {selectedNode.conditions.map((cond, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-[var(--color-muted)]">{cond.type}</span>
                      <span className={cond.status === "True" ? "text-[var(--color-ok)]" : "text-[var(--color-muted)]"}>
                        {cond.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-[var(--color-bg)] p-3 rounded-lg">
                <p className="text-xs text-[var(--color-faint)] mb-2">Pod Information</p>
                <p className="text-[var(--color-text)]">Total Pods: {selectedNode.pods}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}