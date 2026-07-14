// pages/DockerPage.jsx
import { useState, useEffect, useMemo } from "react";
import { 
  Search, RefreshCw, Plus, AlertCircle, CheckCircle, 
  XCircle, Server, HardDrive, Cpu, Activity, 
  Layers, Box, Network, Clock, Zap, 
  RotateCw, Trash2, ChevronDown, ChevronRight,
  Container, PlayCircle, Square, Terminal, Cpu as CpuIcon,
  MemoryStick, FolderOpen, GitBranch
} from "lucide-react";
import { toast } from "react-hot-toast";
import Card from "../components/common/Card";
import StatusDot from "../components/common/StatusDot";
import LoadingSpinner from "../components/common/LoadingSpinner";

// Mock data generator for Docker
const generateDockerData = () => {
  const containerStatuses = ["running", "running", "running", "exited", "running", "running", "paused", "running", "exited", "running"];
  const containerNames = [
    "nginx-web", "redis-cache", "postgres-db", "mysql-db", "node-app",
    "python-api", "mongodb", "elasticsearch", "kibana", "grafana",
    "prometheus", "jenkins", "gitlab", "sonarqube", "portainer"
  ];
  const images = [
    "nginx:1.25", "redis:7.2", "postgres:15", "mysql:8.0", "node:18-alpine",
    "python:3.11", "mongo:6.0", "elasticsearch:8.10", "kibana:8.10", "grafana:10.2",
    "prom/prometheus:v2.47", "jenkins/jenkins:lts", "gitlab/gitlab-ce:latest", "sonarqube:latest", "portainer/portainer-ce:latest"
  ];
  const networks = ["bridge", "host", "overlay", "macvlan", "none"];
  const ports = ["80:80", "6379:6379", "5432:5432", "3306:3306", "3000:3000", "5000:5000", "27017:27017", "9200:9200", "5601:5601", "3000:3000"];

  const containers = Array.from({ length: 15 }, (_, i) => {
    const status = containerStatuses[i % containerStatuses.length];
    const name = containerNames[i % containerNames.length] + (i >= containerNames.length ? `-${Math.floor(i / containerNames.length) + 1}` : "");
    return {
      id: `container-${String(i + 1).padStart(3, '0')}`,
      name: name,
      image: images[i % images.length],
      status: status,
      created: `${Math.floor(Math.random() * 30)} days ago`,
      uptime: status === "running" ? `${Math.floor(Math.random() * 30)}d ${Math.floor(Math.random() * 23)}h` : "Stopped",
      cpu: status === "running" ? Math.round(5 + Math.random() * 70) : 0,
      memory: status === "running" ? Math.round(20 + Math.random() * 70) : 0,
      memoryUsage: status === "running" ? `${Math.round(100 + Math.random() * 900)}MiB` : "0MiB",
      memoryLimit: `${Math.round(1 + Math.random() * 3)}GiB`,
      ports: ports[i % ports.length],
      network: networks[Math.floor(Math.random() * networks.length)],
      ip: `172.17.0.${Math.floor(Math.random() * 255) + 1}`,
      restartCount: Math.floor(Math.random() * 5),
      health: status === "running" ? ["healthy", "unhealthy", "starting"][Math.floor(Math.random() * 3)] : "none",
    };
  });

  const totalContainers = containers.length;
  const running = containers.filter(c => c.status === "running").length;
  const exited = containers.filter(c => c.status === "exited").length;
  const paused = containers.filter(c => c.status === "paused").length;
  const healthy = containers.filter(c => c.health === "healthy").length;
  const unhealthy = containers.filter(c => c.health === "unhealthy").length;

  const imagesList = Array.from({ length: 15 }, (_, i) => ({
    id: `image-${String(i + 1).padStart(3, '0')}`,
    name: images[i % images.length],
    size: `${Math.round(50 + Math.random() * 950)}MB`,
    created: `${Math.floor(Math.random() * 60)} days ago`,
    containers: Math.floor(Math.random() * 5) + 1,
  }));

  const volumesList = Array.from({ length: 8 }, (_, i) => ({
    id: `volume-${String(i + 1).padStart(3, '0')}`,
    name: `volume-${String(i + 1).padStart(2, '0')}`,
    driver: ["local", "overlay"][Math.floor(Math.random() * 2)],
    size: `${Math.round(1 + Math.random() * 50)}GB`,
    containers: Math.floor(Math.random() * 3) + 1,
    created: `${Math.floor(Math.random() * 30)} days ago`,
  }));

  const networksList = Array.from({ length: 5 }, (_, i) => ({
    id: `network-${String(i + 1).padStart(3, '0')}`,
    name: i === 0 ? "bridge" : i === 1 ? "host" : i === 2 ? "none" : `net-${String(i).padStart(2, '0')}`,
    driver: ["bridge", "host", "overlay", "macvlan"][Math.floor(Math.random() * 4)],
    subnet: `172.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.0/24`,
    containers: Math.floor(Math.random() * 5) + 1,
    created: `${Math.floor(Math.random() * 30)} days ago`,
  }));

  return {
    containers: {
      total: totalContainers,
      running,
      exited,
      paused,
      healthy,
      unhealthy,
      details: containers,
    },
    images: {
      total: imagesList.length,
      details: imagesList,
    },
    volumes: {
      total: volumesList.length,
      details: volumesList,
    },
    networks: {
      total: networksList.length,
      details: networksList,
    },
    stats: {
      cpuUsage: Math.round(10 + Math.random() * 60),
      memoryUsage: Math.round(30 + Math.random() * 50),
      diskUsage: Math.round(40 + Math.random() * 40),
      containersRunning: running,
      containersTotal: totalContainers,
    }
  };
};

