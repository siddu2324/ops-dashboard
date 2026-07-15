// src/pages/cloud/AzurePage.jsx
import { useState } from "react";
import { 
  Server, Search, RefreshCw, Plus, AlertCircle, CheckCircle, 
  XCircle, Cloud, Database, Network, HardDrive, Cpu, 
  Activity, Globe, Zap, Shield, Users, Clock, Download,
  Filter, ChevronDown, ChevronRight, BarChart3, PieChart,
  TrendingUp, TrendingDown, DollarSign, FolderOpen, 
  LayoutDashboard, Monitor, Wifi, Box, Layers, Settings,
  User, Mail, Phone, MapPin, Building, Calendar as CalendarIcon,
  Key, Lock, ExternalLink, Edit, Trash2, MoreVertical, Eye,
  Info, HelpCircle, Link2, Activity as ActivityIcon
} from "lucide-react";
import Card from "../../components/common/Card";
import { toast } from "react-hot-toast";

// Bell icon for alerts
const Bell = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

// Node Details Modal Component
const NodeDetailsModal = ({ isOpen, onClose, nodeData }) => {
  if (!isOpen || !nodeData) return null;

  const details = {
    nodeStatus: "Node is Up.",
    pollingIP: "10.1.114.12",
    dynamicIP: "No",
    machineType: "Windows 2016 Server",
    nodeCategory: "Server",
    dns: "azshpcache02v.demo.lab",
    systemName: nodeData.name || "AZSHPCACHE02V",
    description: "Hardware: Intel64 Family 6 Model 85 Stepping 4 AT/AT COMPATIBLE - Software: Windows Version 10.0 (Build 14393.8957 Multiprocessor Free)",
    location: "East US",
    contact: "",
    sysobjectid: "",
    lastBoot: "Tuesday, July 14, 2026 6:27 AM",
    softwareVersion: "10.0 (Build 14393.8957 Multiprocessor Free)",
    softwareImage: "Unknown",
    pollingEngine: "ODv2026-2-HCO (172.31.64.91)",
    pollingMethod: "WMI (WinRM)",
    pollingInterval: "120 seconds",
    nextPoll: "11:25 AM",
    statisticsCollection: "10 minutes",
    enable64BitCounters: "No",
    rediscoveryInterval: "30 minutes",
    nextRediscovery: "11:53 AM",
    lastDatabaseUpdate: "Wednesday, July 15, 2026 11:24 AM",
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center">
              <Server size={20} className="text-[var(--color-accent)]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[var(--color-text)]">Node Details</h3>
              <p className="text-xs text-[var(--color-muted)]">{details.systemName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => toast.success('Help opened')}
              className="p-2 rounded-lg hover:bg-[var(--color-border)]/10 transition text-[var(--color-muted)] hover:text-[var(--color-text)] flex items-center gap-1"
            >
              <HelpCircle size={16} />
              <span className="text-xs">HELP</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-[var(--color-border)]/10 transition text-[var(--color-muted)] hover:text-[var(--color-text)]"
            >
              <XCircle size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto max-h-[calc(90vh-180px)] space-y-6">
          {/* Node Status */}
          <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl p-4">
            <div className="flex items-center gap-2">
              <ActivityIcon size={16} className="text-[var(--color-ok)]" />
              <span className="text-sm font-medium text-[var(--color-text)]">NODE STATUS</span>
              <span className="text-sm text-[var(--color-ok)]">{details.nodeStatus}</span>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Node Details */}
            <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl p-4">
              <h4 className="text-xs font-semibold text-[var(--color-faint)] uppercase tracking-wider mb-3">Node Information</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm border-b border-[var(--color-border)] pb-2">
                  <span className="text-[var(--color-muted)]">Polling IP Address</span>
                  <span className="text-[var(--color-text)] font-mono">{details.pollingIP}</span>
                </div>
                <div className="flex justify-between text-sm border-b border-[var(--color-border)] pb-2">
                  <span className="text-[var(--color-muted)]">Dynamic IP</span>
                  <span className="text-[var(--color-text)]">{details.dynamicIP}</span>
                </div>
                <div className="flex justify-between text-sm border-b border-[var(--color-border)] pb-2">
                  <span className="text-[var(--color-muted)]">Machine Type</span>
                  <span className="text-[var(--color-text)]">{details.machineType}</span>
                </div>
                <div className="flex justify-between text-sm border-b border-[var(--color-border)] pb-2">
                  <span className="text-[var(--color-muted)]">Node Category</span>
                  <span className="text-[var(--color-text)]">{details.nodeCategory}</span>
                </div>
                <div className="flex justify-between text-sm border-b border-[var(--color-border)] pb-2">
                  <span className="text-[var(--color-muted)]">DNS</span>
                  <span className="text-[var(--color-text)]">{details.dns}</span>
                </div>
                <div className="flex justify-between text-sm border-b border-[var(--color-border)] pb-2">
                  <span className="text-[var(--color-muted)]">System Name</span>
                  <span className="text-[var(--color-text)] font-medium">{details.systemName}</span>
                </div>
              </div>
            </div>

            {/* System Details */}
            <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl p-4">
              <h4 className="text-xs font-semibold text-[var(--color-faint)] uppercase tracking-wider mb-3">System Information</h4>
              <div className="space-y-3">
                <div className="text-sm border-b border-[var(--color-border)] pb-2">
                  <span className="text-[var(--color-muted)]">Description</span>
                  <p className="text-[var(--color-text)] mt-1 text-xs leading-relaxed">{details.description}</p>
                </div>
                <div className="flex justify-between text-sm border-b border-[var(--color-border)] pb-2">
                  <span className="text-[var(--color-muted)]">Last Boot</span>
                  <span className="text-[var(--color-text)]">{details.lastBoot}</span>
                </div>
                <div className="flex justify-between text-sm border-b border-[var(--color-border)] pb-2">
                  <span className="text-[var(--color-muted)]">Software Version</span>
                  <span className="text-[var(--color-text)]">{details.softwareVersion}</span>
                </div>
                <div className="flex justify-between text-sm border-b border-[var(--color-border)] pb-2">
                  <span className="text-[var(--color-muted)]">Software Image</span>
                  <span className="text-[var(--color-text)]">{details.softwareImage}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-muted)]">Location</span>
                  <span className="text-[var(--color-text)]">{details.location || "Not Set"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Polling Details */}
          <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl p-4">
            <h4 className="text-xs font-semibold text-[var(--color-faint)] uppercase tracking-wider mb-3">Polling Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm border-b border-[var(--color-border)] pb-2">
                  <span className="text-[var(--color-muted)]">Polling IP Address</span>
                  <span className="text-[var(--color-text)] font-mono">{details.pollingIP}</span>
                </div>
                <div className="flex justify-between text-sm border-b border-[var(--color-border)] pb-2">
                  <span className="text-[var(--color-muted)]">Polling Engine</span>
                  <span className="text-[var(--color-text)]">{details.pollingEngine}</span>
                </div>
                <div className="flex justify-between text-sm border-b border-[var(--color-border)] pb-2">
                  <span className="text-[var(--color-muted)]">Polling Method</span>
                  <span className="text-[var(--color-text)]">{details.pollingMethod}</span>
                </div>
                <div className="flex justify-between text-sm border-b border-[var(--color-border)] pb-2">
                  <span className="text-[var(--color-muted)]">Polling Interval</span>
                  <span className="text-[var(--color-text)]">{details.pollingInterval}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm border-b border-[var(--color-border)] pb-2">
                  <span className="text-[var(--color-muted)]">Next Poll</span>
                  <span className="text-[var(--color-text)]">{details.nextPoll}</span>
                </div>
                <div className="flex justify-between text-sm border-b border-[var(--color-border)] pb-2">
                  <span className="text-[var(--color-muted)]">Statistics Collection</span>
                  <span className="text-[var(--color-text)]">{details.statisticsCollection}</span>
                </div>
                <div className="flex justify-between text-sm border-b border-[var(--color-border)] pb-2">
                  <span className="text-[var(--color-muted)]">Enable 64 Bit Counters</span>
                  <span className="text-[var(--color-text)]">{details.enable64BitCounters}</span>
                </div>
                <div className="flex justify-between text-sm border-b border-[var(--color-border)] pb-2">
                  <span className="text-[var(--color-muted)]">Rediscovery Interval</span>
                  <span className="text-[var(--color-text)]">{details.rediscoveryInterval}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-muted)]">Last Database Update</span>
                  <span className="text-[var(--color-text)]">{details.lastDatabaseUpdate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Port Details */}
          <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl p-4">
            <h4 className="text-xs font-semibold text-[var(--color-faint)] uppercase tracking-wider mb-3">Port Details {details.systemName}</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[var(--color-faint)] border-b border-[var(--color-border)]">
                    <th className="pb-2 font-medium">Port Number</th>
                    <th className="pb-2 font-medium">Host Name</th>
                    <th className="pb-2 font-medium">IP</th>
                    <th className="pb-2 font-medium">MAC</th>
                    <th className="pb-2 font-medium">VLAN</th>
                    <th className="pb-2 font-medium">VRF</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[var(--color-border)] hover:bg-[var(--color-border)]/5 transition">
                    <td className="py-2 text-[var(--color-text)] font-mono">Gig0/1</td>
                    <td className="py-2 text-[var(--color-text)]">{details.systemName}</td>
                    <td className="py-2 text-[var(--color-text)] font-mono">10.1.114.12</td>
                    <td className="py-2 text-[var(--color-text)] font-mono">00:1A:2B:3C:4D:5E</td>
                    <td className="py-2 text-[var(--color-text)]">VLAN 100</td>
                    <td className="py-2 text-[var(--color-text)]">default</td>
                  </tr>
                  <tr className="border-b border-[var(--color-border)] hover:bg-[var(--color-border)]/5 transition">
                    <td className="py-2 text-[var(--color-text)] font-mono">Gig0/2</td>
                    <td className="py-2 text-[var(--color-text)]">{details.systemName}</td>
                    <td className="py-2 text-[var(--color-text)] font-mono">10.1.114.13</td>
                    <td className="py-2 text-[var(--color-text)] font-mono">00:1A:2B:3C:4D:5F</td>
                    <td className="py-2 text-[var(--color-text)]">VLAN 200</td>
                    <td className="py-2 text-[var(--color-text)]">default</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Availability Statistics */}
          <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl p-4">
            <h4 className="text-xs font-semibold text-[var(--color-faint)] uppercase tracking-wider mb-3">Availability Statistics</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-[var(--color-panel)] rounded-lg border border-[var(--color-border)]">
                <p className="text-xs text-[var(--color-muted)]">Today</p>
                <p className="text-xl font-bold text-[var(--color-ok)]">100.000%</p>
              </div>
              <div className="text-center p-3 bg-[var(--color-panel)] rounded-lg border border-[var(--color-border)]">
                <p className="text-xs text-[var(--color-muted)]">Yesterday</p>
                <p className="text-xl font-bold text-[var(--color-ok)]">100.000%</p>
              </div>
              <div className="text-center p-3 bg-[var(--color-panel)] rounded-lg border border-[var(--color-border)]">
                <p className="text-xs text-[var(--color-muted)]">Last 7 Days</p>
                <p className="text-xl font-bold text-[var(--color-ok)]">100.000%</p>
              </div>
              <div className="text-center p-3 bg-[var(--color-panel)] rounded-lg border border-[var(--color-border)]">
                <p className="text-xs text-[var(--color-muted)]">Last 30 Days</p>
                <p className="text-xl font-bold text-[var(--color-ok)]">100.000%</p>
              </div>
              <div className="text-center p-3 bg-[var(--color-panel)] rounded-lg border border-[var(--color-border)]">
                <p className="text-xs text-[var(--color-muted)]">This Month</p>
                <p className="text-xl font-bold text-[var(--color-ok)]">100.000%</p>
              </div>
              <div className="text-center p-3 bg-[var(--color-panel)] rounded-lg border border-[var(--color-border)]">
                <p className="text-xs text-[var(--color-muted)]">Last Month</p>
                <p className="text-xl font-bold text-[var(--color-ok)]">100.000%</p>
              </div>
              <div className="text-center p-3 bg-[var(--color-panel)] rounded-lg border border-[var(--color-border)]">
                <p className="text-xs text-[var(--color-muted)]">This Year</p>
                <p className="text-xl font-bold text-[var(--color-ok)]">100.000%</p>
              </div>
              <div className="text-center p-3 bg-[var(--color-panel)] rounded-lg border border-[var(--color-border)]">
                <p className="text-xs text-[var(--color-muted)]">Last Month</p>
                <p className="text-xl font-bold text-[var(--color-ok)]">100.000%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-4 border-t border-[var(--color-border)] bg-[var(--color-bg)] px-5">
          <button
            onClick={() => {
              toast.success('Opening in new window...');
            }}
            className="px-4 py-2 text-sm border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-border)]/10 transition text-[var(--color-muted)] hover:text-[var(--color-text)] flex items-center gap-2 mr-3"
          >
            <ExternalLink size={16} />
            Open in New Window
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
  );
};

