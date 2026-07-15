// src/pages/ServersPage.jsx
import { useState, useEffect, useRef } from "react";
import { 
  Search, RefreshCw, Plus, Server, HardDrive, Cpu, 
  Activity, ChevronDown, ChevronRight, Filter, 
  MoreVertical, Eye, Edit, Trash2, Power, 
  Play, Square, AlertCircle, CheckCircle, XCircle,
  Clock, Database, Network, Globe, Wifi, Zap,
  ChevronLeft, ChevronRight as ChevronRightIcon,
  Maximize2, Minimize2, Info, ExternalLink,
  Monitor, Cloud, FolderOpen, GitBranch, Terminal,
  MemoryStick, Users, Settings, Bell, Package,
  Layers, Grid, List, ArrowUp, ArrowDown,
  FileText, Clipboard, BookOpen, Link2, Download,
  X
} from "lucide-react";
import { toast } from "react-hot-toast";
import Card from "../components/common/Card";
import StatusDot from "../components/common/StatusDot";
import LoadingSpinner from "../components/common/LoadingSpinner";

// Helper functions for status
const getStatusColor = (status) => {
  if (status === "up" || status === "healthy") return "text-[var(--color-ok)]";
  if (status === "warning") return "text-[var(--color-warn)]";
  return "text-[var(--color-crit)]";
};

const getStatusText = (status) => {
  if (status === "up" || status === "healthy") return "Healthy";
  if (status === "warning") return "Warning";
  if (status === "down" || status === "critical") return "Critical";
  return status;
};