export default function DockerPage() {
  const [dockerData, setDockerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [view, setView] = useState("overview");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedSections, setExpandedSections] = useState({
    containers: true,
    images: true,
    volumes: true,
    networks: true,
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedContainer, setSelectedContainer] = useState(null);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(false), 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = (showToast = true) => {
    setIsRefreshing(true);
    setLoading(true);
    setTimeout(() => {
      const data = generateDockerData();
      setDockerData(data);
      setLoading(false);
      setIsRefreshing(false);
      if (showToast) toast.success("Docker data updated");
    }, 800);
  };

  const filteredData = useMemo(() => {
    if (!dockerData) return null;

    let filteredContainers = [...dockerData.containers.details];

    if (statusFilter !== "all") {
      filteredContainers = filteredContainers.filter(c => c.status === statusFilter);
    }

    if (search.trim()) {
      const term = search.toLowerCase();
      filteredContainers = filteredContainers.filter(c => 
        c.name.toLowerCase().includes(term) || 
        c.image.toLowerCase().includes(term) ||
        c.id.toLowerCase().includes(term)
      );
    }

    let filteredImages = [...dockerData.images.details];
    let filteredVolumes = [...dockerData.volumes.details];
    let filteredNetworks = [...dockerData.networks.details];

    if (search.trim()) {
      const term = search.toLowerCase();
      filteredImages = filteredImages.filter(i => i.name.toLowerCase().includes(term));
      filteredVolumes = filteredVolumes.filter(v => v.name.toLowerCase().includes(term));
      filteredNetworks = filteredNetworks.filter(n => n.name.toLowerCase().includes(term));
    }

    const running = filteredContainers.filter(c => c.status === "running").length;
    const exited = filteredContainers.filter(c => c.status === "exited").length;
    const paused = filteredContainers.filter(c => c.status === "paused").length;

    return {
      containers: {
        ...dockerData.containers,
        details: filteredContainers,
        running,
        exited,
        paused,
      },
      images: {
        ...dockerData.images,
        details: filteredImages,
      },
      volumes: {
        ...dockerData.volumes,
        details: filteredVolumes,
      },
      networks: {
        ...dockerData.networks,
        details: filteredNetworks,
      },
      stats: dockerData.stats,
    };
  }, [dockerData, statusFilter, search]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getStatusColor = (status) => {
    if (status === "running" || status === "healthy") return "var(--color-ok)";
    if (status === "exited" || status === "unhealthy") return "var(--color-crit)";
    if (status === "paused" || status === "starting") return "var(--color-warn)";
    return "var(--color-muted)";
  };

  const getStatusIcon = (status) => {
    const color = getStatusColor(status);
    if (status === "running" || status === "healthy") 
      return <CheckCircle size={16} style={{ color }} />;
    if (status === "paused" || status === "starting") 
      return <AlertCircle size={16} style={{ color }} />;
    if (status === "exited" || status === "unhealthy") 
      return <XCircle size={16} style={{ color }} />;
    return null;
  };

  const getStatusLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getContainerActionIcon = (status) => {
    switch(status) {
      case 'running': return <Square size={16} />;
      case 'exited': return <PlayCircle size={16} />;
      case 'paused': return <PlayCircle size={16} />;
      default: return <RotateCw size={16} />;
    }
  };

  if (loading && !dockerData) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size={48} />
      </div>
    );
  }

  if (!dockerData || !filteredData) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)] flex items-center gap-2">
            <Terminal size={28} className="text-[var(--color-accent)]" />
            Docker
          </h1>
          <p className="text-[var(--color-muted)] text-sm mt-1">
            Container management • {filteredData.containers.running} running containers
          </p>
        </div>
        <div className="flex items-center gap-2">
          <StatusDot state={filteredData.containers.running > 0 ? "up" : "down"} size="md" />
          <span className="text-sm text-[var(--color-text)]">
            {filteredData.containers.running > 0 ? "Operational" : "No containers running"}
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
            Run Container
          </button>
        </div>
      </div>

      {/* Quick Stats - Clean black/light black theme */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">Total</p>
              <p className="text-2xl font-bold text-[var(--color-text)] mt-1">
                {dockerData.containers.total}
              </p>
            </div>
            <Container size={24} className="text-[var(--color-muted)]" />
          </div>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <span className="text-[var(--color-ok)]">● Running: {dockerData.containers.running}</span>
            <span className="text-[var(--color-warn)]">● Paused: {dockerData.containers.paused}</span>
            <span className="text-[var(--color-crit)]">● Exited: {dockerData.containers.exited}</span>
          </div>
        </div>

        <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">Health</p>
              <p className="text-2xl font-bold text-[var(--color-ok)] mt-1">
                {dockerData.containers.healthy}
              </p>
            </div>
            <CheckCircle size={24} className="text-[var(--color-ok)]" />
          </div>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <span className="text-[var(--color-crit)]">● Unhealthy: {dockerData.containers.unhealthy}</span>
          </div>
        </div>

        <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">Images</p>
              <p className="text-2xl font-bold text-[var(--color-text)] mt-1">
                {dockerData.images.total}
              </p>
            </div>
            <Layers size={24} className="text-[var(--color-muted)]" />
          </div>
        </div>

        <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">Volumes</p>
              <p className="text-2xl font-bold text-[var(--color-text)] mt-1">
                {dockerData.volumes.total}
              </p>
            </div>
            <FolderOpen size={24} className="text-[var(--color-muted)]" />
          </div>
        </div>

        <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">Networks</p>
              <p className="text-2xl font-bold text-[var(--color-text)] mt-1">
                {dockerData.networks.total}
              </p>
            </div>
            <GitBranch size={24} className="text-[var(--color-muted)]" />
          </div>
        </div>

        <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">Resources</p>
              <div className="mt-1 space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <CpuIcon size={12} className="text-[var(--color-muted)]" />
                  <span className="text-[var(--color-text)]">{dockerData.stats.cpuUsage}%</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <MemoryStick size={12} className="text-[var(--color-muted)]" />
                  <span className="text-[var(--color-text)]">{dockerData.stats.memoryUsage}%</span>
                </div>
              </div>
            </div>
            <Activity size={24} className="text-[var(--color-muted)]" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 text-sm rounded-lg transition ${
              statusFilter === "all"
                ? "bg-[var(--color-accent)] text-[#06222A] font-medium"
                : "bg-transparent text-[var(--color-muted)] border border-[var(--color-border)] hover:border-[var(--color-text)]"
            }`}
          >
            All ({dockerData.containers.total})
          </button>
          <button
            onClick={() => setStatusFilter("running")}
            className={`px-3 py-1.5 text-sm rounded-lg transition ${
              statusFilter === "running"
                ? "bg-[var(--color-ok)] text-[#06222A] font-medium"
                : "bg-transparent text-[var(--color-muted)] border border-[var(--color-border)] hover:border-[var(--color-text)]"
            }`}
          >
            Running ({dockerData.containers.running})
          </button>
          <button
            onClick={() => setStatusFilter("paused")}
            className={`px-3 py-1.5 text-sm rounded-lg transition ${
              statusFilter === "paused"
                ? "bg-[var(--color-warn)] text-[#06222A] font-medium"
                : "bg-transparent text-[var(--color-muted)] border border-[var(--color-border)] hover:border-[var(--color-text)]"
            }`}
          >
            Paused ({dockerData.containers.paused})
          </button>
          <button
            onClick={() => setStatusFilter("exited")}
            className={`px-3 py-1.5 text-sm rounded-lg transition ${
              statusFilter === "exited"
                ? "bg-[var(--color-crit)] text-white font-medium"
                : "bg-transparent text-[var(--color-muted)] border border-[var(--color-border)] hover:border-[var(--color-text)]"
            }`}
          >
            Exited ({dockerData.containers.exited})
          </button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-faint)]" />
            <input
              type="text"
              placeholder="Search containers, images..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64 pl-9 pr-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition"
            />
          </div>
          <div className="flex items-center gap-1">
            {["overview", "containers", "images", "volumes", "networks"].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-2.5 py-1.5 text-xs rounded-lg transition ${
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
      </div>

      {/* Main Content */}
      <div className="space-y-4">
        {/* Containers Section - Clean black theme */}
        {(view === "overview" || view === "containers") && (
          <Card className="overflow-hidden">
            <div 
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-[var(--color-border)]/10 transition"
              onClick={() => toggleSection('containers')}
            >
              <div className="flex items-center gap-3">
                {expandedSections.containers ? <ChevronDown size={20} className="text-[var(--color-muted)]" /> : <ChevronRight size={20} className="text-[var(--color-muted)]" />}
                <Container size={20} className="text-[var(--color-muted)]" />
                <h3 className="font-semibold text-[var(--color-text)]">Containers</h3>
                <span className="text-xs text-[var(--color-muted)]">
                  {filteredData.containers.details.length} of {dockerData.containers.total}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-[var(--color-ok)]">● {filteredData.containers.running} Running</span>
                <span className="text-[var(--color-warn)]">● {filteredData.containers.paused} Paused</span>
                <span className="text-[var(--color-crit)]">● {filteredData.containers.exited} Exited</span>
              </div>
            </div>
            {expandedSections.containers && (
              <div className="p-4 border-t border-[var(--color-border)]">
                {filteredData.containers.details.length === 0 ? (
                  <div className="text-center py-8 text-[var(--color-muted)]">
                    No containers match your filters.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredData.containers.details.map((container) => (
                      <div 
                        key={container.id}
                        className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg p-4 hover:border-[var(--color-accent)] transition-all cursor-pointer"
                        onClick={() => setSelectedContainer(container)}
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(container.status)}
                              <span className="font-medium text-[var(--color-text)] truncate">{container.name}</span>
                            </div>
                            <div className="text-xs text-[var(--color-muted)] mt-1 truncate font-mono">{container.image}</div>
                            <div className="text-xs text-[var(--color-faint)] mt-0.5 font-mono">{container.id}</div>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full border`}
                            style={{ 
                              color: getStatusColor(container.status),
                              borderColor: getStatusColor(container.status)
                            }}
                          >
                            {getStatusLabel(container.status)}
                          </span>
                        </div>

                        {/* Stats Grid */}
                        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-[var(--color-panel)]/30 rounded p-1.5">
                            <span className="text-[var(--color-faint)]">Uptime</span>
                            <div className="text-[var(--color-text)] font-mono">{container.uptime}</div>
                          </div>
                          <div className="bg-[var(--color-panel)]/30 rounded p-1.5">
                            <span className="text-[var(--color-faint)]">Ports</span>
                            <div className="text-[var(--color-text)] font-mono text-[10px]">{container.ports}</div>
                          </div>
                          <div className="bg-[var(--color-panel)]/30 rounded p-1.5">
                            <span className="text-[var(--color-faint)]">Health</span>
                            <div className={`font-medium capitalize ${
                              container.health === "healthy" ? "text-[var(--color-ok)]" :
                              container.health === "unhealthy" ? "text-[var(--color-crit)]" :
                              "text-[var(--color-warn)]"
                            }`}>
                              {container.health}
                            </div>
                          </div>
                          <div className="bg-[var(--color-panel)]/30 rounded p-1.5">
                            <span className="text-[var(--color-faint)]">Restarts</span>
                            <div className="text-[var(--color-text)]">{container.restartCount}</div>
                          </div>
                        </div>

                        {/* Resource Bars */}
                        {container.status === "running" && (
                          <div className="mt-3 space-y-2">
                            <div>
                              <div className="flex justify-between text-xs">
                                <span className="text-[var(--color-muted)] flex items-center gap-1">
                                  <CpuIcon size={12} /> CPU
                                </span>
                                <span className="font-mono text-[var(--color-text)]">{container.cpu}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden mt-0.5">
                                <div
                                  className="h-full rounded-full transition-all duration-500"
                                  style={{
                                    width: `${container.cpu}%`,
                                    background: container.cpu > 80 ? "var(--color-crit)" : 
                                                container.cpu > 60 ? "var(--color-warn)" : "var(--color-ok)"
                                  }}
                                />
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-xs">
                                <span className="text-[var(--color-muted)] flex items-center gap-1">
                                  <MemoryStick size={12} /> Memory
                                </span>
                                <span className="font-mono text-[var(--color-text)]">{container.memory}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden mt-0.5">
                                <div
                                  className="h-full rounded-full transition-all duration-500"
                                  style={{
                                    width: `${container.memory}%`,
                                    background: container.memory > 80 ? "var(--color-crit)" : 
                                                container.memory > 60 ? "var(--color-warn)" : "var(--color-ok)"
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Footer */}
                        <div className="mt-3 pt-2 border-t border-[var(--color-border)] flex items-center justify-between">
                          <span className="text-xs text-[var(--color-faint)] flex items-center gap-1">
                            <GitBranch size={12} /> {container.network}
                          </span>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              className="p-1 rounded hover:bg-[var(--color-border)] transition text-[var(--color-muted)] hover:text-[var(--color-text)]"
                              onClick={(e) => { e.stopPropagation(); toast.success(`${container.status === 'running' ? 'Stopping' : 'Starting'} ${container.name}`); }}
                            >
                              {getContainerActionIcon(container.status)}
                            </button>
                            <button 
                              className="p-1 rounded hover:bg-[var(--color-border)] transition text-[var(--color-muted)] hover:text-[var(--color-crit)]"
                              onClick={(e) => { e.stopPropagation(); toast.error(`Removing ${container.name}`); }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Card>
        )}

        {/* Images, Volumes, Networks sections with clean black theme */}
        {(view === "overview" || view === "images") && (
          <Card className="overflow-hidden">
            <div 
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-[var(--color-border)]/10 transition"
              onClick={() => toggleSection('images')}
            >
              <div className="flex items-center gap-3">
                {expandedSections.images ? <ChevronDown size={20} className="text-[var(--color-muted)]" /> : <ChevronRight size={20} className="text-[var(--color-muted)]" />}
                <Layers size={20} className="text-[var(--color-muted)]" />
                <h3 className="font-semibold text-[var(--color-text)]">Images</h3>
                <span className="text-xs text-[var(--color-muted)]">
                  {filteredData.images.details.length} of {dockerData.images.total}
                </span>
              </div>
            </div>
            {expandedSections.images && (
              <div className="p-4 border-t border-[var(--color-border)] overflow-x-auto">
                {filteredData.images.details.length === 0 ? (
                  <div className="text-center py-8 text-[var(--color-muted)]">
                    No images match your search.
                  </div>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-[var(--color-faint)] border-b border-[var(--color-border)]">
                        <th className="pb-2 font-medium">Repository</th>
                        <th className="pb-2 font-medium">Size</th>
                        <th className="pb-2 font-medium">Created</th>
                        <th className="pb-2 font-medium">Containers</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.images.details.map((image, i) => (
                        <tr key={i} className="border-b border-[var(--color-border)] last:border-0">
                          <td className="py-2 text-[var(--color-text)] font-medium">{image.name}</td>
                          <td className="py-2 text-[var(--color-muted)]">{image.size}</td>
                          <td className="py-2 text-[var(--color-muted)]">{image.created}</td>
                          <td className="py-2 text-[var(--color-muted)]">{image.containers}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </Card>
        )}

        {(view === "overview" || view === "volumes") && (
          <Card className="overflow-hidden">
            <div 
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-[var(--color-border)]/10 transition"
              onClick={() => toggleSection('volumes')}
            >
              <div className="flex items-center gap-3">
                {expandedSections.volumes ? <ChevronDown size={20} className="text-[var(--color-muted)]" /> : <ChevronRight size={20} className="text-[var(--color-muted)]" />}
                <FolderOpen size={20} className="text-[var(--color-muted)]" />
                <h3 className="font-semibold text-[var(--color-text)]">Volumes</h3>
                <span className="text-xs text-[var(--color-muted)]">
                  {filteredData.volumes.details.length} of {dockerData.volumes.total}
                </span>
              </div>
            </div>
            {expandedSections.volumes && (
              <div className="p-4 border-t border-[var(--color-border)] overflow-x-auto">
                {filteredData.volumes.details.length === 0 ? (
                  <div className="text-center py-8 text-[var(--color-muted)]">
                    No volumes match your search.
                  </div>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-[var(--color-faint)] border-b border-[var(--color-border)]">
                        <th className="pb-2 font-medium">Name</th>
                        <th className="pb-2 font-medium">Driver</th>
                        <th className="pb-2 font-medium">Size</th>
                        <th className="pb-2 font-medium">Containers</th>
                        <th className="pb-2 font-medium">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.volumes.details.map((volume, i) => (
                        <tr key={i} className="border-b border-[var(--color-border)] last:border-0">
                          <td className="py-2 text-[var(--color-text)] font-medium">{volume.name}</td>
                          <td className="py-2 text-[var(--color-muted)]">{volume.driver}</td>
                          <td className="py-2 text-[var(--color-muted)]">{volume.size}</td>
                          <td className="py-2 text-[var(--color-muted)]">{volume.containers}</td>
                          <td className="py-2 text-[var(--color-muted)]">{volume.created}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </Card>
        )}

        {(view === "overview" || view === "networks") && (
          <Card className="overflow-hidden">
            <div 
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-[var(--color-border)]/10 transition"
              onClick={() => toggleSection('networks')}
            >
              <div className="flex items-center gap-3">
                {expandedSections.networks ? <ChevronDown size={20} className="text-[var(--color-muted)]" /> : <ChevronRight size={20} className="text-[var(--color-muted)]" />}
                <GitBranch size={20} className="text-[var(--color-muted)]" />
                <h3 className="font-semibold text-[var(--color-text)]">Networks</h3>
                <span className="text-xs text-[var(--color-muted)]">
                  {filteredData.networks.details.length} of {dockerData.networks.total}
                </span>
              </div>
            </div>
            {expandedSections.networks && (
              <div className="p-4 border-t border-[var(--color-border)] overflow-x-auto">
                {filteredData.networks.details.length === 0 ? (
                  <div className="text-center py-8 text-[var(--color-muted)]">
                    No networks match your search.
                  </div>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-[var(--color-faint)] border-b border-[var(--color-border)]">
                        <th className="pb-2 font-medium">Name</th>
                        <th className="pb-2 font-medium">Driver</th>
                        <th className="pb-2 font-medium">Subnet</th>
                        <th className="pb-2 font-medium">Containers</th>
                        <th className="pb-2 font-medium">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.networks.details.map((network, i) => (
                        <tr key={i} className="border-b border-[var(--color-border)] last:border-0">
                          <td className="py-2 text-[var(--color-text)] font-medium">{network.name}</td>
                          <td className="py-2 text-[var(--color-muted)]">{network.driver}</td>
                          <td className="py-2 text-[var(--color-muted)] font-mono text-xs">{network.subnet}</td>
                          <td className="py-2 text-[var(--color-muted)]">{network.containers}</td>
                          <td className="py-2 text-[var(--color-muted)]">{network.created}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </Card>
        )}
      </div>

      {/* Container Detail Modal - Clean black theme */}
      {selectedContainer && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setSelectedContainer(null)}>
          <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(selectedContainer.status)}
                  <h3 className="text-xl font-bold text-[var(--color-text)]">{selectedContainer.name}</h3>
                </div>
                <p className="text-sm text-[var(--color-muted)]">{selectedContainer.image}</p>
                <p className="text-xs text-[var(--color-faint)] font-mono">{selectedContainer.id}</p>
              </div>
              <button onClick={() => setSelectedContainer(null)} className="text-[var(--color-muted)] hover:text-[var(--color-text)] transition">
                <XCircle size={24} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-[var(--color-bg)] p-3 rounded-lg border border-[var(--color-border)]">
                <p className="text-xs text-[var(--color-faint)]">Status</p>
                <p className="text-[var(--color-text)] font-medium capitalize">{selectedContainer.status}</p>
              </div>
              <div className="bg-[var(--color-bg)] p-3 rounded-lg border border-[var(--color-border)]">
                <p className="text-xs text-[var(--color-faint)]">Health</p>
                <p className={`font-medium capitalize ${
                  selectedContainer.health === "healthy" ? "text-[var(--color-ok)]" :
                  selectedContainer.health === "unhealthy" ? "text-[var(--color-crit)]" :
                  "text-[var(--color-warn)]"
                }`}>
                  {selectedContainer.health}
                </p>
              </div>
              <div className="bg-[var(--color-bg)] p-3 rounded-lg border border-[var(--color-border)]">
                <p className="text-xs text-[var(--color-faint)]">Uptime</p>
                <p className="text-[var(--color-text)]">{selectedContainer.uptime}</p>
              </div>
              <div className="bg-[var(--color-bg)] p-3 rounded-lg border border-[var(--color-border)]">
                <p className="text-xs text-[var(--color-faint)]">Restarts</p>
                <p className="text-[var(--color-text)]">{selectedContainer.restartCount}</p>
              </div>
            </div>

            <div className="bg-[var(--color-bg)] p-3 rounded-lg border border-[var(--color-border)] mb-4">
              <p className="text-xs text-[var(--color-faint)] mb-2">Resource Usage</p>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[var(--color-muted)]">CPU</span>
                    <span className="font-mono text-[var(--color-text)]">{selectedContainer.cpu}%</span>
                  </div>
                  <div className="w-full h-2 bg-[var(--color-border)] rounded-full overflow-hidden mt-0.5">
                    <div 
                      className="h-full rounded-full bg-[var(--color-ok)]" 
                      style={{ 
                        width: `${selectedContainer.cpu}%`,
                        background: selectedContainer.cpu > 80 ? "var(--color-crit)" : 
                                    selectedContainer.cpu > 60 ? "var(--color-warn)" : "var(--color-ok)"
                      }} 
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[var(--color-muted)]">Memory</span>
                    <span className="font-mono text-[var(--color-text)]">{selectedContainer.memoryUsage} / {selectedContainer.memoryLimit}</span>
                  </div>
                  <div className="w-full h-2 bg-[var(--color-border)] rounded-full overflow-hidden mt-0.5">
                    <div 
                      className="h-full rounded-full" 
                      style={{ 
                        width: `${selectedContainer.memory}%`,
                        background: selectedContainer.memory > 80 ? "var(--color-crit)" : 
                                    selectedContainer.memory > 60 ? "var(--color-warn)" : "var(--color-ok)"
                      }} 
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[var(--color-bg)] p-3 rounded-lg border border-[var(--color-border)]">
                <p className="text-xs text-[var(--color-faint)]">Network</p>
                <p className="text-[var(--color-text)]">{selectedContainer.network}</p>
                <p className="text-xs font-mono text-[var(--color-muted)]">{selectedContainer.ip}</p>
              </div>
              <div className="bg-[var(--color-bg)] p-3 rounded-lg border border-[var(--color-border)]">
                <p className="text-xs text-[var(--color-faint)]">Ports</p>
                <p className="text-[var(--color-text)] font-mono">{selectedContainer.ports}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <button 
                className="px-4 py-2 bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-80 transition flex items-center gap-2"
                onClick={() => toast.success(`${selectedContainer.status === 'running' ? 'Stopping' : 'Starting'} ${selectedContainer.name}`)}
              >
                {getContainerActionIcon(selectedContainer.status)}
                {selectedContainer.status === 'running' ? 'Stop' : selectedContainer.status === 'paused' ? 'Resume' : 'Start'}
              </button>
              <button 
                className="px-4 py-2 bg-[var(--color-crit)] text-white font-semibold rounded-lg hover:opacity-80 transition flex items-center gap-2"
                onClick={() => toast.error(`Removing ${selectedContainer.name}`)}
              >
                <Trash2 size={16} />
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}