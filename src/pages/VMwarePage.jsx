// pages/VMwarePage.jsx
import { useState, useEffect, useMemo } from "react";
import { 
  Search, RefreshCw, Plus, AlertCircle, CheckCircle, 
  XCircle, Server, HardDrive, Cpu, Activity, 
  Layers, Box, Network, Clock, Zap, 
  ChevronDown, ChevronRight, FolderOpen, GitBranch,
  Database, Monitor, Cloud, Wifi, Power, 
  Server as ServerIcon, HardDrive as HardDriveIcon,
  Cpu as CpuIcon, MemoryStick, Gauge, BarChart3
} from "lucide-react";
import { toast } from "react-hot-toast";
import Card from "../components/common/Card";
import StatusDot from "../components/common/StatusDot";
import LoadingSpinner from "../components/common/LoadingSpinner";

// Gauge component for CPU and Memory
const GaugeChart = ({ value, label, max = 100, size = 80 }) => {
  const radius = size * 0.35;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (value / max) * circumference;
  
  const getColor = (val) => {
    if (val > 80) return "#ff4444";
    if (val > 60) return "#ffaa00";
    return "#ffffff";
  };

  const getOpacity = (val) => {
    if (val > 80) return 0.9;
    if (val > 60) return 0.7;
    return 0.4;
  };

  const color = getColor(value);
  const opacity = getOpacity(value);

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size * 0.6} viewBox={`0 0 ${size} ${size * 0.6}`}>
        {/* Background arc */}
        <path
          d={`M ${size * 0.1} ${size * 0.5} A ${radius} ${radius} 0 0 1 ${size * 0.9} ${size * 0.5}`}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* Value arc */}
        <path
          d={`M ${size * 0.1} ${size * 0.5} A ${radius} ${radius} 0 0 1 ${size * 0.9} ${size * 0.5}`}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          style={{ opacity: opacity, transition: 'stroke-dashoffset 0.8s ease' }}
        />
        {/* Center text */}
        <text
          x={size / 2}
          y={size * 0.45}
          textAnchor="middle"
          fill="var(--color-text)"
          fontSize={size * 0.15}
          fontWeight="bold"
          fontFamily="monospace"
        >
          {Math.round(value)}%
        </text>
        <text
          x={size / 2}
          y={size * 0.55}
          textAnchor="middle"
          fill="var(--color-muted)"
          fontSize={size * 0.08}
          fontFamily="monospace"
        >
          {label}
        </text>
      </svg>
    </div>
  );
};

// Mini gauge for host cards
const MiniGauge = ({ value, max = 100, size = 60 }) => {
  const radius = size * 0.3;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (value / max) * circumference;
  
  const getColor = (val) => {
    if (val > 80) return "#ff4444";
    if (val > 60) return "#ffaa00";
    return "#ffffff";
  };

  const getOpacity = (val) => {
    if (val > 80) return 0.9;
    if (val > 60) return 0.7;
    return 0.4;
  };

  const color = getColor(value);
  const opacity = getOpacity(value);

  return (
    <svg width={size} height={size * 0.5} viewBox={`0 0 ${size} ${size * 0.5}`}>
      <path
        d={`M ${size * 0.1} ${size * 0.45} A ${radius} ${radius} 0 0 1 ${size * 0.9} ${size * 0.45}`}
        fill="none"
        stroke="var(--color-border)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d={`M ${size * 0.1} ${size * 0.45} A ${radius} ${radius} 0 0 1 ${size * 0.9} ${size * 0.45}`}
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={strokeDasharray}
        strokeDashoffset={strokeDashoffset}
        style={{ opacity: opacity, transition: 'stroke-dashoffset 0.8s ease' }}
      />
      <text
        x={size / 2}
        y={size * 0.4}
        textAnchor="middle"
        fill="var(--color-text)"
        fontSize={size * 0.15}
        fontWeight="bold"
        fontFamily="monospace"
      >
        {Math.round(value)}%
      </text>
    </svg>
  );
};