// Generate mock application data
const generateApplications = () => {
  const appTemplates = [
    "Microsoft Windows Server 2012-2012 R2 Failover Cluster",
    "MySQL 8.0 Metrics for Windows",
    "SolarWinds Agent (Windows)",
    "Microsoft SQL Server",
    "IIS Web Server",
    "Active Directory Domain Services",
    "Exchange Server",
    "SharePoint Server",
    "System Center Operations Manager",
    "VMware vCenter"
  ];

  const nodeNames = [
    "NOCAPPSQL02V", "NOCDPA01v", "NOCEADDC01v", "NOCEADDC02v", 
    "NOCFILE01V", "NOCMIRROR01V", "EASTEXCH02v", "EASTFILE01v",
    "EASTMYSQL02v", "LOSAADDC01v", "dev-aus-lali-02", "AZSHPWEB01v",
    "AZSHPWEB02v", "EASTADDC01v", "EASTAGENT02v"
  ];

  const statuses = ["up", "up", "up", "up", "warning", "warning", "down"];
  const healthStatuses = ["Healthy", "Healthy", "Healthy", "Warning", "Critical", "Unknown"];
  const cpuLoads = ["1%", "2%", "3%", "5%", "8%", "10%", "15%", "20%", "25%"];
  const memoryUsages = ["37%", "45%", "52%", "61%", "73%", "82%", "89%", "94%"];

  const applications = [];
  
  for (let i = 0; i < 25; i++) {
    const template = appTemplates[i % appTemplates.length];
    const node = nodeNames[i % nodeNames.length];
    const status = statuses[i % statuses.length];
    const health = healthStatuses[i % healthStatuses.length];
    const cpu = cpuLoads[i % cpuLoads.length];
    const memory = memoryUsages[i % memoryUsages.length];
    
    applications.push({
      id: `app-${String(i + 1).padStart(3, '0')}`,
      name: `${template} on ${node}`,
      template: template,
      nodeName: node,
      status: status,
      health: health,
      cpu: cpu,
      memory: memory,
      uptime: `${Math.floor(Math.random() * 365)}d ${Math.floor(Math.random() * 23)}h`,
      components: Math.floor(Math.random() * 8) + 3,
      componentsWithProblems: Math.floor(Math.random() * 3),
      alerts: Math.floor(Math.random() * 5),
      activeAlerts: Math.floor(Math.random() * 3),
      lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 3600000)).toLocaleString(),
      ip: `10.1.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      os: ["Windows Server 2016", "Windows Server 2019", "Ubuntu 22.04", "CentOS 9"][Math.floor(Math.random() * 4)],
      location: ["EAST", "WEST", "NORTH", "SOUTH", "CENTRAL"][Math.floor(Math.random() * 5)],
      environment: ["Production", "Staging", "Development"][Math.floor(Math.random() * 3)],
      group: ["Group A", "Group B", "Group C", "Group D"][Math.floor(Math.random() * 4)],
    });
  }
  
  return applications;
};

// Add Application Modal Component
const AddApplicationModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    nodeName: "",
    template: "",
    applicationName: "",
    status: "up",
    cpu: "1%",
    memory: "20%",
    ip: "",
    os: "Windows Server 2016",
    environment: "Production",
    components: 5,
    alerts: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate form
    if (!formData.nodeName || !formData.template || !formData.applicationName) {
      toast.error("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    // Create new application object
    const newApp = {
      id: `app-${Date.now()}`,
      name: `${formData.template} on ${formData.nodeName}`,
      template: formData.template,
      nodeName: formData.nodeName,
      status: formData.status,
      health: formData.status === "up" ? "Healthy" : formData.status === "warning" ? "Warning" : "Critical",
      cpu: formData.cpu,
      memory: formData.memory,
      ip: formData.ip || `10.1.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      os: formData.os,
      environment: formData.environment,
      components: formData.components,
      componentsWithProblems: 0,
      alerts: formData.alerts || 0,
      activeAlerts: 0,
      uptime: "0d 0h",
      lastUpdated: new Date().toLocaleString(),
      location: "EAST",
      group: "Group A",
    };

    setTimeout(() => {
      onAdd(newApp);
      setIsSubmitting(false);
      onClose();
      toast.success(`Server "${formData.applicationName}" added successfully!`);
    }, 800);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center">
              <Plus size={20} className="text-[var(--color-accent)]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[var(--color-text)]">Add Server</h3>
              <p className="text-xs text-[var(--color-muted)]">Fill in the details to add a new application</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[var(--color-border)]/10 transition text-[var(--color-muted)] hover:text-[var(--color-text)]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="space-y-4">
            {/* Node Name */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                Node Name <span className="text-[var(--color-crit)]">*</span>
              </label>
              <input
                type="text"
                name="nodeName"
                value={formData.nodeName}
                onChange={handleChange}
                placeholder="e.g., NOCAPPSQL02V"
                className="w-full px-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition"
                required
              />
            </div>

            {/* Application Template */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                Server Template <span className="text-[var(--color-crit)]">*</span>
              </label>
              <select
                name="template"
                value={formData.template}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition"
                required
              >
                <option value="">Select template...</option>
                <option value="Microsoft Windows Server 2012-2012 R2 Failover Cluster">Microsoft Windows Server 2012-2012 R2 Failover Cluster</option>
                <option value="MySQL 8.0 Metrics for Windows">MySQL 8.0 Metrics for Windows</option>
                <option value="SolarWinds Agent (Windows)">SolarWinds Agent (Windows)</option>
                <option value="Microsoft SQL Server">Microsoft SQL Server</option>
                <option value="IIS Web Server">IIS Web Server</option>
                <option value="Active Directory Domain Services">Active Directory Domain Services</option>
                <option value="Exchange Server">Exchange Server</option>
                <option value="SharePoint Server">SharePoint Server</option>
                <option value="System Center Operations Manager">System Center Operations Manager</option>
                <option value="VMware vCenter">VMware vCenter</option>
              </select>
            </div>

            {/* Application Name */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                Server Name <span className="text-[var(--color-crit)]">*</span>
              </label>
              <input
                type="text"
                name="applicationName"
                value={formData.applicationName}
                onChange={handleChange}
                placeholder="e.g., Web Server Server"
                className="w-full px-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition"
                required
              />
            </div>

            {/* Status and Resources - Two columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition"
                >
                  <option value="up">Up / Healthy</option>
                  <option value="warning">Warning</option>
                  <option value="down">Down / Critical</option>
                </select>
              </div>

              {/* CPU */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                  CPU Load
                </label>
                <input
                  type="text"
                  name="cpu"
                  value={formData.cpu}
                  onChange={handleChange}
                  placeholder="e.g., 5%"
                  className="w-full px-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Memory and Components - Two columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                  Memory Usage
                </label>
                <input
                  type="text"
                  name="memory"
                  value={formData.memory}
                  onChange={handleChange}
                  placeholder="e.g., 45%"
                  className="w-full px-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                  Number of Components
                </label>
                <input
                  type="number"
                  name="components"
                  value={formData.components}
                  onChange={handleChange}
                  min="1"
                  max="20"
                  className="w-full px-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition"
                />
              </div>
            </div>

            {/* IP and OS - Two columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                  IP Address
                </label>
                <input
                  type="text"
                  name="ip"
                  value={formData.ip}
                  onChange={handleChange}
                  placeholder="e.g., 10.1.40.39"
                  className="w-full px-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                  Operating System
                </label>
                <select
                  name="os"
                  value={formData.os}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition"
                >
                  <option value="Windows Server 2016">Windows Server 2016</option>
                  <option value="Windows Server 2019">Windows Server 2019</option>
                  <option value="Windows Server 2022">Windows Server 2022</option>
                  <option value="Ubuntu 22.04">Ubuntu 22.04</option>
                  <option value="CentOS 9">CentOS 9</option>
                  <option value="Red Hat 8">Red Hat 8</option>
                  <option value="AlmaLinux 9">AlmaLinux 9</option>
                </select>
              </div>
            </div>

            {/* Environment and Alerts - Two columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                  Environment
                </label>
                <select
                  name="environment"
                  value={formData.environment}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition"
                >
                  <option value="Production">Production</option>
                  <option value="Staging">Staging</option>
                  <option value="Development">Development</option>
                  <option value="Testing">Testing</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                  Initial Alerts
                </label>
                <input
                  type="number"
                  name="alerts"
                  value={formData.alerts}
                  onChange={handleChange}
                  min="0"
                  max="10"
                  className="w-full px-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[var(--color-border)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-border)]/10 transition text-[var(--color-muted)] hover:text-[var(--color-text)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 text-sm bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90 transition shadow-lg shadow-[var(--color-accent)]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size={16} />
                  Adding...
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Add Server
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Drill Down Modal Component
const DrillDownModal = ({ isOpen, onClose, application }) => {
  if (!isOpen || !application) return null;

  const [drillLevel, setDrillLevel] = useState(0);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [showCommands, setShowCommands] = useState(false);

  const getDrillData = (level) => {
    if (level === 0) {
      return {
        title: application.name,
        items: [
          { name: "Microsoft Windows Server 2012-2012 R2 Failover Cluster", type: "template", status: "up" },
          { name: "Resource Control Manager: Groups Online", type: "component", status: "up" },
          { name: "Physical Disk", type: "component", status: "up" },
          { name: "Network Name", type: "component", status: "warning" },
          { name: "File Share", type: "component", status: "up" },
        ]
      };
    } else if (level === 1) {
      return {
        title: "Components with Problems",
        items: [
          { name: "Network Name: Failed to connect", type: "problem", status: "down" },
          { name: "IP Address: Conflict detected", type: "problem", status: "warning" },
        ]
      };
    } else {
      return {
        title: "Detailed View",
        items: [
          { name: "Network Name Configuration", type: "detail", status: "info" },
          { name: "IP Address Settings", type: "detail", status: "info" },
          { name: "Resource Dependencies", type: "detail", status: "info" },
        ]
      };
    }
  };

  const drillData = getDrillData(drillLevel);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center">
              <Server size={20} className="text-[var(--color-accent)]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[var(--color-text)]">
                {application.nodeName}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-[var(--color-muted)]">{application.template}</span>
                <span className="text-xs text-[var(--color-muted)]">•</span>
                <span className={`text-xs font-medium ${getStatusColor(application.status)}`}>
                  {getStatusText(application.status)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {drillLevel > 0 && (
              <button
                onClick={() => setDrillLevel(drillLevel - 1)}
                className="px-3 py-1.5 text-sm border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-border)]/10 transition text-[var(--color-muted)] hover:text-[var(--color-text)] flex items-center gap-1"
              >
                <ChevronLeft size={16} />
                Back
              </button>
            )}
            <button
              onClick={() => setShowCommands(!showCommands)}
              className="px-3 py-1.5 text-sm border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-border)]/10 transition text-[var(--color-muted)] hover:text-[var(--color-text)] flex items-center gap-1"
            >
              <MoreVertical size={14} />
              COMMANDS {showCommands ? '▲' : '▼'}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-[var(--color-border)]/10 transition text-[var(--color-muted)] hover:text-[var(--color-text)]"
            >
              <XCircle size={20} />
            </button>
          </div>
        </div>

        {/* Commands Dropdown */}
        {showCommands && (
          <div className="p-3 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
            <div className="flex flex-wrap gap-2">
              <button className="px-3 py-1.5 text-sm bg-[var(--color-accent)]/10 text-[var(--color-accent)] rounded-lg hover:bg-[var(--color-accent)]/20 transition">
                Edit
              </button>
              <button className="px-3 py-1.5 text-sm border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-border)]/10 transition text-[var(--color-muted)]">
                Restart
              </button>
              <button className="px-3 py-1.5 text-sm border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-border)]/10 transition text-[var(--color-muted)]">
                Stop
              </button>
              <button className="px-3 py-1.5 text-sm border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-border)]/10 transition text-[var(--color-muted)]">
                Start
              </button>
              <button className="px-3 py-1.5 text-sm border border-[var(--color-crit)]/30 text-[var(--color-crit)] rounded-lg hover:bg-[var(--color-crit)]/10 transition">
                Delete
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-5 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Application Summary */}
          <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border)]">
                  <span className="text-sm text-[var(--color-muted)]">IP Address</span>
                  <span className="text-sm text-[var(--color-text)] font-mono">{application.ip || '10.1.40.39'}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border)]">
                  <span className="text-sm text-[var(--color-muted)]">Machine Type</span>
                  <span className="text-sm text-[var(--color-text)]">{application.os || 'Windows 2016 Server'}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border)]">
                  <span className="text-sm text-[var(--color-muted)]">CPU Load</span>
                  <span className="text-sm text-[var(--color-text)] font-mono">{application.cpu}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border)]">
                  <span className="text-sm text-[var(--color-muted)]">Percent Memory Used</span>
                  <span className="text-sm text-[var(--color-text)] font-mono">{application.memory}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border)]">
                  <span className="text-sm text-[var(--color-muted)]">Operational State</span>
                  <span className={`text-sm font-medium ${
                    application.status === "up" ? "text-[var(--color-ok)]" :
                    application.status === "warning" ? "text-[var(--color-warn)]" :
                    "text-[var(--color-crit)]"
                  }`}>
                    {application.status === "up" ? "Running" :
                     application.status === "warning" ? "Degraded" :
                     "Stopped"}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border)]">
                  <span className="text-sm text-[var(--color-muted)]">Guest Status</span>
                  <span className={`text-sm font-medium ${
                    application.status === "up" ? "text-[var(--color-ok)]" :
                    application.status === "warning" ? "text-[var(--color-warn)]" :
                    "text-[var(--color-crit)]"
                  }`}>
                    {application.status === "up" ? "Up" :
                     application.status === "warning" ? "Warning" :
                     "Down"}
                  </span>
                </div>
              </div>
            </div>

            {/* Resource Bars */}
            <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-[var(--color-muted)]">CPU Usage</span>
                    <span className="text-[var(--color-text)] font-mono">{application.cpu}</span>
                  </div>
                  <div className="w-full h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: application.cpu,
                        background: parseInt(application.cpu) > 80 ? "var(--color-crit)" : 
                                    parseInt(application.cpu) > 60 ? "var(--color-warn)" : "var(--color-ok)"
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-[var(--color-muted)]">Memory Usage</span>
                    <span className="text-[var(--color-text)] font-mono">{application.memory}</span>
                  </div>
                  <div className="w-full h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: application.memory,
                        background: parseInt(application.memory) > 80 ? "var(--color-crit)" : 
                                    parseInt(application.memory) > 60 ? "var(--color-warn)" : "var(--color-ok)"
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-[var(--color-muted)]">Disk Usage</span>
                    <span className="text-[var(--color-text)] font-mono">45%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: "45%",
                        background: 45 > 80 ? "var(--color-crit)" : 
                                    45 > 60 ? "var(--color-warn)" : "var(--color-ok)"
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Components with Problems */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-[var(--color-text)] flex items-center gap-2">
              <AlertCircle size={16} className="text-[var(--color-crit)]" />
              COMPONENTS WITH PROBLEMS:
            </h4>
            
            <div className="space-y-2">
              {drillData.items.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg border transition cursor-pointer ${
                    item.status === "down" || item.status === "warning" 
                      ? 'border-[var(--color-crit)]/20 bg-[var(--color-crit)]/5 hover:border-[var(--color-crit)]/40' 
                      : 'border-[var(--color-border)] bg-[var(--color-bg)] hover:border-[var(--color-accent)]/30'
                  }`}
                  onClick={() => {
                    if (drillLevel < 2 && (item.type === "problem" || item.type === "component")) {
                      setDrillLevel(drillLevel + 1);
                      setSelectedComponent(item);
                    }
                  }}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {item.status === "down" || item.status === "warning" ? (
                      <AlertCircle size={16} className="text-[var(--color-crit)] flex-shrink-0" />
                    ) : (
                      <CheckCircle size={16} className="text-[var(--color-ok)] flex-shrink-0" />
                    )}
                    <span className={`text-sm truncate ${
                      item.status === "down" || item.status === "warning" ? 'text-[var(--color-crit)]' : 'text-[var(--color-text)]'
                    }`}>
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {item.status && (
                      <div className="flex items-center gap-1.5">
                        <StatusDot state={item.status === "up" || item.status === "healthy" || item.status === "info" ? "up" : item.status === "warning" ? "warning" : "down"} size="sm" />
                        <span className={`text-xs ${
                          item.status === "up" || item.status === "healthy" ? "text-[var(--color-ok)]" :
                          item.status === "warning" ? "text-[var(--color-warn)]" :
                          item.status === "down" ? "text-[var(--color-crit)]" :
                          "text-[var(--color-muted)]"
                        }`}>
                          {item.status === "up" ? "Online" : 
                           item.status === "healthy" ? "Healthy" :
                           item.status === "warning" ? "Warning" :
                           item.status === "down" ? "Offline" :
                           item.status === "info" ? "Info" :
                           item.status}
                        </span>
                      </div>
                    )}
                    {(item.type === "problem" || item.type === "component") && drillLevel < 2 && (
                      <button className="p-1 rounded hover:bg-[var(--color-border)]/10 transition text-[var(--color-muted)] hover:text-[var(--color-text)]">
                        <ChevronRight size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* External Link */}
          <div className="mt-4 pt-3 border-t border-[var(--color-border)] flex items-center justify-between">
            <span className="text-xs text-[var(--color-faint)] truncate flex-1">
              {`observability-self-hosted.demo.solarwinds.com/Orion/APM/Summary.aspx?viewid=98#`}
            </span>
            <button className="p-2 rounded-lg hover:bg-[var(--color-border)]/10 transition text-[var(--color-muted)] hover:text-[var(--color-text)]">
              <ExternalLink size={16} />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-[var(--color-border)] bg-[var(--color-bg)] px-5">
          <div className="flex items-center gap-4 text-xs text-[var(--color-muted)]">
            <span>Level: {drillLevel + 1} of 3</span>
            <span className="w-px h-4 bg-[var(--color-border)]"></span>
            <span>Items: {drillData.items.length}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => toast.success('Exporting data...')}
              className="px-4 py-2 text-sm border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-border)]/10 transition text-[var(--color-muted)] hover:text-[var(--color-text)] flex items-center gap-2"
            >
              <Download size={16} />
              Export
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 text-sm bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90 transition shadow-lg shadow-[var(--color-accent)]/20"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [filteredProblemApps, setFilteredProblemApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [view, setView] = useState("all");
  const [expandedGroups, setExpandedGroups] = useState({});
  const [selectedApp, setSelectedApp] = useState(null);
  const [drillDownApp, setDrillDownApp] = useState(null);
  const [showDrillDown, setShowDrillDown] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(false), 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = (showToast = true) => {
    setIsRefreshing(true);
    setLoading(true);
    setTimeout(() => {
      const data = generateApplications();
      setApplications(data);
      applyFilters(data, search);
      setLoading(false);
      setIsRefreshing(false);
      if (showToast) toast.success("Server updated");
    }, 800);
  };

  const applyFilters = (data, searchTerm) => {
    let result = data;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(app => 
        app.name.toLowerCase().includes(term) ||
        app.nodeName.toLowerCase().includes(term) ||
        app.template.toLowerCase().includes(term)
      );
    }
    setFilteredApplications(result);
    setFilteredProblemApps(result.filter(app => app.status === "warning" || app.status === "down" || app.alerts > 0));
  };

  useEffect(() => {
    applyFilters(applications, search);
  }, [search, applications]);

  const toggleGroup = (groupId) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const getStatusIcon = (status) => {
    if (status === "up" || status === "healthy") return <CheckCircle size={16} className="text-[var(--color-ok)]" />;
    if (status === "warning") return <AlertCircle size={16} className="text-[var(--color-warn)]" />;
    return <XCircle size={16} className="text-[var(--color-crit)]" />;
  };

  const handleDrillDown = (app) => {
    setDrillDownApp(app);
    setShowDrillDown(true);
  };

  const handleAddApplication = (newApp) => {
    setApplications(prev => [newApp, ...prev]);
    applyFilters([newApp, ...applications], search);
  };

  if (loading && !applications.length) {
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
          <h1 className="text-2xl font-bold text-[var(--color-text)] flex items-center gap-2">
            <Package size={28} className="text-[var(--color-accent)]" />
            All Servers
          </h1>
          <p className="text-[var(--color-muted)] text-sm mt-1">
            {filteredApplications.length} applications • Grouped by Node Name, Application Template
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchData(true)}
            disabled={isRefreshing}
            className="p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] text-[var(--color-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-text)] transition disabled:opacity-50"
          >
            <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-80 transition flex items-center gap-2"
          >
            <Plus size={16} />
            Add Server
          </button>
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setView("all")}
            className={`px-4 py-1.5 text-sm rounded-lg transition flex items-center gap-2 ${
              view === "all"
                ? "bg-[var(--color-accent)] text-[#06222A] font-medium"
                : "bg-transparent text-[var(--color-muted)] border border-[var(--color-border)] hover:border-[var(--color-text)]"
            }`}
          >
            <Grid size={16} />
            All Servers
            <span className="text-xs opacity-75">({filteredApplications.length})</span>
          </button>
          <button
            onClick={() => setView("problems")}
            className={`px-4 py-1.5 text-sm rounded-lg transition flex items-center gap-2 ${
              view === "problems"
                ? "bg-[var(--color-accent)] text-[#06222A] font-medium"
                : "bg-transparent text-[var(--color-muted)] border border-[var(--color-border)] hover:border-[var(--color-text)]"
            }`}
          >
            <AlertCircle size={16} className="text-[var(--color-crit)]" />
            Servers with Problems
            <span className="text-xs opacity-75">({filteredProblemApps.length})</span>
          </button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-faint)]" />
            <input
              type="text"
              placeholder="Search applications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64 pl-9 pr-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition"
            />
          </div>
          <button className="p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] text-[var(--color-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-text)] transition">
            <Filter size={16} />
          </button>
        </div>
      </div>

      {/* All Applications Table */}
      {(view === "all") && (
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[var(--color-text)]">
                All Servers
                <span className="ml-2 text-xs font-normal text-[var(--color-muted)]">
                  GROUPED BY NODE NAME
                </span>
              </h3>
              <button className="text-xs text-[var(--color-accent)] hover:underline flex items-center gap-1">
                <Settings size={14} />
                Manage Servers
              </button>
            </div>
          </div>
          <div className="p-4">
            <div className="space-y-2">
              {(() => {
                const groupedByNode = filteredApplications.reduce((acc, app) => {
                  if (!acc[app.nodeName]) acc[app.nodeName] = [];
                  acc[app.nodeName].push(app);
                  return acc;
                }, {});

                return Object.keys(groupedByNode).map((nodeName) => {
                  const apps = groupedByNode[nodeName];
                  const isExpanded = expandedGroups[nodeName] || false;
                  const allUp = apps.every(app => app.status === "up" || app.status === "healthy");

                  return (
                    <div key={nodeName} className="border border-[var(--color-border)] rounded-lg overflow-hidden">
                      {/* Group Header */}
                      <div
                        className="flex items-center justify-between p-3 bg-[var(--color-bg)] cursor-pointer hover:bg-[var(--color-border)]/5 transition"
                        onClick={() => toggleGroup(nodeName)}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            allUp ? 'bg-[var(--color-ok)]/10' : 'bg-[var(--color-warn)]/10'
                          }`}>
                            <Server size={16} className={allUp ? 'text-[var(--color-ok)]' : 'text-[var(--color-warn)]'} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-[var(--color-text)]">{nodeName}</span>
                              <span className="text-xs text-[var(--color-muted)]">{apps.length} applications</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                allUp ? 'bg-[var(--color-ok)]/10 text-[var(--color-ok)]' : 'bg-[var(--color-warn)]/10 text-[var(--color-warn)]'
                              }`}>
                                {allUp ? 'All applications up' : `${apps.filter(a => a.status !== 'up' && a.status !== 'healthy').length} application(s) down`}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[var(--color-muted)]">
                            {apps.filter(a => a.status === "up" || a.status === "healthy").length} up
                          </span>
                          {!allUp && (
                            <span className="text-xs text-[var(--color-crit)]">
                              {apps.filter(a => a.status !== "up" && a.status !== "healthy").length} down
                            </span>
                          )}
                          <button className="p-1 rounded hover:bg-[var(--color-border)]/10 transition">
                            {isExpanded ? <ChevronDown size={16} className="text-[var(--color-muted)]" /> : <ChevronRight size={16} className="text-[var(--color-muted)]" />}
                          </button>
                        </div>
                      </div>

                      {/* Group Content - Applications List */}
                      {isExpanded && (
                        <div className="p-3 border-t border-[var(--color-border)] space-y-2">
                          {apps.map((app) => (
                            <div
                              key={app.id}
                              className="flex items-center justify-between p-2.5 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 transition cursor-pointer group"
                              onClick={() => handleDrillDown(app)}
                            >
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)]/5 flex items-center justify-center flex-shrink-0">
                                  <FileText size={14} className="text-[var(--color-muted)]" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-[var(--color-text)] truncate">{app.name}</span>
                                    <StatusDot state={app.status} size="sm" />
                                    <span className={`text-xs font-medium ${getStatusColor(app.status)}`}>
                                      {getStatusText(app.status)}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-3 text-xs text-[var(--color-muted)]">
                                    <span>CPU: {app.cpu}</span>
                                    <span>Memory: {app.memory}</span>
                                    <span>Alerts: {app.alerts}</span>
                                    <span>{app.components} components</span>
                                    {app.componentsWithProblems > 0 && (
                                      <span className="text-[var(--color-crit)]">({app.componentsWithProblems} with problems)</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDrillDown(app);
                                  }}
                                  className="p-1.5 rounded-lg hover:bg-[var(--color-border)]/10 transition text-[var(--color-muted)] hover:text-[var(--color-text)] opacity-0 group-hover:opacity-100"
                                >
                                  <ChevronRight size={16} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </Card>
      )}

      {/* Applications with Problems Table */}
      {(view === "problems") && (
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[var(--color-text)]">
                  Servers with Problems
                  <span className="ml-2 text-xs font-normal text-[var(--color-muted)]">
                    ({filteredProblemApps.length} applications)
                  </span>
                </h3>
                <p className="text-xs text-[var(--color-muted)] mt-1">
                  Active Server Alerts ({filteredProblemApps.reduce((acc, app) => acc + app.activeAlerts, 0)}) • All unacknowledged alerts
                </p>
              </div>
              <button className="text-xs text-[var(--color-accent)] hover:underline flex items-center gap-1">
                <Bell size={14} />
                View All Alerts
              </button>
            </div>
          </div>
          <div className="p-4">
            {filteredProblemApps.length === 0 ? (
              <div className="text-center py-8 text-[var(--color-muted)]">
                <CheckCircle size={48} className="mx-auto mb-3 text-[var(--color-ok)] opacity-50" />
                <p>No applications with problems</p>
                <p className="text-sm opacity-60">All applications are operating normally</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredProblemApps.map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 transition cursor-pointer group"
                    onClick={() => handleDrillDown(app)}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        app.status === "down" ? 'bg-[var(--color-crit)]/10' : 'bg-[var(--color-warn)]/10'
                      }`}>
                        <AlertCircle size={18} className={
                          app.status === "down" ? 'text-[var(--color-crit)]' : 'text-[var(--color-warn)]'
                        } />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-[var(--color-text)] truncate">{app.name}</span>
                          <StatusDot state={app.status} size="sm" />
                          <span className={`text-xs font-medium ${getStatusColor(app.status)}`}>
                            {getStatusText(app.status)}
                          </span>
                          {app.activeAlerts > 0 && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-crit)]/10 text-[var(--color-crit)]">
                              {app.activeAlerts} alerts
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-[var(--color-muted)]">
                          <span>Node: {app.nodeName}</span>
                          <span>CPU: {app.cpu}</span>
                          <span>Memory: {app.memory}</span>
                          <span className="text-[var(--color-crit)]">
                            {app.componentsWithProblems} components with problems
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs text-[var(--color-faint)]">Last Updated</div>
                        <div className="text-xs text-[var(--color-muted)]">{app.lastUpdated}</div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDrillDown(app);
                        }}
                        className="p-1.5 rounded-lg hover:bg-[var(--color-border)]/10 transition text-[var(--color-muted)] hover:text-[var(--color-text)] opacity-0 group-hover:opacity-100"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Add Application Modal */}
      <AddApplicationModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddApplication}
      />

      {/* Drill Down Modal */}
      <DrillDownModal
        isOpen={showDrillDown}
        onClose={() => {
          setShowDrillDown(false);
          setDrillDownApp(null);
        }}
        application={drillDownApp}
      />
    </div>
  );
}