// Cost Chart Component
const CostChart = () => {
  const data = [
    { name: "Storage", value: 60.93, color: "#4F46E5" },
    { name: "Network", value: 311.93, color: "#8B5CF6" },
    { name: "Database", value: 38.04, color: "#EC4899" },
    { name: "Compute", value: 96.9, color: "#06B6D4" },
  ];

  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-[var(--color-text)]">Cloud Costs ($)</h4>
        <span className="text-xs text-[var(--color-muted)]">Month To Date</span>
      </div>
      
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--color-muted)]">{item.name}</span>
              <span className="text-[var(--color-text)] font-mono">${item.value.toFixed(2)}</span>
            </div>
            <div className="w-full h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-4 mt-4 pt-3 border-t border-[var(--color-border)]">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-1.5 text-xs">
            <div className="w-2.5 h-2.5 rounded" style={{ backgroundColor: item.color }} />
            <span className="text-[var(--color-muted)]">{item.name}: ${item.value.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Azure Asset Topology Component - Clickable
const AzureTopology = ({ onNodeClick }) => {
  const events = [
    { message: "Azure Cloud VM AZUBUWEB01v in eastus2 state: Critical.", time: "Jul 14 2026 6:48PM", node: "AZUBUWEB01v" },
    { message: "Azure Cloud VM AZUBUWEB01v in eastus2 state: Critical.", time: "Jul 14 2026 6:34PM", node: "AZUBUWEB01v" },
    { message: "Azure Cloud VM AZUBUWEB01v in eastus2 state: Critical.", time: "Jul 14 2026 6:19PM", node: "AZUBUWEB01v" },
    { message: "Azure Cloud VM AZUBUWEB01v in eastus2 state: Critical.", time: "Jul 14 2026 5:49PM", node: "AZUBUWEB01v" },
    { message: "Azure Cloud VM AZUBUWEB01v in eastus2 state: Critical.", time: "Jul 14 2026 5:18PM", node: "AZUBUWEB01v" },
    { message: "Azure Cloud VM AZUBUWEB01v in eastus2 state: Critical.", time: "Jul 14 2026 5:03PM", node: "AZUBUWEB01v" },
    { message: "Azure Cloud VM AZUBUWEB01v in eastus2 state: Critical.", time: "Jul 14 2026 4:48PM", node: "AZUBUWEB01v" },
    { message: "Azure Cloud VM AZUBUWEB01v in eastus2 state: Critical.", time: "Jul 14 2026 4:33PM", node: "AZUBUWEB01v" },
    { message: "Azure Cloud VM AZUBUWEB01v in eastus2 state: Critical.", time: "Jul 14 2026 4:19PM", node: "AZUBUWEB01v" },
    { message: "Azure Cloud VM AZUBUWEB01v in eastus2 state: Critical.", time: "Jul 14 2026 4:03PM", node: "AZUBUWEB01v" },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-[var(--color-text)]">Azure Asset Topology</h4>
        <span className="text-xs text-[var(--color-muted)]">Last 10 Events</span>
      </div>
      <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl overflow-hidden">
        <div className="max-h-64 overflow-y-auto">
          {events.map((event, index) => (
            <div 
              key={index} 
              className={`flex items-center justify-between p-3 text-sm hover:bg-[var(--color-border)]/10 transition cursor-pointer group ${
                index !== events.length - 1 ? 'border-b border-[var(--color-border)]' : ''
              }`}
              onClick={() => onNodeClick(event.node)}
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <AlertCircle size={14} className="text-[var(--color-crit)] flex-shrink-0" />
                <span className="text-[var(--color-text)] truncate group-hover:text-[var(--color-accent)] transition">
                  {event.message}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-[var(--color-muted)] whitespace-nowrap">{event.time}</span>
                <Eye size={14} className="text-[var(--color-muted)] opacity-0 group-hover:opacity-100 transition" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// DNS Zones Modal Component
const DNSZonesModal = ({ isOpen, onClose, zones }) => {
  const [search, setSearch] = useState("");
  const [accountFilter, setAccountFilter] = useState("all");
  const [providerFilter, setProviderFilter] = useState("all");
  const [zoneTypeFilter, setZoneTypeFilter] = useState("all");

  if (!isOpen) return null;

  const filteredZones = zones.filter(zone => {
    const matchesSearch = zone.domain.toLowerCase().includes(search.toLowerCase());
    const matchesAccount = accountFilter === "all" || zone.account === accountFilter;
    const matchesProvider = providerFilter === "all" || zone.provider === providerFilter;
    const matchesZoneType = zoneTypeFilter === "all" || zone.zoneType === zoneTypeFilter;
    return matchesSearch && matchesAccount && matchesProvider && matchesZoneType;
  });

  const accounts = ["all", ...new Set(zones.map(z => z.account))];
  const providers = ["all", ...new Set(zones.map(z => z.provider))];
  const zoneTypes = ["all", ...new Set(zones.map(z => z.zoneType))];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center">
              <Globe size={20} className="text-[var(--color-accent)]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[var(--color-text)]">Cloud DNS Zones</h3>
              <p className="text-xs text-[var(--color-muted)]">{zones.length} DNS zones configured</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[var(--color-border)]/10 transition text-[var(--color-muted)] hover:text-[var(--color-text)]"
          >
            <XCircle size={20} />
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--color-muted)]">FILTERS</span>
              <select
                value={accountFilter}
                onChange={(e) => setAccountFilter(e.target.value)}
                className="px-2 py-1 text-xs rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              >
                {accounts.map(acc => (
                  <option key={acc} value={acc}>
                    {acc === "all" ? "Account" : acc}
                  </option>
                ))}
              </select>
              <span className="text-[10px] text-[var(--color-faint)]">({accounts.length - 1})</span>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={providerFilter}
                onChange={(e) => setProviderFilter(e.target.value)}
                className="px-2 py-1 text-xs rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              >
                {providers.map(p => (
                  <option key={p} value={p}>
                    {p === "all" ? "Provider" : p}
                  </option>
                ))}
              </select>
              <span className="text-[10px] text-[var(--color-faint)]">({providers.length - 1})</span>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={zoneTypeFilter}
                onChange={(e) => setZoneTypeFilter(e.target.value)}
                className="px-2 py-1 text-xs rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              >
                {zoneTypes.map(zt => (
                  <option key={zt} value={zt}>
                    {zt === "all" ? "Zone Type" : zt}
                  </option>
                ))}
              </select>
              <span className="text-[10px] text-[var(--color-faint)]">({zoneTypes.length - 1})</span>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-faint)]" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            />
          </div>
        </div>

        {/* Table */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-280px)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[var(--color-faint)] border-b border-[var(--color-border)]">
                <th className="pb-2 font-medium">Domain Name</th>
                <th className="pb-2 font-medium">Provider</th>
                <th className="pb-2 font-medium">Zone ID / Subscription</th>
                <th className="pb-2 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredZones.map((zone, index) => (
                <tr key={index} className="border-b border-[var(--color-border)] hover:bg-[var(--color-border)]/5 transition">
                  <td className="py-3 text-[var(--color-text)] font-medium">{zone.domain}</td>
                  <td className="py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      zone.provider === "Azure" ? "bg-blue-500/20 text-blue-400" :
                      zone.provider === "AWS" ? "bg-orange-500/20 text-orange-400" :
                      "bg-purple-500/20 text-purple-400"
                    }`}>
                      {zone.provider}
                    </span>
                  </td>
                  <td className="py-3 text-[var(--color-muted)] font-mono text-xs">{zone.zoneId}</td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        onClick={() => toast.success(`Viewing ${zone.domain}`)}
                        className="p-1 rounded hover:bg-[var(--color-border)]/10 transition text-[var(--color-muted)] hover:text-[var(--color-text)]"
                      >
                        <Eye size={14} />
                      </button>
                      <button 
                        onClick={() => toast.success(`Editing ${zone.domain}`)}
                        className="p-1 rounded hover:bg-[var(--color-border)]/10 transition text-[var(--color-muted)] hover:text-[var(--color-text)]"
                      >
                        <Edit size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredZones.length === 0 && (
            <div className="text-center py-8 text-[var(--color-muted)]">
              <Globe size={32} className="mx-auto mb-2 opacity-30" />
              <p>No DNS zones found</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-[var(--color-border)] bg-[var(--color-bg)] px-5">
          <span className="text-xs text-[var(--color-muted)]">
            Showing {filteredZones.length} of {zones.length} zones
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Cloud Accounts Modal Component
const CloudAccountsModal = ({ isOpen, onClose, accounts }) => {
  const [search, setSearch] = useState("");
  const [providerFilter, setProviderFilter] = useState("all");
  const [autoMonitorFilter, setAutoMonitorFilter] = useState("all");

  if (!isOpen) return null;

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = account.name.toLowerCase().includes(search.toLowerCase()) ||
                          account.provider.toLowerCase().includes(search.toLowerCase()) ||
                          account.accessKey.toLowerCase().includes(search.toLowerCase());
    const matchesProvider = providerFilter === "all" || account.provider === providerFilter;
    const matchesMonitor = autoMonitorFilter === "all" || 
                          (autoMonitorFilter === "on" && account.autoMonitoring) ||
                          (autoMonitorFilter === "off" && !account.autoMonitoring);
    return matchesSearch && matchesProvider && matchesMonitor;
  });

  const providers = ["all", ...new Set(accounts.map(a => a.provider))];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center">
              <Cloud size={20} className="text-[var(--color-accent)]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[var(--color-text)]">Manage Cloud Accounts</h3>
              <p className="text-xs text-[var(--color-muted)]">{accounts.length} cloud accounts configured</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[var(--color-border)]/10 transition text-[var(--color-muted)] hover:text-[var(--color-text)]"
          >
            <XCircle size={20} />
          </button>
        </div>

        <div className="p-4 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--color-muted)]">FILTERS</span>
              <select
                value={providerFilter}
                onChange={(e) => setProviderFilter(e.target.value)}
                className="px-2 py-1 text-xs rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              >
                {providers.map(p => (
                  <option key={p} value={p}>
                    {p === "all" ? "Cloud Service Provider" : p}
                  </option>
                ))}
              </select>
              <span className="text-[10px] text-[var(--color-faint)]">({providers.length - 1})</span>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={autoMonitorFilter}
                onChange={(e) => setAutoMonitorFilter(e.target.value)}
                className="px-2 py-1 text-xs rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              >
                <option value="all">Auto Monitoring: All</option>
                <option value="on">Auto Monitoring: On</option>
                <option value="off">Auto Monitoring: Off</option>
              </select>
              <span className="text-[10px] text-[var(--color-faint)]">(2)</span>
            </div>
            <button 
              onClick={() => toast.success('Add Cloud Account clicked')}
              className="px-3 py-1 text-xs bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-80 transition flex items-center gap-1"
            >
              <Plus size={14} />
              ADD CLOUD ACCOUNT
            </button>
          </div>
        </div>

        <div className="p-4 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-faint)]" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            />
          </div>
        </div>

        <div className="p-4 overflow-y-auto max-h-[calc(90vh-280px)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[var(--color-faint)] border-b border-[var(--color-border)]">
                <th className="pb-2 font-medium">Name</th>
                <th className="pb-2 font-medium">Provider</th>
                <th className="pb-2 font-medium">Access Key / ID</th>
                <th className="pb-2 font-medium">Auto Monitoring</th>
                <th className="pb-2 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.map((account) => (
                <tr key={account.id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-border)]/5 transition">
                  <td className="py-3 text-[var(--color-text)] font-medium">{account.name}</td>
                  <td className="py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      account.provider === "Azure" ? "bg-blue-500/20 text-blue-400" :
                      account.provider === "AWS" ? "bg-orange-500/20 text-orange-400" :
                      "bg-purple-500/20 text-purple-400"
                    }`}>
                      {account.provider}
                    </span>
                  </td>
                  <td className="py-3 text-[var(--color-muted)] font-mono text-xs">
                    {account.accessKey}
                    {account.provider === "Azure" && (
                      <span className="block text-[10px] text-[var(--color-faint)]">subscription id</span>
                    )}
                  </td>
                  <td className="py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      account.autoMonitoring ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {account.autoMonitoring ? 'auto monitoring' : 'manual'}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        onClick={() => toast.success(`Viewing ${account.name}`)}
                        className="p-1 rounded hover:bg-[var(--color-border)]/10 transition text-[var(--color-muted)] hover:text-[var(--color-text)]"
                      >
                        <Eye size={14} />
                      </button>
                      <button 
                        onClick={() => toast.success(`Editing ${account.name}`)}
                        className="p-1 rounded hover:bg-[var(--color-border)]/10 transition text-[var(--color-muted)] hover:text-[var(--color-text)]"
                      >
                        <Edit size={14} />
                      </button>
                      <button 
                        onClick={() => toast.error(`Deleting ${account.name}`)}
                        className="p-1 rounded hover:bg-[var(--color-border)]/10 transition text-[var(--color-muted)] hover:text-[var(--color-crit)]"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredAccounts.length === 0 && (
            <div className="text-center py-8 text-[var(--color-muted)]">
              <Cloud size={32} className="mx-auto mb-2 opacity-30" />
              <p>No cloud accounts found</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-4 border-t border-[var(--color-border)] bg-[var(--color-bg)] px-5">
          <span className="text-xs text-[var(--color-muted)]">
            Showing {filteredAccounts.length} of {accounts.length} accounts
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Network Cost Chart Component
const NetworkCostChart = () => {
  const data = [
    { name: "Virtual WANs", value: 1, color: "#4F46E5" },
    { name: "Total Network Entities", value: 19, color: "#8B5CF6" },
    { name: "DNS Zones", value: 8, color: "#EC4899" },
  ];

  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-[var(--color-text)]">Network Costs ($)</h4>
        <span className="text-xs text-[var(--color-muted)]">Month To Date • $311.93</span>
      </div>
      
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--color-muted)]">{item.name}</span>
              <span className="text-[var(--color-text)] font-mono">{item.value}</span>
            </div>
            <div className="w-full h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Storage Disk Detail Modal
const StorageDiskModal = ({ isOpen, onClose, disk }) => {
  if (!isOpen || !disk) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center">
              <HardDrive size={20} className="text-[var(--color-accent)]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[var(--color-text)]">Disk Details</h3>
              <p className="text-xs text-[var(--color-muted)]">{disk.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[var(--color-border)]/10 transition text-[var(--color-muted)] hover:text-[var(--color-text)]"
          >
            <XCircle size={20} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto max-h-[calc(90vh-180px)] space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl p-4">
              <p className="text-xs text-[var(--color-faint)]">Disk Name</p>
              <p className="text-sm font-medium text-[var(--color-text)] mt-1">{disk.name}</p>
            </div>
            <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl p-4">
              <p className="text-xs text-[var(--color-faint)]">Storage Type</p>
              <p className="text-sm font-medium text-[var(--color-text)] mt-1">{disk.storageType}</p>
            </div>
            <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl p-4">
              <p className="text-xs text-[var(--color-faint)]">Size</p>
              <p className="text-sm font-medium text-[var(--color-text)] mt-1">{disk.size}</p>
            </div>
            <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl p-4">
              <p className="text-xs text-[var(--color-faint)]">Managed</p>
              <p className="text-sm font-medium text-[var(--color-text)] mt-1">{disk.managed}</p>
            </div>
            <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl p-4">
              <p className="text-xs text-[var(--color-faint)]">Status</p>
              <p className={`text-sm font-medium mt-1 ${disk.status === 'Up' ? 'text-[var(--color-ok)]' : 'text-[var(--color-warn)]'}`}>
                {disk.status}
              </p>
            </div>
            <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl p-4">
              <p className="text-xs text-[var(--color-faint)]">Resource Group</p>
              <p className="text-sm font-medium text-[var(--color-text)] mt-1">{disk.resourceGroup || 'Default'}</p>
            </div>
          </div>

          <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl p-4">
            <h4 className="text-xs font-semibold text-[var(--color-faint)] uppercase tracking-wider mb-3">Performance Metrics</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-xs text-[var(--color-muted)]">IOPS</p>
                <p className="text-lg font-bold text-[var(--color-text)]">1,234</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-[var(--color-muted)]">Throughput (MB/s)</p>
                <p className="text-lg font-bold text-[var(--color-text)]">245</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-[var(--color-muted)]">Latency (ms)</p>
                <p className="text-lg font-bold text-[var(--color-text)]">2.3</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end p-4 border-t border-[var(--color-border)] bg-[var(--color-bg)] px-5">
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90 transition shadow-lg shadow-[var(--color-accent)]/20"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Storage Account Detail Modal
const StorageAccountModal = ({ isOpen, onClose, account }) => {
  if (!isOpen || !account) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center">
              <FolderOpen size={20} className="text-[var(--color-accent)]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[var(--color-text)]">Storage Account Details</h3>
              <p className="text-xs text-[var(--color-muted)]">{account.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[var(--color-border)]/10 transition text-[var(--color-muted)] hover:text-[var(--color-text)]"
          >
            <XCircle size={20} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto max-h-[calc(90vh-180px)] space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl p-4">
              <p className="text-xs text-[var(--color-faint)]">Account Name</p>
              <p className="text-sm font-medium text-[var(--color-text)] mt-1">{account.name}</p>
            </div>
            <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl p-4">
              <p className="text-xs text-[var(--color-faint)]">Type</p>
              <p className="text-sm font-medium text-[var(--color-text)] mt-1">{account.type}</p>
            </div>
            <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl p-4">
              <p className="text-xs text-[var(--color-faint)]">Size</p>
              <p className="text-sm font-medium text-[var(--color-text)] mt-1">{account.size}</p>
            </div>
            <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl p-4">
              <p className="text-xs text-[var(--color-faint)]">Status</p>
              <p className={`text-sm font-medium mt-1 ${account.status === 'Up' ? 'text-[var(--color-ok)]' : 'text-[var(--color-warn)]'}`}>
                {account.status}
              </p>
            </div>
            <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl p-4">
              <p className="text-xs text-[var(--color-faint)]">Location</p>
              <p className="text-sm font-medium text-[var(--color-text)] mt-1">{account.location || 'East US'}</p>
            </div>
            <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl p-4">
              <p className="text-xs text-[var(--color-faint)]">Resource Group</p>
              <p className="text-sm font-medium text-[var(--color-text)] mt-1">{account.resourceGroup || 'Default'}</p>
            </div>
          </div>

          <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl p-4">
            <h4 className="text-xs font-semibold text-[var(--color-faint)] uppercase tracking-wider mb-3">Containers</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm border-b border-[var(--color-border)] pb-2">
                <span className="text-[var(--color-text)]">container-01</span>
                <span className="text-[var(--color-muted)]">Last Modified: 2026-07-14</span>
              </div>
              <div className="flex items-center justify-between text-sm border-b border-[var(--color-border)] pb-2">
                <span className="text-[var(--color-text)]">container-02</span>
                <span className="text-[var(--color-muted)]">Last Modified: 2026-07-13</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--color-text)]">container-03</span>
                <span className="text-[var(--color-muted)]">Last Modified: 2026-07-12</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end p-4 border-t border-[var(--color-border)] bg-[var(--color-bg)] px-5">
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90 transition shadow-lg shadow-[var(--color-accent)]/20"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Compute Cost Chart Component
const ComputeCostChart = () => {
  const data = [
    { name: "Virtual Machines", value: 9, color: "#4F46E5" },
    { name: "App Services", value: 4, color: "#8B5CF6" },
    { name: "AKS Clusters", value: 1, color: "#EC4899" },
    { name: "Function Apps", value: 1, color: "#06B6D4" },
  ];

  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-[var(--color-text)]">Compute Costs ($)</h4>
        <span className="text-xs text-[var(--color-muted)]">Month To Date • $96.9</span>
      </div>
      
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--color-muted)]">{item.name}</span>
              <span className="text-[var(--color-text)] font-mono">{item.value}</span>
            </div>
            <div className="w-full h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Database Detail Modal Component
const DatabaseDetailModal = ({ isOpen, onClose, database }) => {
  if (!isOpen || !database) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center">
              <Database size={20} className="text-[var(--color-accent)]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[var(--color-text)]">Database Details</h3>
              <p className="text-xs text-[var(--color-muted)]">{database.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[var(--color-border)]/10 transition text-[var(--color-muted)] hover:text-[var(--color-text)]"
          >
            <XCircle size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto max-h-[calc(90vh-180px)] space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl p-4">
              <p className="text-xs text-[var(--color-faint)]">Database Name</p>
              <p className="text-sm font-medium text-[var(--color-text)] mt-1">{database.name}</p>
            </div>
            <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl p-4">
              <p className="text-xs text-[var(--color-faint)]">Type</p>
              <p className="text-sm font-medium text-[var(--color-text)] mt-1">{database.type}</p>
            </div>
            <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl p-4">
              <p className="text-xs text-[var(--color-faint)]">Status</p>
              <p className={`text-sm font-medium mt-1 ${database.status === 'Running' ? 'text-[var(--color-ok)]' : database.status === 'Warning' ? 'text-[var(--color-warn)]' : 'text-[var(--color-crit)]'}`}>
                {database.status}
              </p>
            </div>
            <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl p-4">
              <p className="text-xs text-[var(--color-faint)]">CPU Load</p>
              <p className="text-sm font-medium text-[var(--color-text)] mt-1">{database.cpu}</p>
            </div>
            <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl p-4">
              <p className="text-xs text-[var(--color-faint)]">Memory Usage</p>
              <p className="text-sm font-medium text-[var(--color-text)] mt-1">{database.memory}</p>
            </div>
            <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl p-4">
              <p className="text-xs text-[var(--color-faint)]">Storage Usage</p>
              <p className="text-sm font-medium text-[var(--color-text)] mt-1">{database.storage}</p>
            </div>
            <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl p-4">
              <p className="text-xs text-[var(--color-faint)]">Location</p>
              <p className="text-sm font-medium text-[var(--color-text)] mt-1">{database.location || 'East US'}</p>
            </div>
            <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl p-4">
              <p className="text-xs text-[var(--color-faint)]">Resource Group</p>
              <p className="text-sm font-medium text-[var(--color-text)] mt-1">{database.resourceGroup || 'Default'}</p>
            </div>
            <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl p-4">
              <p className="text-xs text-[var(--color-faint)]">Storage Allocated</p>
              <p className="text-sm font-medium text-[var(--color-text)] mt-1">{database.storageAllocated || '10 GB'}</p>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl p-4">
            <h4 className="text-xs font-semibold text-[var(--color-faint)] uppercase tracking-wider mb-3">Performance Metrics</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-[var(--color-panel)] rounded-lg border border-[var(--color-border)]">
                <p className="text-xs text-[var(--color-muted)]">DTU / RU</p>
                <p className="text-lg font-bold text-[var(--color-text)]">250</p>
              </div>
              <div className="text-center p-3 bg-[var(--color-panel)] rounded-lg border border-[var(--color-border)]">
                <p className="text-xs text-[var(--color-muted)]">Connections</p>
                <p className="text-lg font-bold text-[var(--color-text)]">45</p>
              </div>
              <div className="text-center p-3 bg-[var(--color-panel)] rounded-lg border border-[var(--color-border)]">
                <p className="text-xs text-[var(--color-muted)]">Queries/sec</p>
                <p className="text-lg font-bold text-[var(--color-text)]">1,234</p>
              </div>
              <div className="text-center p-3 bg-[var(--color-panel)] rounded-lg border border-[var(--color-border)]">
                <p className="text-xs text-[var(--color-muted)]">Latency (ms)</p>
                <p className="text-lg font-bold text-[var(--color-text)]">2.3</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-4 border-t border-[var(--color-border)] bg-[var(--color-bg)] px-5">
          <button
            onClick={() => {
              toast.success('Opening in new window...');
            }}
            className="px-4 py-2 text-sm border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-border)]/10 transition text-[var(--color-muted)] hover:text-[var(--color-text)] flex items-center gap-2 mr-3"
          >
            <ExternalLink size={16} />
            Open in Azure Portal
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
  );
};

// Database Cost Chart Component
const DatabaseCostChart = () => {
  const data = [
    { name: "Azure SQL DB", value: 38.04, color: "#4F46E5" },
    { name: "Azure Cosmos DB", value: 25.50, color: "#8B5CF6" },
    { name: "Azure PostgreSQL", value: 15.30, color: "#EC4899" },
    { name: "Azure MySQL", value: 10.20, color: "#06B6D4" },
  ];

  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-[var(--color-text)]">Database Costs ($)</h4>
        <span className="text-xs text-[var(--color-muted)]">Month To Date</span>
      </div>
      
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--color-muted)]">{item.name}</span>
              <span className="text-[var(--color-text)] font-mono">${item.value.toFixed(2)}</span>
            </div>
            <div className="w-full h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function AzurePage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("CurrentYear");
  const [accountFilter, setAccountFilter] = useState("AllAccounts");
  const [showAccountsModal, setShowAccountsModal] = useState(false);
  const [showNodeModal, setShowNodeModal] = useState(false);
  const [showDNSZones, setShowDNSZones] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);

  // Mock cloud accounts data
  const cloudAccounts = [
    { id: 1, name: "AWS SolarWinds Demo", provider: "AWS", accessKey: "AKIAV3WNKR7KKIJVMMUY", autoMonitoring: true },
    { id: 2, name: "AWS SolarWinds FastFoods Demo", provider: "AWS", accessKey: "AKIA6D3OMZPYGNKBXSRB", autoMonitoring: true },
    { id: 3, name: "AWSUser", provider: "AWS", accessKey: "AKIAJD20LVN76I2DLXXA", autoMonitoring: true },
    { id: 4, name: "Azure SolarWinds Demo", provider: "Azure", accessKey: "5a36ffbd-f890-4f32-8368-672373be5aaf", autoMonitoring: true },
  ];

  // DNS Zones data
  const dnsZones = [
    { domain: "webdev-sftp.solarwinds.com.", provider: "AWS", zoneId: "/hostedzone/Z57U3XUC...", account: "Account 1", zoneType: "Public" },
    { domain: "thwackdemo.org", provider: "Azure", zoneId: "/subscriptions/e4893f33...", account: "Account 2", zoneType: "Private" },
    { domain: "thwackdemo.com.", provider: "AWS", zoneId: "/hostedzone/Z5BM4MP...", account: "Account 1", zoneType: "Public" },
    { domain: "testoriondemos.solarwinds.com.", provider: "Azure", zoneId: "/subscriptions/e4893f33...", account: "Account 3", zoneType: "Private" },
    { domain: "testdemos.solarwinds.com.", provider: "AWS", zoneId: "/hostedzone/Z00270253...", account: "Account 1", zoneType: "Public" },
    { domain: "swopper.demos.solarwinds.com.", provider: "AWS", zoneId: "/hostedzone/Z1018659...", account: "Account 4", zoneType: "Public" },
    { domain: "solarwindsynprivate.com.", provider: "AWS", zoneId: "/hostedzone/Z00295582...", account: "Account 1", zoneType: "Private" },
    { domain: "solarwindsyn.net", provider: "AWS", zoneId: "/hostedzone/Z2B9VYKL...", account: "Account 5", zoneType: "Public" },
    { domain: "cnlarwindcnv.com.", provider: "Azure", zoneId: "/subscriptions/e4893f33...", account: "Account 3", zoneType: "Public" },
  ];

  // Mock data
  const stats = {
    triggeredAlerts: 0,
    critical: 5,
    warning: 0,
    info: 2,
    cloudCosts: 143.23,
    storage: 727.69,
    network: 310,
    computeEntities: 15,
    databases: 4,
    storageEntities: 19,
    networkEntities: 19,
    accounts: cloudAccounts.length,
  };

  const networkStats = {
    virtualWANs: 1,
    totalNetworkEntities: 19,
    dnsZones: 8,
    siteToSiteConnections: 3,
    loadBalancers: 4,
    expressRouteCircuits: 1,
    applicationGateways: 4,
  };

  const tabs = [
    { id: "overview", label: "OVERVIEW", icon: LayoutDashboard },
    { id: "network", label: "NETWORK", icon: Network },
    { id: "storage", label: "STORAGE", icon: HardDrive },
    { id: "compute", label: "COMPUTE", icon: Cpu },
    { id: "database", label: "DATABASE", icon: Database },
  ];

  const handleNodeClick = (nodeName) => {
    setSelectedNode({ name: nodeName || "AZSHPCACHE02V" });
    setShowNodeModal(true);
  };

  // Storage tab state
  const [selectedDisk, setSelectedDisk] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showDiskModal, setShowDiskModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);

  const storageDisks = [
    { name: "AZSHPCACHE01v_OsDisk_1_72413960246c44529e...", storageType: "Premium", size: "127GB", managed: "Yes", status: "Up", resourceGroup: "RG-Prod" },
    { name: "AZSHPCACHE02v_OsDisk_1_6d987ea5fcdb4e088f...", storageType: "Premium", size: "127GB", managed: "Yes", status: "Up", resourceGroup: "RG-Prod" },
    { name: "AZSHPWEB01v_OsDisk_1_b0bde3aa66c14ca59379...", storageType: "Premium", size: "127GB", managed: "Yes", status: "Up", resourceGroup: "RG-Web" },
    { name: "AZSHPWEB02v_OsDisk_1_f7e8a9b0c1d2e3f4g5h6...", storageType: "Standard", size: "64GB", managed: "Yes", status: "Up", resourceGroup: "RG-Web" },
    { name: "AZSHPWEB03v_OsDisk_1_a1b2c3d4e5f6g7h8i9j0...", storageType: "Standard", size: "64GB", managed: "Yes", status: "Warning", resourceGroup: "RG-Web" },
  ];

  const storageAccounts = [
    { name: "aeazstrg01diag", type: "Storage", size: "1GB", status: "Up", location: "East US", resourceGroup: "RG-Diag" },
    { name: "azwestrg01store", type: "StorageV2", size: "0.01GB", status: "Up", location: "West US", resourceGroup: "RG-Store" },
    { name: "cs210033ffa39cbb6b", type: "StorageV2", size: "5GB", status: "Up", location: "East US", resourceGroup: "RG-CS" },
    { name: "azurestoreprod01", type: "StorageV2", size: "10GB", status: "Up", location: "East US", resourceGroup: "RG-Prod" },
    { name: "azurestoreprod02", type: "StorageV2", size: "15GB", status: "Warning", location: "East US", resourceGroup: "RG-Prod" },
  ];

  const handleDiskClick = (disk) => {
    setSelectedDisk(disk);
    setShowDiskModal(true);
  };

  const handleAccountClick = (account) => {
    setSelectedAccount(account);
    setShowAccountModal(true);
  };

  // Compute tab data
  const computeVMs = [
    { name: "AZSHPWEB02v", cpu: "24%", memory: "61%", status: "Up", type: "Virtual Machine", location: "East US" },
    { name: "AZSHPWEB01v", cpu: "20%", memory: "57%", status: "Up", type: "Virtual Machine", location: "East US" },
    { name: "AZSHPCACHE02v", cpu: "16%", memory: "51%", status: "Up", type: "Virtual Machine", location: "East US" },
    { name: "AZUBUWEB01v", cpu: "12%", memory: "48%", status: "Up", type: "Virtual Machine", location: "East US" },
    { name: "AZSHPWEB03v", cpu: "8%", memory: "42%", status: "Warning", type: "Virtual Machine", location: "West US" },
  ];

  const handleVMClick = (vm) => {
    setSelectedNode({ name: vm.name });
    setShowNodeModal(true);
  };

  // Database tab data
  const [selectedDatabase, setSelectedDatabase] = useState(null);
  const [showDatabaseModal, setShowDatabaseModal] = useState(false);

  const databaseData = [
    { 
      name: "TailwindTradersRewardsDB", 
      type: "Azure SQL DB", 
      status: "Running", 
      cpu: "23%", 
      memory: "61%", 
      storage: "3.2%", 
      location: "East US", 
      resourceGroup: "RG-Prod",
      storageAllocated: "10 GB"
    },
    { 
      name: "oriondemolab-postgresql", 
      type: "Azure PostgreSQL", 
      status: "Running", 
      cpu: "11%", 
      memory: "57%", 
      storage: "13.2%", 
      location: "East US", 
      resourceGroup: "RG-Prod",
      storageAllocated: "50 GB"
    },
    { 
      name: "cosmos-west-demo", 
      type: "Azure Cosmos DB (NoSQL API)", 
      status: "Running", 
      cpu: "5%", 
      memory: "48%", 
      storage: "8.7%", 
      location: "West US", 
      resourceGroup: "RG-Cosmos",
      storageAllocated: "25 GB"
    },
    { 
      name: "ApiDB", 
      type: "Azure SQL DB", 
      status: "Warning", 
      cpu: "8%", 
      memory: "42%", 
      storage: "1.2%", 
      location: "East US", 
      resourceGroup: "RG-API",
      storageAllocated: "5 GB"
    },
  ];

  const handleDatabaseClick = (db) => {
    setSelectedDatabase(db);
    setShowDatabaseModal(true);
  };

  const renderTabContent = () => {
    switch(activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">TRIGGERED ALERTS</p>
                    <p className="text-2xl font-bold text-[var(--color-text)] mt-1">{stats.triggeredAlerts}</p>
                  </div>
                  <Bell size={24} className="text-[var(--color-muted)]" />
                </div>
                <div className="flex gap-3 mt-2 text-xs">
                  <span className="text-[var(--color-crit)]">● Critical: {stats.critical}</span>
                  <span className="text-[var(--color-warn)]">● Warning: {stats.warning}</span>
                  <span className="text-[var(--color-ok)]">● Info: {stats.info}</span>
                </div>
              </div>

              <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">CLOUD COSTS ($)</p>
                    <p className="text-2xl font-bold text-[var(--color-text)] mt-1">{stats.cloudCosts}</p>
                  </div>
                  <DollarSign size={24} className="text-[var(--color-muted)]" />
                </div>
                <div className="flex gap-3 mt-2 text-xs">
                  <span className="text-[var(--color-muted)]">Storage: {stats.storage}</span>
                  <span className="text-[var(--color-muted)]">Network: {stats.network}</span>
                </div>
              </div>

              <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">COMPUTE ENTITIES</p>
                    <p className="text-2xl font-bold text-[var(--color-text)] mt-1">{stats.computeEntities}</p>
                  </div>
                  <Cpu size={24} className="text-[var(--color-muted)]" />
                </div>
                <div className="flex gap-3 mt-2 text-xs">
                  <span className="text-[var(--color-muted)]">VMs: {stats.computeEntities}</span>
                </div>
              </div>

              <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">DATABASES</p>
                    <p className="text-2xl font-bold text-[var(--color-text)] mt-1">{stats.databases}</p>
                  </div>
                  <Database size={24} className="text-[var(--color-muted)]" />
                </div>
                <div className="flex gap-3 mt-2 text-xs">
                  <span className="text-[var(--color-muted)]">SQL: {Math.floor(stats.databases * 0.6)}</span>
                  <span className="text-[var(--color-muted)]">NoSQL: {Math.floor(stats.databases * 0.4)}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">STORAGE</p>
                    <p className="text-2xl font-bold text-[var(--color-text)] mt-1">{stats.storageEntities}</p>
                  </div>
                  <HardDrive size={24} className="text-[var(--color-muted)]" />
                </div>
                <div className="mt-2 text-xs text-[var(--color-muted)]">
                  Storage Accounts: {Math.floor(stats.storageEntities * 0.7)} • Containers: {Math.floor(stats.storageEntities * 0.3)}
                </div>
              </div>

              <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">NETWORK ENTITIES</p>
                    <p className="text-2xl font-bold text-[var(--color-text)] mt-1">{stats.networkEntities}</p>
                  </div>
                  <Network size={24} className="text-[var(--color-muted)]" />
                </div>
                <div className="mt-2 text-xs text-[var(--color-muted)]">
                  VNets: {Math.floor(stats.networkEntities * 0.4)} • Subnets: {Math.floor(stats.networkEntities * 0.6)}
                </div>
              </div>

              <div 
                className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4 cursor-pointer hover:border-[var(--color-accent)] transition group"
                onClick={() => setShowAccountsModal(true)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">ACCOUNTS</p>
                    <p className="text-2xl font-bold text-[var(--color-text)] mt-1">{stats.accounts}</p>
                  </div>
                  <User size={24} className="text-[var(--color-muted)] group-hover:text-[var(--color-accent)] transition" />
                </div>
                <div className="mt-2 text-xs text-[var(--color-accent)] flex items-center gap-1 group-hover:underline">
                  <Settings size={12} />
                  Manage Cloud Accounts
                </div>
                <div className="mt-1 text-xs text-[var(--color-muted)]">
                  {cloudAccounts.map(acc => acc.provider).join(' • ')}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <AzureTopology onNodeClick={handleNodeClick} />
              </div>
              <div className="lg:col-span-1">
                <CostChart />
              </div>
            </div>
          </div>
        );
      
      case "network":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">Virtual WANs</p>
                    <p className="text-2xl font-bold text-[var(--color-text)] mt-1">{networkStats.virtualWANs}</p>
                  </div>
                  <Network size={24} className="text-[var(--color-muted)]" />
                </div>
              </div>
              <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">Total Network Entities</p>
                    <p className="text-2xl font-bold text-[var(--color-text)] mt-1">{networkStats.totalNetworkEntities}</p>
                  </div>
                  <Globe size={24} className="text-[var(--color-muted)]" />
                </div>
              </div>
              <div 
                className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4 cursor-pointer hover:border-[var(--color-accent)] transition group"
                onClick={() => setShowDNSZones(true)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">DNS Zones</p>
                    <p className="text-2xl font-bold text-[var(--color-text)] mt-1">{networkStats.dnsZones}</p>
                  </div>
                  <Globe size={24} className="text-[var(--color-muted)] group-hover:text-[var(--color-accent)] transition" />
                </div>
                <div className="mt-2 text-xs text-[var(--color-accent)] flex items-center gap-1 group-hover:underline">
                  <Settings size={12} />
                  Manage DNS Zones
                </div>
              </div>
              <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">Site To Site Connections</p>
                    <p className="text-2xl font-bold text-[var(--color-text)] mt-1">{networkStats.siteToSiteConnections}</p>
                  </div>
                  <Wifi size={24} className="text-[var(--color-muted)]" />
                </div>
                <div className="flex gap-3 mt-2 text-xs">
                  <span className="text-[var(--color-ok)]">● Up: {Math.floor(networkStats.siteToSiteConnections * 0.7)}</span>
                  <span className="text-[var(--color-crit)]">● Down: {Math.floor(networkStats.siteToSiteConnections * 0.3)}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">Load Balancers</p>
                    <p className="text-2xl font-bold text-[var(--color-text)] mt-1">{networkStats.loadBalancers}</p>
                  </div>
                  <Activity size={24} className="text-[var(--color-muted)]" />
                </div>
                <div className="flex gap-3 mt-2 text-xs">
                  <span className="text-[var(--color-ok)]">● Up: {Math.floor(networkStats.loadBalancers * 0.75)}</span>
                  <span className="text-[var(--color-crit)]">● Down: {Math.floor(networkStats.loadBalancers * 0.25)}</span>
                </div>
              </div>

              <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">ExpressRoute Circuits</p>
                    <p className="text-2xl font-bold text-[var(--color-text)] mt-1">{networkStats.expressRouteCircuits}</p>
                  </div>
                  <Zap size={24} className="text-[var(--color-muted)]" />
                </div>
                <div className="flex gap-3 mt-2 text-xs">
                  <span className="text-[var(--color-ok)]">● Up: 1</span>
                </div>
              </div>

              <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">Application Gateways</p>
                    <p className="text-2xl font-bold text-[var(--color-text)] mt-1">{networkStats.applicationGateways}</p>
                  </div>
                  <Server size={24} className="text-[var(--color-muted)]" />
                </div>
                <div className="flex gap-3 mt-2 text-xs">
                  <span className="text-[var(--color-ok)]">● Up: {Math.floor(networkStats.applicationGateways * 0.8)}</span>
                  <span className="text-[var(--color-crit)]">● Down: {Math.floor(networkStats.applicationGateways * 0.2)}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-1">
                <NetworkCostChart />
              </div>
              <div className="lg:col-span-2">
                <Card>
                  <div className="p-4">
                    <h4 className="text-sm font-semibold text-[var(--color-text)] mb-4">Network Resources Overview</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg p-3 text-center">
                        <p className="text-xs text-[var(--color-faint)]">Virtual Networks</p>
                        <p className="text-2xl font-bold text-[var(--color-text)]">12</p>
                      </div>
                      <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg p-3 text-center">
                        <p className="text-xs text-[var(--color-faint)]">Subnets</p>
                        <p className="text-2xl font-bold text-[var(--color-text)]">34</p>
                      </div>
                      <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg p-3 text-center">
                        <p className="text-xs text-[var(--color-faint)]">Public IPs</p>
                        <p className="text-2xl font-bold text-[var(--color-text)]">19</p>
                      </div>
                      <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg p-3 text-center">
                        <p className="text-xs text-[var(--color-faint)]">Network Interfaces</p>
                        <p className="text-2xl font-bold text-[var(--color-text)]">28</p>
                      </div>
                      <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg p-3 text-center">
                        <p className="text-xs text-[var(--color-faint)]">Security Groups</p>
                        <p className="text-2xl font-bold text-[var(--color-text)]">45</p>
                      </div>
                      <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg p-3 text-center">
                        <p className="text-xs text-[var(--color-faint)]">Route Tables</p>
                        <p className="text-2xl font-bold text-[var(--color-text)]">8</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            <DNSZonesModal
              isOpen={showDNSZones}
              onClose={() => setShowDNSZones(false)}
              zones={dnsZones}
            />
          </div>
        );
      
      case "storage":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">Azure Disk Storage</p>
                    <p className="text-2xl font-bold text-[var(--color-text)] mt-1">9</p>
                  </div>
                  <HardDrive size={24} className="text-[var(--color-muted)]" />
                </div>
              </div>
              <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">Azure Disk Storage Type</p>
                    <p className="text-2xl font-bold text-[var(--color-text)] mt-1">9</p>
                  </div>
                  <Layers size={24} className="text-[var(--color-muted)]" />
                </div>
              </div>
              <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">Azure Storage Account</p>
                    <p className="text-2xl font-bold text-[var(--color-text)] mt-1">10</p>
                  </div>
                  <FolderOpen size={24} className="text-[var(--color-muted)]" />
                </div>
              </div>
              <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">Storage Costs ($)</p>
                    <p className="text-2xl font-bold text-[var(--color-text)] mt-1">60.93</p>
                  </div>
                  <DollarSign size={24} className="text-[var(--color-muted)]" />
                </div>
                <span className="text-xs text-[var(--color-muted)]">Month To Date</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">Premium</p>
                    <p className="text-2xl font-bold text-[var(--color-text)] mt-1">9</p>
                  </div>
                  <span className="text-xs text-[var(--color-ok)]">● Up</span>
                </div>
              </div>
              <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">Standard</p>
                    <p className="text-2xl font-bold text-[var(--color-text)] mt-1">10</p>
                  </div>
                  <span className="text-xs text-[var(--color-ok)]">● Up</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg overflow-hidden">
                <div className="p-4 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
                  <h4 className="text-sm font-semibold text-[var(--color-text)]">Top 5 Size Azure Disk Storage</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-[var(--color-faint)] border-b border-[var(--color-border)] bg-[var(--color-bg)]">
                        <th className="px-4 py-2 font-medium">Disk</th>
                        <th className="px-4 py-2 font-medium">Storage Type</th>
                        <th className="px-4 py-2 font-medium">Size</th>
                        <th className="px-4 py-2 font-medium">Managed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {storageDisks.map((disk, index) => (
                        <tr 
                          key={index} 
                          className="border-b border-[var(--color-border)] hover:bg-[var(--color-border)]/5 transition cursor-pointer"
                          onClick={() => handleDiskClick(disk)}
                        >
                          <td className="px-4 py-3 text-[var(--color-text)] font-medium truncate max-w-[150px]">{disk.name}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              disk.storageType === "Premium" ? "bg-blue-500/20 text-blue-400" : "bg-gray-500/20 text-gray-400"
                            }`}>
                              {disk.storageType}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-[var(--color-text)] font-mono">{disk.size}</td>
                          <td className="px-4 py-3 text-[var(--color-text)]">{disk.managed}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg overflow-hidden">
                <div className="p-4 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
                  <h4 className="text-sm font-semibold text-[var(--color-text)]">Top 5 Size Azure Storage Account</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-[var(--color-faint)] border-b border-[var(--color-border)] bg-[var(--color-bg)]">
                        <th className="px-4 py-2 font-medium">Storage Account</th>
                        <th className="px-4 py-2 font-medium">Type</th>
                        <th className="px-4 py-2 font-medium">Size</th>
                      </tr>
                    </thead>
                    <tbody>
                      {storageAccounts.map((account, index) => (
                        <tr 
                          key={index} 
                          className="border-b border-[var(--color-border)] hover:bg-[var(--color-border)]/5 transition cursor-pointer"
                          onClick={() => handleAccountClick(account)}
                        >
                          <td className="px-4 py-3 text-[var(--color-text)] font-medium">{account.name}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              account.type === "StorageV2" ? "bg-purple-500/20 text-purple-400" : "bg-blue-500/20 text-blue-400"
                            }`}>
                              {account.type}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-[var(--color-text)] font-mono">{account.size}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <StorageDiskModal
              isOpen={showDiskModal}
              onClose={() => {
                setShowDiskModal(false);
                setSelectedDisk(null);
              }}
              disk={selectedDisk}
            />

            <StorageAccountModal
              isOpen={showAccountModal}
              onClose={() => {
                setShowAccountModal(false);
                setSelectedAccount(null);
              }}
              account={selectedAccount}
            />
          </div>
        );
      
      case "compute":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">Virtual Machines</p>
                    <p className="text-2xl font-bold text-[var(--color-text)] mt-1">9</p>
                  </div>
                  <Cpu size={24} className="text-[var(--color-muted)]" />
                </div>
                <div className="flex gap-3 mt-2 text-xs">
                  <span className="text-[var(--color-ok)]">● Up: 8</span>
                  <span className="text-[var(--color-crit)]">● Critical: 1</span>
                </div>
              </div>
              <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">App Services</p>
                    <p className="text-2xl font-bold text-[var(--color-text)] mt-1">4</p>
                  </div>
                  <Server size={24} className="text-[var(--color-muted)]" />
                </div>
                <span className="text-xs text-[var(--color-ok)]">● Up</span>
              </div>
              <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">AKS Clusters</p>
                    <p className="text-2xl font-bold text-[var(--color-text)] mt-1">1</p>
                  </div>
                  <Box size={24} className="text-[var(--color-muted)]" />
                </div>
                <span className="text-xs text-[var(--color-ok)]">● Up</span>
              </div>
              <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">Function Apps</p>
                    <p className="text-2xl font-bold text-[var(--color-text)] mt-1">1</p>
                  </div>
                  <Zap size={24} className="text-[var(--color-muted)]" />
                </div>
                <span className="text-xs text-[var(--color-ok)]">● Up</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-1">
                <ComputeCostChart />
              </div>
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg overflow-hidden">
                    <div className="p-4 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
                      <h4 className="text-sm font-semibold text-[var(--color-text)]">Top 5 VMs by CPU</h4>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-[var(--color-faint)] border-b border-[var(--color-border)] bg-[var(--color-bg)]">
                            <th className="px-4 py-2 font-medium">Virtual Machines</th>
                            <th className="px-4 py-2 font-medium">CPU Load</th>
                          </tr>
                        </thead>
                        <tbody>
                          {computeVMs.sort((a, b) => parseInt(b.cpu) - parseInt(a.cpu)).map((vm, index) => (
                            <tr 
                              key={index} 
                              className="border-b border-[var(--color-border)] hover:bg-[var(--color-border)]/5 transition cursor-pointer"
                              onClick={() => handleVMClick(vm)}
                            >
                              <td className="px-4 py-3 text-[var(--color-text)] font-medium">{vm.name}</td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden">
                                    <div
                                      className="h-full rounded-full transition-all duration-500"
                                      style={{
                                        width: vm.cpu,
                                        background: parseInt(vm.cpu) > 20 ? "var(--color-warn)" : "var(--color-ok)"
                                      }}
                                    />
                                  </div>
                                  <span className="text-[var(--color-text)] font-mono text-xs">{vm.cpu}</span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg overflow-hidden">
                    <div className="p-4 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
                      <h4 className="text-sm font-semibold text-[var(--color-text)]">Top 5 VMs by Memory</h4>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-[var(--color-faint)] border-b border-[var(--color-border)] bg-[var(--color-bg)]">
                            <th className="px-4 py-2 font-medium">Virtual Machines</th>
                            <th className="px-4 py-2 font-medium">Memory Load</th>
                          </tr>
                        </thead>
                        <tbody>
                          {computeVMs.sort((a, b) => parseInt(b.memory) - parseInt(a.memory)).map((vm, index) => (
                            <tr 
                              key={index} 
                              className="border-b border-[var(--color-border)] hover:bg-[var(--color-border)]/5 transition cursor-pointer"
                              onClick={() => handleVMClick(vm)}
                            >
                              <td className="px-4 py-3 text-[var(--color-text)] font-medium">{vm.name}</td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden">
                                    <div
                                      className="h-full rounded-full transition-all duration-500"
                                      style={{
                                        width: vm.memory,
                                        background: parseInt(vm.memory) > 55 ? "var(--color-warn)" : "var(--color-ok)"
                                      }}
                                    />
                                  </div>
                                  <span className="text-[var(--color-text)] font-mono text-xs">{vm.memory}</span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case "database":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">Databases by Type</p>
                    <p className="text-2xl font-bold text-[var(--color-text)] mt-1">4</p>
                  </div>
                  <Database size={24} className="text-[var(--color-muted)]" />
                </div>
                <div className="flex gap-2 mt-2 text-xs flex-wrap">
                  <span className="text-[var(--color-muted)]">Azure SQL DB: 2</span>
                  <span className="text-[var(--color-muted)]">Azure Cosmos DB: 1</span>
                  <span className="text-[var(--color-muted)]">Azure PostgreSQL: 1</span>
                </div>
              </div>
              <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">Databases by Status</p>
                    <p className="text-2xl font-bold text-[var(--color-text)] mt-1">4</p>
                  </div>
                  <Activity size={24} className="text-[var(--color-muted)]" />
                </div>
                <div className="flex gap-2 mt-2 text-xs flex-wrap">
                  <span className="text-[var(--color-ok)]">● Running: 3</span>
                  <span className="text-[var(--color-warn)]">● Warning: 1</span>
                </div>
              </div>
              <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">Databases Info</p>
                    <p className="text-2xl font-bold text-[var(--color-text)] mt-1">0.25</p>
                  </div>
                  <Info size={24} className="text-[var(--color-muted)]" />
                </div>
                <span className="text-xs text-[var(--color-muted)]">GB</span>
              </div>
              <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">Database Costs ($)</p>
                    <p className="text-2xl font-bold text-[var(--color-text)] mt-1">38.04</p>
                  </div>
                  <DollarSign size={24} className="text-[var(--color-muted)]" />
                </div>
                <span className="text-xs text-[var(--color-muted)]">Month To Date</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-1">
                <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">Storage Allocated</p>
                      <p className="text-2xl font-bold text-[var(--color-text)] mt-1">0.25</p>
                    </div>
                    <HardDrive size={24} className="text-[var(--color-muted)]" />
                  </div>
                  <span className="text-xs text-[var(--color-muted)]">GB</span>
                </div>
                <div className="mt-4">
                  <DatabaseCostChart />
                </div>
              </div>
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg overflow-hidden">
                    <div className="p-3 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
                      <h4 className="text-xs font-semibold text-[var(--color-text)]">Top 5 Databases by CPU</h4>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-[var(--color-faint)] border-b border-[var(--color-border)] bg-[var(--color-bg)]">
                            <th className="px-3 py-2 font-medium text-xs">Databases</th>
                            <th className="px-3 py-2 font-medium text-xs">CPU Load</th>
                          </tr>
                        </thead>
                        <tbody>
                          {databaseData.sort((a, b) => parseInt(b.cpu) - parseInt(a.cpu)).map((db, index) => (
                            <tr 
                              key={index} 
                              className="border-b border-[var(--color-border)] hover:bg-[var(--color-border)]/5 transition cursor-pointer"
                              onClick={() => handleDatabaseClick(db)}
                            >
                              <td className="px-3 py-2 text-[var(--color-text)] text-xs truncate max-w-[80px]">{db.name}</td>
                              <td className="px-3 py-2">
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden">
                                    <div
                                      className="h-full rounded-full transition-all duration-500"
                                      style={{
                                        width: db.cpu,
                                        background: parseInt(db.cpu) > 20 ? "var(--color-warn)" : "var(--color-ok)"
                                      }}
                                    />
                                  </div>
                                  <span className="text-[var(--color-text)] font-mono text-xs">{db.cpu}</span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg overflow-hidden">
                    <div className="p-3 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
                      <h4 className="text-xs font-semibold text-[var(--color-text)]">Top 5 Databases by Memory</h4>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-[var(--color-faint)] border-b border-[var(--color-border)] bg-[var(--color-bg)]">
                            <th className="px-3 py-2 font-medium text-xs">Databases</th>
                            <th className="px-3 py-2 font-medium text-xs">Memory Usage</th>
                          </tr>
                        </thead>
                        <tbody>
                          {databaseData.sort((a, b) => parseInt(b.memory) - parseInt(a.memory)).map((db, index) => (
                            <tr 
                              key={index} 
                              className="border-b border-[var(--color-border)] hover:bg-[var(--color-border)]/5 transition cursor-pointer"
                              onClick={() => handleDatabaseClick(db)}
                            >
                              <td className="px-3 py-2 text-[var(--color-text)] text-xs truncate max-w-[80px]">{db.name}</td>
                              <td className="px-3 py-2">
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden">
                                    <div
                                      className="h-full rounded-full transition-all duration-500"
                                      style={{
                                        width: db.memory,
                                        background: parseInt(db.memory) > 55 ? "var(--color-warn)" : "var(--color-ok)"
                                      }}
                                    />
                                  </div>
                                  <span className="text-[var(--color-text)] font-mono text-xs">{db.memory}</span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg overflow-hidden">
                    <div className="p-3 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
                      <h4 className="text-xs font-semibold text-[var(--color-text)]">Top 5 Databases by Storage</h4>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-[var(--color-faint)] border-b border-[var(--color-border)] bg-[var(--color-bg)]">
                            <th className="px-3 py-2 font-medium text-xs">Databases</th>
                            <th className="px-3 py-2 font-medium text-xs">Storage Usage</th>
                          </tr>
                        </thead>
                        <tbody>
                          {databaseData.sort((a, b) => parseInt(b.storage) - parseInt(a.storage)).map((db, index) => (
                            <tr 
                              key={index} 
                              className="border-b border-[var(--color-border)] hover:bg-[var(--color-border)]/5 transition cursor-pointer"
                              onClick={() => handleDatabaseClick(db)}
                            >
                              <td className="px-3 py-2 text-[var(--color-text)] text-xs truncate max-w-[80px]">{db.name}</td>
                              <td className="px-3 py-2">
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden">
                                    <div
                                      className="h-full rounded-full transition-all duration-500"
                                      style={{
                                        width: db.storage,
                                        background: parseInt(db.storage) > 10 ? "var(--color-warn)" : "var(--color-ok)"
                                      }}
                                    />
                                  </div>
                                  <span className="text-[var(--color-text)] font-mono text-xs">{db.storage}</span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <DatabaseDetailModal
              isOpen={showDatabaseModal}
              onClose={() => {
                setShowDatabaseModal(false);
                setSelectedDatabase(null);
              }}
              database={selectedDatabase}
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Azure Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-text)] flex items-center gap-2">
            <Cloud size={24} className="text-[var(--color-accent)]" />
            Azure
          </h2>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button 
            onClick={() => toast.success('Refreshing Azure resources...')}
            className="p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] text-[var(--color-muted)] hover:text-[var(--color-text)] transition flex items-center gap-1"
          >
            <RefreshCw size={16} />
            <span className="text-xs hidden sm:inline">Refresh Now</span>
          </button>
          <button className="p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] text-[var(--color-muted)] hover:text-[var(--color-text)] transition">
            <Download size={16} />
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--color-muted)]">Actions</span>
          <button className="px-2 py-1 text-xs border border-[var(--color-border)] rounded hover:bg-[var(--color-border)]/10 transition text-[var(--color-muted)]">
            <Filter size={12} className="inline mr-1" />
            Filter
          </button>
        </div>
        
        <div className="w-px h-6 bg-[var(--color-border)]" />
        
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-2 py-1 text-xs rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
        >
          <option value="CurrentYear">Current Year</option>
          <option value="LastMonth">Last Month</option>
          <option value="LastQuarter">Last Quarter</option>
        </select>

        <select
          value={accountFilter}
          onChange={(e) => setAccountFilter(e.target.value)}
          className="px-2 py-1 text-xs rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
        >
          <option value="AllAccounts">All Accounts</option>
          <option value="Account1">Account 1</option>
          <option value="Account2">Account 2</option>
        </select>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap border-b border-[var(--color-border)]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-xs font-medium transition flex items-center gap-2 ${
                activeTab === tab.id
                  ? "text-[var(--color-text)] border-b-2 border-[var(--color-accent)]"
                  : "text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-border)]/5"
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {renderTabContent()}
      </div>

      {/* Node Details Modal */}
      <NodeDetailsModal
        isOpen={showNodeModal}
        onClose={() => {
          setShowNodeModal(false);
          setSelectedNode(null);
        }}
        nodeData={selectedNode}
      />

      {/* Cloud Accounts Modal */}
      <CloudAccountsModal
        isOpen={showAccountsModal}
        onClose={() => setShowAccountsModal(false)}
        accounts={cloudAccounts}
      />
    </div>
  );
}