// Mock data generator for VMware
const generateVMwareData = () => {
  const hostStatuses = ["connected", "connected", "connected", "disconnected", "connected", "connected", "maintenance"];
  const hostNames = [
    "esxi-01.example.com", "esxi-02.example.com", "esxi-03.example.com", 
    "esxi-04.example.com", "esxi-05.example.com", "esxi-06.example.com",
    "esxi-07.example.com"
  ];
  
  const vmStatuses = ["poweredOn", "poweredOn", "poweredOff", "poweredOn", "poweredOn", "poweredOff", "poweredOn", "suspended"];
  const vmNames = [
    "web-server-01", "web-server-02", "db-server-01", "db-server-02",
    "app-server-01", "app-server-02", "redis-cache-01", "redis-cache-02",
    "elasticsearch-01", "elasticsearch-02", "kibana-01", "grafana-01",
    "prometheus-01", "jenkins-01", "gitlab-01", "sonarqube-01"
  ];
  
  const datastoreNames = [
    "datastore-01", "datastore-02", "datastore-03", "datastore-04",
    "datastore-05", "datastore-06"
  ];

  // Generate Hosts
  const hosts = Array.from({ length: 7 }, (_, i) => {
    const status = hostStatuses[i % hostStatuses.length];
    const vmCount = Math.floor(Math.random() * 15) + 5;
    const cpuUsed = Math.floor(Math.random() * 20) + 5;
    const cpuTotal = Math.floor(Math.random() * 32) + 16;
    const memUsed = Math.floor(Math.random() * 80) + 20;
    const memTotal = Math.floor(Math.random() * 128) + 64;
    return {
      id: `host-${String(i + 1).padStart(3, '0')}`,
      name: hostNames[i % hostNames.length],
      status: status,
      version: `ESXi 7.0.${Math.floor(Math.random() * 3) + 1}`,
      cpu: {
        total: cpuTotal,
        used: cpuUsed,
        cores: Math.floor(Math.random() * 8) + 4,
        percent: Math.round((cpuUsed / cpuTotal) * 100),
      },
      memory: {
        total: memTotal,
        used: memUsed,
        percent: Math.round((memUsed / memTotal) * 100),
      },
      uptime: `${Math.floor(Math.random() * 200) + 10}d ${Math.floor(Math.random() * 23)}h`,
      vmCount: vmCount,
      datastores: Math.floor(Math.random() * 5) + 2,
      network: {
        throughput: Math.floor(Math.random() * 1000) + 100,
        latency: Math.floor(Math.random() * 10) + 1,
      },
    };
  });

  // Generate VMs
  const vms = Array.from({ length: 25 }, (_, i) => {
    const status = vmStatuses[i % vmStatuses.length];
    const hostIndex = Math.floor(Math.random() * hosts.length);
    const diskTotal = Math.floor(Math.random() * 100) + 20;
    const diskUsed = Math.floor(Math.random() * 60) + 20;
    return {
      id: `vm-${String(i + 1).padStart(3, '0')}`,
      name: vmNames[i % vmNames.length] + (i >= vmNames.length ? `-${Math.floor(i / vmNames.length) + 1}` : ""),
      status: status,
      host: hosts[hostIndex].name,
      cpu: Math.floor(Math.random() * 8) + 1,
      cpuPercent: Math.floor(Math.random() * 60) + 20,
      memory: Math.floor(Math.random() * 16) + 2,
      memoryPercent: Math.floor(Math.random() * 70) + 20,
      disk: diskTotal,
      diskUsed: diskUsed,
      diskPercent: Math.round((diskUsed / diskTotal) * 100),
      os: ["Ubuntu 22.04", "CentOS 9", "Windows Server 2022", "Red Hat 9", "Debian 12", "AlmaLinux 9"][Math.floor(Math.random() * 6)],
      uptime: status === "poweredOn" ? `${Math.floor(Math.random() * 200) + 1}d ${Math.floor(Math.random() * 23)}h` : "Offline",
      power: status === "poweredOn" ? true : false,
      ip: `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    };
  });

  // Generate Datastores
  const datastores = Array.from({ length: 6 }, (_, i) => ({
    id: `datastore-${String(i + 1).padStart(3, '0')}`,
    name: datastoreNames[i % datastoreNames.length],
    type: ["VMFS", "NFS", "vSAN"][Math.floor(Math.random() * 3)],
    capacity: Math.floor(Math.random() * 4000) + 1000,
    used: Math.floor(Math.random() * 3000) + 500,
    percent: Math.floor(Math.random() * 70) + 20,
    vms: Math.floor(Math.random() * 15) + 3,
    host: hosts[i % hosts.length].name,
  }));

  // Generate Networks
  const networks = Array.from({ length: 5 }, (_, i) => ({
    id: `network-${String(i + 1).padStart(3, '0')}`,
    name: ["Management", "VM Network", "Storage", "vMotion", "Management"][i],
    vlan: i === 0 ? "VLAN 10" : i === 1 ? "VLAN 20" : i === 2 ? "VLAN 30" : i === 3 ? "VLAN 40" : "VLAN 50",
    subnet: `192.168.${i * 10 + 10}.0/24`,
    vms: Math.floor(Math.random() * 12) + 3,
    host: hosts[i % hosts.length].name,
  }));

  // Calculate totals
  const totalVMs = vms.length;
  const poweredOn = vms.filter(v => v.status === "poweredOn").length;
  const poweredOff = vms.filter(v => v.status === "poweredOff").length;
  const suspended = vms.filter(v => v.status === "suspended").length;
  const connectedHosts = hosts.filter(h => h.status === "connected").length;
  const totalHosts = hosts.length;
  const totalDatastores = datastores.length;
  const totalCapacity = datastores.reduce((sum, d) => sum + d.capacity, 0);
  const totalUsed = datastores.reduce((sum, d) => sum + d.used, 0);
  const storageUsedPercent = Math.round((totalUsed / totalCapacity) * 100);

  return {
    hosts: {
      total: totalHosts,
      connected: connectedHosts,
      disconnected: hosts.filter(h => h.status === "disconnected").length,
      maintenance: hosts.filter(h => h.status === "maintenance").length,
      details: hosts,
    },
    vms: {
      total: totalVMs,
      poweredOn,
      poweredOff,
      suspended,
      details: vms,
    },
    datastores: {
      total: totalDatastores,
      totalCapacity: totalCapacity,
      totalUsed: totalUsed,
      usagePercent: storageUsedPercent,
      details: datastores,
    },
    networks: {
      total: networks.length,
      details: networks,
    },
    stats: {
      cpuUsage: Math.round(10 + Math.random() * 50),
      memoryUsage: Math.round(20 + Math.random() * 50),
      storageUsage: storageUsedPercent,
    }
  };
};

export default function VMwarePage() {
  const [vmwareData, setVmwareData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [view, setView] = useState("overview");
  const [hostStatusFilter, setHostStatusFilter] = useState("all");
  const [vmStatusFilter, setVmStatusFilter] = useState("all");
  const [expandedSections, setExpandedSections] = useState({
    hosts: true,
    vms: true,
    datastores: true,
    networks: true,
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(false), 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = (showToast = true) => {
    setIsRefreshing(true);
    setLoading(true);
    setTimeout(() => {
      const data = generateVMwareData();
      setVmwareData(data);
      setLoading(false);
      setIsRefreshing(false);
      if (showToast) toast.success("VMware data updated");
    }, 800);
  };

  const filteredData = useMemo(() => {
    if (!vmwareData) return null;

    let filteredHosts = [...vmwareData.hosts.details];
    let filteredVMs = [...vmwareData.vms.details];

    if (hostStatusFilter !== "all") {
      filteredHosts = filteredHosts.filter(h => h.status === hostStatusFilter);
    }

    if (vmStatusFilter !== "all") {
      filteredVMs = filteredVMs.filter(v => v.status === vmStatusFilter);
    }

    if (search.trim()) {
      const term = search.toLowerCase();
      filteredHosts = filteredHosts.filter(h => 
        h.name.toLowerCase().includes(term)
      );
      filteredVMs = filteredVMs.filter(v => 
        v.name.toLowerCase().includes(term) || 
        v.host.toLowerCase().includes(term) ||
        v.os.toLowerCase().includes(term)
      );
    }

    return {
      hosts: {
        ...vmwareData.hosts,
        details: filteredHosts,
      },
      vms: {
        ...vmwareData.vms,
        details: filteredVMs,
      },
      datastores: vmwareData.datastores,
      networks: vmwareData.networks,
      stats: vmwareData.stats,
    };
  }, [vmwareData, hostStatusFilter, vmStatusFilter, search]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getStatusText = (status) => {
    const statusMap = {
      'connected': 'Connected',
      'disconnected': 'Disconnected',
      'maintenance': 'Maintenance',
      'poweredOn': 'Powered On',
      'poweredOff': 'Powered Off',
      'suspended': 'Suspended'
    };
    return statusMap[status] || status;
  };

  const getStatusIcon = (status) => {
    if (status === "connected" || status === "poweredOn") 
      return <CheckCircle size={16} className="text-[var(--color-text)]" />;
    if (status === "maintenance" || status === "suspended") 
      return <AlertCircle size={16} className="text-[var(--color-text)]" />;
    if (status === "disconnected" || status === "poweredOff") 
      return <XCircle size={16} className="text-[var(--color-text)]" />;
    return null;
  };

  const formatStorage = (gb) => {
    if (gb >= 1000) {
      return `${(gb / 1000).toFixed(1)} TB`;
    }
    return `${gb} GB`;
  };

  if (loading && !vmwareData) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size={48} />
      </div>
    );
  }

  if (!vmwareData || !filteredData) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)] flex items-center gap-2">
            <ServerIcon size={28} className="text-[var(--color-text)]" />
            VMware
          </h1>
          <p className="text-[var(--color-muted)] text-sm mt-1">
            Virtual Infrastructure • {filteredData.hosts.connected} connected hosts • {filteredData.vms.poweredOn} powered on VMs
          </p>
        </div>
        <div className="flex items-center gap-2">
          <StatusDot state={filteredData.hosts.connected > 0 ? "up" : "down"} size="md" />
          <span className="text-sm text-[var(--color-text)]">
            {filteredData.hosts.connected > 0 ? "Operational" : "No hosts connected"}
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
            Add Host
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">Hosts</p>
              <p className="text-2xl font-bold text-[var(--color-text)] mt-1">
                {vmwareData.hosts.total}
              </p>
            </div>
            <ServerIcon size={24} className="text-[var(--color-muted)]" />
          </div>
          <div className="mt-2 flex flex-wrap gap-3 text-xs">
            <span className="text-[var(--color-text)]">Connected: {vmwareData.hosts.connected}</span>
            <span className="text-[var(--color-text)]">Disconnected: {vmwareData.hosts.disconnected}</span>
          </div>
        </div>

        <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">Virtual Machines</p>
              <p className="text-2xl font-bold text-[var(--color-text)] mt-1">
                {vmwareData.vms.total}
              </p>
            </div>
            <Monitor size={24} className="text-[var(--color-muted)]" />
          </div>
          <div className="mt-2 flex flex-wrap gap-3 text-xs">
            <span className="text-[var(--color-text)]">Powered On: {vmwareData.vms.poweredOn}</span>
            <span className="text-[var(--color-text)]">Powered Off: {vmwareData.vms.poweredOff}</span>
          </div>
        </div>

        <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">Datastores</p>
              <p className="text-2xl font-bold text-[var(--color-text)] mt-1">
                {vmwareData.datastores.total}
              </p>
            </div>
            <HardDriveIcon size={24} className="text-[var(--color-muted)]" />
          </div>
          <div className="mt-2 flex flex-wrap gap-3 text-xs">
            <span className="text-[var(--color-text)]">Capacity: {formatStorage(vmwareData.datastores.totalCapacity)}</span>
          </div>
        </div>

        <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">Storage Used</p>
              <p className="text-2xl font-bold text-[var(--color-text)] mt-1">
                {vmwareData.datastores.usagePercent}%
              </p>
            </div>
            <Database size={24} className="text-[var(--color-muted)]" />
          </div>
          <div className="mt-2 w-full h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-[var(--color-text)]"
              style={{
                width: `${vmwareData.datastores.usagePercent}%`,
                opacity: vmwareData.datastores.usagePercent > 80 ? 0.8 : vmwareData.datastores.usagePercent > 60 ? 0.6 : 0.3
              }}
            />
          </div>
        </div>

        <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">Networks</p>
              <p className="text-2xl font-bold text-[var(--color-text)] mt-1">
                {vmwareData.networks.total}
              </p>
            </div>
            <Network size={24} className="text-[var(--color-muted)]" />
          </div>
        </div>

        <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">Resources</p>
              <div className="mt-1 space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <CpuIcon size={12} className="text-[var(--color-muted)]" />
                  <span className="text-[var(--color-text)]">{vmwareData.stats.cpuUsage}%</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <MemoryStick size={12} className="text-[var(--color-muted)]" />
                  <span className="text-[var(--color-text)]">{vmwareData.stats.memoryUsage}%</span>
                </div>
              </div>
            </div>
            <Activity size={24} className="text-[var(--color-muted)]" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-[var(--color-muted)] mr-2">Hosts:</span>
          <button
            onClick={() => setHostStatusFilter("all")}
            className={`px-3 py-1.5 text-sm rounded-lg transition ${
              hostStatusFilter === "all"
                ? "bg-[var(--color-accent)] text-[#06222A] font-medium"
                : "bg-transparent text-[var(--color-muted)] border border-[var(--color-border)] hover:border-[var(--color-text)]"
            }`}
          >
            All ({vmwareData.hosts.total})
          </button>
          <button
            onClick={() => setHostStatusFilter("connected")}
            className={`px-3 py-1.5 text-sm rounded-lg transition ${
              hostStatusFilter === "connected"
                ? "bg-[var(--color-accent)] text-[#06222A] font-medium"
                : "bg-transparent text-[var(--color-muted)] border border-[var(--color-border)] hover:border-[var(--color-text)]"
            }`}
          >
            Connected ({vmwareData.hosts.connected})
          </button>
          <button
            onClick={() => setHostStatusFilter("disconnected")}
            className={`px-3 py-1.5 text-sm rounded-lg transition ${
              hostStatusFilter === "disconnected"
                ? "bg-[var(--color-accent)] text-[#06222A] font-medium"
                : "bg-transparent text-[var(--color-muted)] border border-[var(--color-border)] hover:border-[var(--color-text)]"
            }`}
          >
            Disconnected ({vmwareData.hosts.disconnected})
          </button>
          <button
            onClick={() => setHostStatusFilter("maintenance")}
            className={`px-3 py-1.5 text-sm rounded-lg transition ${
              hostStatusFilter === "maintenance"
                ? "bg-[var(--color-accent)] text-[#06222A] font-medium"
                : "bg-transparent text-[var(--color-muted)] border border-[var(--color-border)] hover:border-[var(--color-text)]"
            }`}
          >
            Maintenance ({vmwareData.hosts.maintenance})
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-[var(--color-muted)] mr-2">VMs:</span>
          <button
            onClick={() => setVmStatusFilter("all")}
            className={`px-3 py-1.5 text-sm rounded-lg transition ${
              vmStatusFilter === "all"
                ? "bg-[var(--color-accent)] text-[#06222A] font-medium"
                : "bg-transparent text-[var(--color-muted)] border border-[var(--color-border)] hover:border-[var(--color-text)]"
            }`}
          >
            All ({vmwareData.vms.total})
          </button>
          <button
            onClick={() => setVmStatusFilter("poweredOn")}
            className={`px-3 py-1.5 text-sm rounded-lg transition ${
              vmStatusFilter === "poweredOn"
                ? "bg-[var(--color-accent)] text-[#06222A] font-medium"
                : "bg-transparent text-[var(--color-muted)] border border-[var(--color-border)] hover:border-[var(--color-text)]"
            }`}
          >
            Powered On ({vmwareData.vms.poweredOn})
          </button>
          <button
            onClick={() => setVmStatusFilter("poweredOff")}
            className={`px-3 py-1.5 text-sm rounded-lg transition ${
              vmStatusFilter === "poweredOff"
                ? "bg-[var(--color-accent)] text-[#06222A] font-medium"
                : "bg-transparent text-[var(--color-muted)] border border-[var(--color-border)] hover:border-[var(--color-text)]"
            }`}
          >
            Powered Off ({vmwareData.vms.poweredOff})
          </button>
          <button
            onClick={() => setVmStatusFilter("suspended")}
            className={`px-3 py-1.5 text-sm rounded-lg transition ${
              vmStatusFilter === "suspended"
                ? "bg-[var(--color-accent)] text-[#06222A] font-medium"
                : "bg-transparent text-[var(--color-muted)] border border-[var(--color-border)] hover:border-[var(--color-text)]"
            }`}
          >
            Suspended ({vmwareData.vms.suspended})
          </button>
        </div>

        <div className="flex items-center gap-2 w-full">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-faint)]" />
            <input
              type="text"
              placeholder="Search hosts, VMs, datastores..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition"
            />
          </div>
          <div className="flex items-center gap-1">
            {["overview", "hosts", "vms", "datastores", "networks"].map((v) => (
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
        {/* Hosts Section with Gauge Charts */}
        {(view === "overview" || view === "hosts") && (
          <Card className="overflow-hidden">
            <div 
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-[var(--color-border)]/10 transition"
              onClick={() => toggleSection('hosts')}
            >
              <div className="flex items-center gap-3">
                {expandedSections.hosts ? <ChevronDown size={20} className="text-[var(--color-muted)]" /> : <ChevronRight size={20} className="text-[var(--color-muted)]" />}
                <ServerIcon size={20} className="text-[var(--color-muted)]" />
                <h3 className="font-semibold text-[var(--color-text)]">Hosts</h3>
                <span className="text-xs text-[var(--color-muted)]">
                  {filteredData.hosts.details.length} of {vmwareData.hosts.total}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-[var(--color-text)]">{filteredData.hosts.connected} Connected</span>
                <span className="text-[var(--color-text)]">{filteredData.hosts.disconnected} Disconnected</span>
                <span className="text-[var(--color-text)]">{filteredData.hosts.maintenance} Maintenance</span>
              </div>
            </div>
            {expandedSections.hosts && (
              <div className="p-4 border-t border-[var(--color-border)]">
                {filteredData.hosts.details.length === 0 ? (
                  <div className="text-center py-8 text-[var(--color-muted)]">
                    No hosts match your filters.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredData.hosts.details.map((host) => (
                      <div 
                        key={host.id}
                        className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg p-4 hover:border-[var(--color-accent)] transition-all cursor-pointer"
                        onClick={() => { setSelectedItem(host); setSelectedType("host"); }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(host.status)}
                              <span className="font-medium text-[var(--color-text)] truncate">{host.name}</span>
                            </div>
                            <div className="text-xs text-[var(--color-muted)] mt-1">{host.version}</div>
                          </div>
                          <span className="text-xs px-2 py-0.5 rounded-full border border-[var(--color-border)] text-[var(--color-text)]">
                            {getStatusText(host.status)}
                          </span>
                        </div>

                        {/* Gauge Charts for CPU and Memory */}
                        <div className="mt-3 flex items-center justify-around">
                          <MiniGauge value={host.cpu.percent} label="CPU" size={70} />
                          <MiniGauge value={host.memory.percent} label="MEM" size={70} />
                        </div>

                        <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                          <div className="border border-[var(--color-border)] rounded p-1.5 text-center">
                            <span className="text-[var(--color-faint)]">VMs</span>
                            <div className="text-[var(--color-text)] font-medium">{host.vmCount}</div>
                          </div>
                          <div className="border border-[var(--color-border)] rounded p-1.5 text-center">
                            <span className="text-[var(--color-faint)]">Uptime</span>
                            <div className="text-[var(--color-text)] font-medium text-[10px]">{host.uptime}</div>
                          </div>
                        </div>

                        <div className="mt-2 pt-2 border-t border-[var(--color-border)] flex items-center justify-between text-xs">
                          <span className="text-[var(--color-faint)]">Datastores: {host.datastores}</span>
                          <span className="text-[var(--color-faint)]">Network: {host.network.throughput} Mbps</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Card>
        )}

        {/* VMs Section with Gauge Charts */}
        {(view === "overview" || view === "vms") && (
          <Card className="overflow-hidden">
            <div 
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-[var(--color-border)]/10 transition"
              onClick={() => toggleSection('vms')}
            >
              <div className="flex items-center gap-3">
                {expandedSections.vms ? <ChevronDown size={20} className="text-[var(--color-muted)]" /> : <ChevronRight size={20} className="text-[var(--color-muted)]" />}
                <Monitor size={20} className="text-[var(--color-muted)]" />
                <h3 className="font-semibold text-[var(--color-text)]">Virtual Machines</h3>
                <span className="text-xs text-[var(--color-muted)]">
                  {filteredData.vms.details.length} of {vmwareData.vms.total}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-[var(--color-text)]">{filteredData.vms.poweredOn} Powered On</span>
                <span className="text-[var(--color-text)]">{filteredData.vms.poweredOff} Powered Off</span>
                <span className="text-[var(--color-text)]">{filteredData.vms.suspended} Suspended</span>
              </div>
            </div>
            {expandedSections.vms && (
              <div className="p-4 border-t border-[var(--color-border)]">
                {filteredData.vms.details.length === 0 ? (
                  <div className="text-center py-8 text-[var(--color-muted)]">
                    No VMs match your filters.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredData.vms.details.map((vm) => (
                      <div 
                        key={vm.id}
                        className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg p-4 hover:border-[var(--color-accent)] transition-all cursor-pointer"
                        onClick={() => { setSelectedItem(vm); setSelectedType("vm"); }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(vm.status)}
                              <span className="font-medium text-[var(--color-text)] truncate">{vm.name}</span>
                            </div>
                            <div className="text-xs text-[var(--color-muted)] mt-1">{vm.os}</div>
                            <div className="text-xs text-[var(--color-faint)] mt-0.5">{vm.ip}</div>
                          </div>
                          <span className="text-xs px-2 py-0.5 rounded-full border border-[var(--color-border)] text-[var(--color-text)]">
                            {getStatusText(vm.status)}
                          </span>
                        </div>

                        {/* Gauge Chart for CPU */}
                        <div className="mt-3 flex items-center justify-around">
                          <GaugeChart value={vm.cpuPercent} label="CPU" size={80} />
                          <GaugeChart value={vm.memoryPercent} label="MEM" size={80} />
                          <GaugeChart value={vm.diskPercent} label="DISK" size={80} />
                        </div>

                        <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                          <div className="border border-[var(--color-border)] rounded p-1.5 text-center">
                            <span className="text-[var(--color-faint)]">Host</span>
                            <div className="text-[var(--color-text)] truncate text-[10px]">{vm.host}</div>
                          </div>
                          <div className="border border-[var(--color-border)] rounded p-1.5 text-center">
                            <span className="text-[var(--color-faint)]">Uptime</span>
                            <div className="text-[var(--color-text)] text-[10px]">{vm.uptime}</div>
                          </div>
                        </div>

                        <div className="mt-2 pt-2 border-t border-[var(--color-border)] flex items-center justify-between text-xs">
                          <span className="text-[var(--color-faint)]">vCPUs: {vm.cpu}</span>
                          <span className="text-[var(--color-faint)]">Memory: {vm.memory} GB</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Card>
        )}

        {/* Datastores Section with Bar Graphs */}
        {(view === "overview" || view === "datastores") && (
          <Card className="overflow-hidden">
            <div 
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-[var(--color-border)]/10 transition"
              onClick={() => toggleSection('datastores')}
            >
              <div className="flex items-center gap-3">
                {expandedSections.datastores ? <ChevronDown size={20} className="text-[var(--color-muted)]" /> : <ChevronRight size={20} className="text-[var(--color-muted)]" />}
                <HardDriveIcon size={20} className="text-[var(--color-muted)]" />
                <h3 className="font-semibold text-[var(--color-text)]">Datastores</h3>
                <span className="text-xs text-[var(--color-muted)]">
                  {vmwareData.datastores.details.length}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-[var(--color-text)]">Total: {formatStorage(vmwareData.datastores.totalCapacity)}</span>
                <span className="text-[var(--color-text)]">Used: {formatStorage(vmwareData.datastores.totalUsed)}</span>
              </div>
            </div>
            {expandedSections.datastores && (
              <div className="p-4 border-t border-[var(--color-border)] overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[var(--color-faint)] border-b border-[var(--color-border)]">
                      <th className="pb-2 font-medium">Name</th>
                      <th className="pb-2 font-medium">Type</th>
                      <th className="pb-2 font-medium">Capacity</th>
                      <th className="pb-2 font-medium">Used</th>
                      <th className="pb-2 font-medium">Usage</th>
                      <th className="pb-2 font-medium">VMs</th>
                      <th className="pb-2 font-medium">Host</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vmwareData.datastores.details.map((ds) => (
                      <tr key={ds.id} className="border-b border-[var(--color-border)] last:border-0">
                        <td className="py-2 text-[var(--color-text)] font-medium">{ds.name}</td>
                        <td className="py-2 text-[var(--color-muted)]">{ds.type}</td>
                        <td className="py-2 text-[var(--color-muted)]">{formatStorage(ds.capacity)}</td>
                        <td className="py-2 text-[var(--color-muted)]">{formatStorage(ds.used)}</td>
                        <td className="py-2">
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full bg-[var(--color-text)]"
                                style={{
                                  width: `${ds.percent}%`,
                                  opacity: ds.percent > 80 ? 0.8 : ds.percent > 60 ? 0.6 : 0.3
                                }}
                              />
                            </div>
                            <span className="text-[var(--color-text)] text-xs">{ds.percent}%</span>
                          </div>
                        </td>
                        <td className="py-2 text-[var(--color-muted)]">{ds.vms}</td>
                        <td className="py-2 text-[var(--color-muted)] truncate">{ds.host}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}

        {/* Networks Section */}
        {(view === "overview" || view === "networks") && (
          <Card className="overflow-hidden">
            <div 
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-[var(--color-border)]/10 transition"
              onClick={() => toggleSection('networks')}
            >
              <div className="flex items-center gap-3">
                {expandedSections.networks ? <ChevronDown size={20} className="text-[var(--color-muted)]" /> : <ChevronRight size={20} className="text-[var(--color-muted)]" />}
                <Network size={20} className="text-[var(--color-muted)]" />
                <h3 className="font-semibold text-[var(--color-text)]">Networks</h3>
                <span className="text-xs text-[var(--color-muted)]">
                  {vmwareData.networks.details.length}
                </span>
              </div>
            </div>
            {expandedSections.networks && (
              <div className="p-4 border-t border-[var(--color-border)] overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[var(--color-faint)] border-b border-[var(--color-border)]">
                      <th className="pb-2 font-medium">Name</th>
                      <th className="pb-2 font-medium">VLAN</th>
                      <th className="pb-2 font-medium">Subnet</th>
                      <th className="pb-2 font-medium">VMs</th>
                      <th className="pb-2 font-medium">Host</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vmwareData.networks.details.map((net) => (
                      <tr key={net.id} className="border-b border-[var(--color-border)] last:border-0">
                        <td className="py-2 text-[var(--color-text)] font-medium">{net.name}</td>
                        <td className="py-2 text-[var(--color-muted)]">{net.vlan}</td>
                        <td className="py-2 text-[var(--color-muted)] font-mono text-xs">{net.subnet}</td>
                        <td className="py-2 text-[var(--color-muted)]">{net.vms}</td>
                        <td className="py-2 text-[var(--color-muted)] truncate">{net.host}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}
      </div>

      {/* Detail Modal with Full Gauge Charts */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => { setSelectedItem(null); setSelectedType(null); }}>
          <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(selectedItem.status)}
                  <h3 className="text-xl font-bold text-[var(--color-text)]">{selectedItem.name}</h3>
                </div>
                <p className="text-sm text-[var(--color-muted)] capitalize">{selectedType}: {selectedItem.id}</p>
              </div>
              <button onClick={() => { setSelectedItem(null); setSelectedType(null); }} className="text-[var(--color-muted)] hover:text-[var(--color-text)] transition">
                <XCircle size={24} />
              </button>
            </div>

            {selectedType === "host" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[var(--color-bg)] p-3 rounded-lg border border-[var(--color-border)]">
                    <p className="text-xs text-[var(--color-faint)]">Version</p>
                    <p className="text-[var(--color-text)]">{selectedItem.version}</p>
                  </div>
                  <div className="bg-[var(--color-bg)] p-3 rounded-lg border border-[var(--color-border)]">
                    <p className="text-xs text-[var(--color-faint)]">Status</p>
                    <p className="text-[var(--color-text)]">{getStatusText(selectedItem.status)}</p>
                  </div>
                  <div className="bg-[var(--color-bg)] p-3 rounded-lg border border-[var(--color-border)]">
                    <p className="text-xs text-[var(--color-faint)]">Uptime</p>
                    <p className="text-[var(--color-text)]">{selectedItem.uptime}</p>
                  </div>
                  <div className="bg-[var(--color-bg)] p-3 rounded-lg border border-[var(--color-border)]">
                    <p className="text-xs text-[var(--color-faint)]">VMs</p>
                    <p className="text-[var(--color-text)]">{selectedItem.vmCount}</p>
                  </div>
                </div>

                <div className="bg-[var(--color-bg)] p-4 rounded-lg border border-[var(--color-border)]">
                  <p className="text-xs text-[var(--color-faint)] mb-3 text-center">Resource Usage</p>
                  <div className="flex items-center justify-around">
                    <div className="text-center">
                      <GaugeChart value={selectedItem.cpu.percent} label="CPU" size={120} />
                      <p className="text-xs text-[var(--color-muted)] mt-1">{selectedItem.cpu.used}/{selectedItem.cpu.total} cores</p>
                    </div>
                    <div className="text-center">
                      <GaugeChart value={selectedItem.memory.percent} label="MEMORY" size={120} />
                      <p className="text-xs text-[var(--color-muted)] mt-1">{selectedItem.memory.used}/{selectedItem.memory.total} GB</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedType === "vm" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[var(--color-bg)] p-3 rounded-lg border border-[var(--color-border)]">
                    <p className="text-xs text-[var(--color-faint)]">OS</p>
                    <p className="text-[var(--color-text)]">{selectedItem.os}</p>
                  </div>
                  <div className="bg-[var(--color-bg)] p-3 rounded-lg border border-[var(--color-border)]">
                    <p className="text-xs text-[var(--color-faint)]">Status</p>
                    <p className="text-[var(--color-text)]">{getStatusText(selectedItem.status)}</p>
                  </div>
                  <div className="bg-[var(--color-bg)] p-3 rounded-lg border border-[var(--color-border)]">
                    <p className="text-xs text-[var(--color-faint)]">IP Address</p>
                    <p className="text-[var(--color-text)] font-mono">{selectedItem.ip}</p>
                  </div>
                  <div className="bg-[var(--color-bg)] p-3 rounded-lg border border-[var(--color-border)]">
                    <p className="text-xs text-[var(--color-faint)]">Host</p>
                    <p className="text-[var(--color-text)]">{selectedItem.host}</p>
                  </div>
                </div>

                <div className="bg-[var(--color-bg)] p-4 rounded-lg border border-[var(--color-border)]">
                  <p className="text-xs text-[var(--color-faint)] mb-3 text-center">Resource Usage</p>
                  <div className="flex items-center justify-around">
                    <div className="text-center">
                      <GaugeChart value={selectedItem.cpuPercent} label="CPU" size={100} />
                      <p className="text-xs text-[var(--color-muted)] mt-1">{selectedItem.cpu} vCPUs</p>
                    </div>
                    <div className="text-center">
                      <GaugeChart value={selectedItem.memoryPercent} label="MEMORY" size={100} />
                      <p className="text-xs text-[var(--color-muted)] mt-1">{selectedItem.memory} GB</p>
                    </div>
                    <div className="text-center">
                      <GaugeChart value={selectedItem.diskPercent} label="DISK" size={100} />
                      <p className="text-xs text-[var(--color-muted)] mt-1">{selectedItem.disk} GB</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 flex items-center gap-2">
              <button 
                className="px-4 py-2 bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-80 transition"
                onClick={() => toast.success(`Action performed on ${selectedItem.name}`)}
              >
                {selectedType === "host" ? "Connect" : "Power On"}
              </button>
              <button 
                className="px-4 py-2 bg-[var(--color-crit)] text-white font-semibold rounded-lg hover:opacity-80 transition"
                onClick={() => toast.success(`Action performed on ${selectedItem.name}`)}
              >
                {selectedType === "host" ? "Disconnect" : "Power Off"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}