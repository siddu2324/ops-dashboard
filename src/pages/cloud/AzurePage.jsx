// src/pages/cloud/AzurePage.jsx
import { useState } from "react";
import { 
  Server, Search, RefreshCw, Plus, AlertCircle, CheckCircle, 
  XCircle, Cloud, Database, Network, HardDrive, Cpu, 
  Activity, Globe, Zap, Shield, Users, Clock, Download,
  Filter, ChevronDown, ChevronRight, BarChart3, PieChart,
  TrendingUp, TrendingDown, DollarSign, FolderOpen, 
  LayoutDashboard, Monitor, Wifi, Box, Layers
} from "lucide-react";
import Card from "../../components/common/Card";
import { toast } from "react-hot-toast";

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
      
      {/* Bar Chart */}
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

      {/* Legend */}
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

// Azure Asset Topology Component
const AzureTopology = () => {
  const events = [
    { message: "Azure Cloud VM AZUBUWEB01v in eastus2 state: Critical.", time: "Jul 14 2026 6:48PM" },
    { message: "Azure Cloud VM AZUBUWEB01v in eastus2 state: Critical.", time: "Jul 14 2026 6:34PM" },
    { message: "Azure Cloud VM AZUBUWEB01v in eastus2 state: Critical.", time: "Jul 14 2026 6:19PM" },
    { message: "Azure Cloud VM AZUBUWEB01v in eastus2 state: Critical.", time: "Jul 14 2026 5:49PM" },
    { message: "Azure Cloud VM AZUBUWEB01v in eastus2 state: Critical.", time: "Jul 14 2026 5:18PM" },
    { message: "Azure Cloud VM AZUBUWEB01v in eastus2 state: Critical.", time: "Jul 14 2026 5:03PM" },
    { message: "Azure Cloud VM AZUBUWEB01v in eastus2 state: Critical.", time: "Jul 14 2026 4:48PM" },
    { message: "Azure Cloud VM AZUBUWEB01v in eastus2 state: Critical.", time: "Jul 14 2026 4:33PM" },
    { message: "Azure Cloud VM AZUBUWEB01v in eastus2 state: Critical.", time: "Jul 14 2026 4:19PM" },
    { message: "Azure Cloud VM AZUBUWEB01v in eastus2 state: Critical.", time: "Jul 14 2026 4:03PM" },
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
              className={`flex items-center justify-between p-3 text-sm hover:bg-[var(--color-border)]/5 transition ${
                index !== events.length - 1 ? 'border-b border-[var(--color-border)]' : ''
              }`}
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <AlertCircle size={14} className="text-[var(--color-crit)] flex-shrink-0" />
                <span className="text-[var(--color-text)] truncate">{event.message}</span>
              </div>
              <span className="text-xs text-[var(--color-muted)] whitespace-nowrap ml-4">{event.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function AzurePage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("CurrentYear");
  const [accountFilter, setAccountFilter] = useState("AllAccounts");

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
  };

  const tabs = [
    { id: "overview", label: "OVERVIEW", icon: LayoutDashboard },
    { id: "network", label: "NETWORK", icon: Network },
    { id: "storage", label: "STORAGE", icon: HardDrive },
    { id: "compute", label: "COMPUTE", icon: Cpu },
    { id: "database", label: "DATABASE", icon: Database },
  ];

  const renderTabContent = () => {
    switch(activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">Triggered Alerts</p>
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
                    <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">Cloud Costs ($)</p>
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
                    <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">Compute Entities</p>
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
                    <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">Databases</p>
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

            {/* Storage and Network Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">Storage</p>
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
                    <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">Network Entities</p>
                    <p className="text-2xl font-bold text-[var(--color-text)] mt-1">{stats.networkEntities}</p>
                  </div>
                  <Network size={24} className="text-[var(--color-muted)]" />
                </div>
                <div className="mt-2 text-xs text-[var(--color-muted)]">
                  VNets: {Math.floor(stats.networkEntities * 0.4)} • Subnets: {Math.floor(stats.networkEntities * 0.6)}
                </div>
              </div>
            </div>

            {/* Topology and Cost Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <AzureTopology />
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
                <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">Virtual Networks</p>
                <p className="text-2xl font-bold text-[var(--color-text)] mt-1">12</p>
              </div>
              <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
                <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">Subnets</p>
                <p className="text-2xl font-bold text-[var(--color-text)] mt-1">34</p>
              </div>
              <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
                <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">Load Balancers</p>
                <p className="text-2xl font-bold text-[var(--color-text)] mt-1">6</p>
              </div>
              <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
                <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">Public IPs</p>
                <p className="text-2xl font-bold text-[var(--color-text)] mt-1">19</p>
              </div>
            </div>
            <Card>
              <div className="p-4 text-center text-[var(--color-muted)]">
                <Network size={32} className="mx-auto mb-2 opacity-30" />
                <p>Network resources will be displayed here</p>
              </div>
            </Card>
          </div>
        );
      
      case "storage":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
                <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">Storage Accounts</p>
                <p className="text-2xl font-bold text-[var(--color-text)] mt-1">8</p>
              </div>
              <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
                <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">Containers</p>
                <p className="text-2xl font-bold text-[var(--color-text)] mt-1">23</p>
              </div>
              <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
                <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">Total Size (GB)</p>
                <p className="text-2xl font-bold text-[var(--color-text)] mt-1">1,247</p>
              </div>
              <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
                <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">File Shares</p>
                <p className="text-2xl font-bold text-[var(--color-text)] mt-1">11</p>
              </div>
            </div>
            <Card>
              <div className="p-4 text-center text-[var(--color-muted)]">
                <HardDrive size={32} className="mx-auto mb-2 opacity-30" />
                <p>Storage resources will be displayed here</p>
              </div>
            </Card>
          </div>
        );
      
      case "compute":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
                <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">Virtual Machines</p>
                <p className="text-2xl font-bold text-[var(--color-text)] mt-1">15</p>
              </div>
              <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
                <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">VM Sizes</p>
                <p className="text-2xl font-bold text-[var(--color-text)] mt-1">8</p>
              </div>
              <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
                <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">Total vCPUs</p>
                <p className="text-2xl font-bold text-[var(--color-text)] mt-1">64</p>
              </div>
              <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
                <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">Total Memory (GB)</p>
                <p className="text-2xl font-bold text-[var(--color-text)] mt-1">256</p>
              </div>
            </div>
            <Card>
              <div className="p-4 text-center text-[var(--color-muted)]">
                <Cpu size={32} className="mx-auto mb-2 opacity-30" />
                <p>Compute resources will be displayed here</p>
              </div>
            </Card>
          </div>
        );
      
      case "database":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
                <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">SQL Databases</p>
                <p className="text-2xl font-bold text-[var(--color-text)] mt-1">2</p>
              </div>
              <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
                <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">Cosmos DB</p>
                <p className="text-2xl font-bold text-[var(--color-text)] mt-1">1</p>
              </div>
              <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
                <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">MySQL</p>
                <p className="text-2xl font-bold text-[var(--color-text)] mt-1">1</p>
              </div>
              <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
                <p className="text-xs text-[var(--color-faint)] uppercase tracking-wider">Total Databases</p>
                <p className="text-2xl font-bold text-[var(--color-text)] mt-1">4</p>
              </div>
            </div>
            <Card>
              <div className="p-4 text-center text-[var(--color-muted)]">
                <Database size={32} className="mx-auto mb-2 opacity-30" />
                <p>Database resources will be displayed here</p>
              </div>
            </Card>
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
    </div>
  );
}

// Bell icon for alerts (if not already imported)
const Bell = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);