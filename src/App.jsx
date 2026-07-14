import { lazy, Suspense, useState, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { Toaster, toast } from "react-hot-toast";
import { NAV } from "./constants/navigation";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import LoginPage from "./pages/auth/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import LoadingSpinner from "./components/common/LoadingSpinner";
import PlaceholderPage from "./pages/PlaceholderPage";
import { isAuthenticated } from "./services/authService";
import { WebSocketProvider } from "./context/WebSocketContext";
import { AlertProvider } from "./context/AlertContext";
import { logAction } from "./services/auditService";

// ---- Lazy load pages ----
const HomePage = lazy(() => import("./pages/HomePage"));
const DashboardListPage = lazy(() => import("./pages/DashboardListPage"));   // ✅ new list page
const DashboardPage = lazy(() => import("./pages/DashboardPage"));          // view page
const ServersPage = lazy(() => import("./pages/ServersPage"));
const KubernetesPage = lazy(() => import("./pages/KubernetesPage"));
const DockerPage = lazy(() => import("./pages/DockerPage"));
const VMwarePage = lazy(() => import("./pages/VMwarePage"));
const LogsPage = lazy(() => import("./pages/LogsPage"));
const TracesPage = lazy(() => import("./pages/TracesPage"));
const AlertingPage = lazy(() => import("./pages/AlertingPage"));
const AssistantPage = lazy(() => import("./pages/AssistantPage"));
const GenericPage = lazy(() => import("./pages/GenericPage"));
const UsersPage = lazy(() => import("./pages/UsersPage"));
const ConnectionsPage = lazy(() => import("./pages/ConnectionsPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const PreferencesPage = lazy(() => import("./pages/PreferencesPage"));
const IncidentsPage = lazy(() => import("./pages/IncidentsPage"));
const RCAPage = lazy(() => import("./pages/RCAPage"));
const AuditLogPage = lazy(() => import("./pages/AuditLogPage"));
const StatisticsAndLicensing = lazy(() => import("./pages/StatisticsAndLicensing"));
const DefaultPreferences = lazy(() => import("./pages/DefaultPreferences"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const OrganizationsPage = lazy(() => import("./pages/OrganizationsPage"));
const MigrateToCloudPage = lazy(() => import("./pages/MigrateToCloudPage"));
const ProvisioningPage = lazy(() => import("./pages/ProvisioningPage"));
const PluginsPage = lazy(() => import("./pages/PluginsPage"));
const ServiceAccountsPage = lazy(() => import("./pages/ServiceAccountsPage"));
const MetricsPage = lazy(() => import("./pages/MetricsPage"));
const TeamsPage = lazy(() => import("./pages/TeamsPage"));
const CorrelationsPage = lazy(() => import("./pages/CorrelationsPage"));
const AuthenticationPage = lazy(() => import("./pages/AuthenticationPage"));

// ---- Dashboard drill‑down pages ----
const OracleMonitoring = lazy(() => import("./pages/dashboards/OracleMonitoring"));
const OracleRealTimeOSPerformance = lazy(() => import("./pages/dashboards/OracleRealTimeOSPerformance"));
const OracleHistoricalPerformance = lazy(() => import("./pages/dashboards/OracleHistoricalPerformance"));
const FirewallDashboard = lazy(() => import("./pages/dashboards/FirewallDashboard"));
const FirewallRealTimeInfo = lazy(() => import("./pages/dashboards/FirewallRealTimeInfo"));
const FirewallRealTimeInterfaceStatus = lazy(() => import("./pages/dashboards/FirewallRealTimeInterfaceStatus"));
const FirewallRealTimeService = lazy(() => import("./pages/dashboards/FirewallRealTimeService"));
const FirewallHistoricalPerformance = lazy(() => import("./pages/dashboards/FirewallHistoricalPerformance"));

// ---- Alerting pages ----
const AlertRulesPage = lazy(() => import("./pages/AlertRulesPage"));
const NotificationConfigPage = lazy(() => import("./pages/NotificationConfigPage"));
const SilencesPage = lazy(() => import("./pages/SilencesPage"));
const ActiveNotificationsPage = lazy(() => import("./pages/ActiveNotificationsPage"));
const AlertingSettingsPage = lazy(() => import("./pages/AlertingSettingsPage"));

// ---- Placeholder data (removed entries for pages with dedicated components) ----
const PLACEHOLDER_DATA = {
  // Infrastructure
  Kubernetes: {
    title: "Kubernetes",
    description: "Everything running under your control. No kubernetes configured yet.",
    actionText: "Set up Kubernetes",
  },
  Docker: {
    title: "Docker",
    description: "Manage your containers. No Docker hosts registered.",
    actionText: "Add Docker host",
  },
  VMware: {
    title: "VMware",
    description: "Virtual machines under your control. No vCenter connected.",
    actionText: "Connect vCenter",
  },
  Cloud: {
    title: "Cloud",
    description: "Your cloud infrastructure. No cloud accounts linked.",
    actionText: "Link cloud account",
  },
  Prometheus: {
    title: "Prometheus",
    description: "Monitor your metrics. No Prometheus instances configured.",
    actionText: "Add Prometheus",
  },
  Loki: {
    title: "Loki",
    description: "Aggregate your logs. No Loki data sources added.",
    actionText: "Add Loki source",
  },
  Tempo: {
    title: "Tempo",
    description: "Distributed tracing. No Tempo backend connected.",
    actionText: "Connect Tempo",
  },
  Mimir: {
    title: "Mimir",
    description: "Scalable metrics storage. No Mimir cluster configured.",
    actionText: "Configure Mimir",
  },
  Zabbix: {
    title: "Zabbix",
    description: "Enterprise monitoring. No Zabbix server linked.",
    actionText: "Link Zabbix",
  },
  Automation: {
    title: "Automation",
    description: "Automate your workflows. No automation jobs defined.",
    actionText: "Define job",
  },
  "AI Assistant": {
    title: "AI Assistant",
    description: "Get intelligent recommendations. No queries yet.",
    actionText: "Ask a question",
  },
  "Root Cause": {
    title: "Root Cause",
    description: "AI-powered root cause analysis. No data available.",
    actionText: "Analyze now",
  },
  Recommendations: {
    title: "Recommendations",
    description: "Proactive recommendations for your infrastructure.",
    actionText: "Generate recommendations",
  },
  "Capacity Planning": {
    title: "Capacity Planning",
    description: "Plan your resource usage. No predictions available.",
    actionText: "Run forecast",
  },
  "Executive Dashboard": {
    title: "Executive Dashboard",
    description: "High-level overview. No data aggregated yet.",
    actionText: "Generate report",
  },
  SLA: {
    title: "SLA",
    description: "Track service level agreements. No SLA data found.",
    actionText: "Configure SLA",
  },
  Availability: {
    title: "Availability",
    description: "Uptime and availability metrics. No data available.",
    actionText: "Set up monitoring",
  },
  Capacity: {
    title: "Capacity",
    description: "Capacity planning insights. No data to display.",
    actionText: "Analyze capacity",
  },
  Correlations: {
    title: "Correlations",
    description: "Define correlations between data sources.",
    actionText: "Add Correlation",
  },
  Authentication: {
    title: "Authentication",
    description: "Configure authentication methods (OAuth, LDAP, SSO, etc.).",
    actionText: "Configure Authentication",
  },
  Teams: {
    title: "Teams",
    description: "Manage teams and their members.",
    actionText: "Manage Teams",
  },
};

// ---- Map page names to components ----
const PAGES = {
  Home: HomePage,
  Dashboards: DashboardListPage,      // ✅ list of dashboards
  DashboardView: DashboardPage,       // ✅ individual dashboard view
  Servers: ServersPage,
  Kubernetes: KubernetesPage,
  Docker: DockerPage,
  VMware: VMwarePage,
  Logs: LogsPage,
  Traces: TracesPage,
  Alerting: AlertingPage,
  Incidents: IncidentsPage,
  RCA: RCAPage,
  "AI Assistant": AssistantPage,
  Users: UsersPage,
  Connections: ConnectionsPage,
  Profile: ProfilePage,
  Preferences: PreferencesPage,
  "Audit Log": AuditLogPage,
  "Statistics and licensing": StatisticsAndLicensing,
  "Default preferences": DefaultPreferences,
  Settings: SettingsPage,
  Organizations: OrganizationsPage,
  "Migrate to Grafana Cloud": MigrateToCloudPage,
  Provisioning: ProvisioningPage,
  Plugins: PluginsPage,
  "Service accounts": ServiceAccountsPage,
  Metrics: MetricsPage,
  Teams: TeamsPage,
  Correlations: CorrelationsPage,
  Authentication: AuthenticationPage,
  // ---- Alerting mappings ----
  "Alert rules": AlertRulesPage,
  "Notification configuration": NotificationConfigPage,
  Silences: SilencesPage,
  "Active notifications": ActiveNotificationsPage,
  "Alerting Settings": AlertingSettingsPage,
  // ---- Oracle drill‑down pages ----
  "Oracle Monitoring": OracleMonitoring,
  "Real-time_OS Performance": OracleRealTimeOSPerformance,
  "Oracle_Historical Performance_Dashboard": OracleHistoricalPerformance,
  // ---- Firewall drill‑down pages ----
  "Firewall Dashboard": FirewallDashboard,
  "Real-time_Firewall info": FirewallRealTimeInfo,
  "Real-time_Firewall Interface status": FirewallRealTimeInterfaceStatus,
  "Real-time_Firewall Service": FirewallRealTimeService,
  "Firewall_Historical Performance": FirewallHistoricalPerformance,
};

// ---- Fallback UI ----
function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen p-5 text-center bg-[var(--color-bg)]">
      <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-xl p-8 max-w-md">
        <h2 className="text-[var(--color-crit)] text-xl font-bold mb-2">
          Something went wrong
        </h2>
        <pre className="text-[var(--color-muted)] text-sm font-mono bg-[var(--color-bg)] p-3 rounded mb-4 overflow-auto max-h-32">
          {error.message}
        </pre>
        <button
          onClick={resetErrorBoundary}
          className="px-4 py-2 bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-80 transition"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

// ---- Dashboard Layout ----
function DashboardLayout() {
  // Read default page from localStorage, fallback to "Dashboards"
  const [active, setActive] = useState(() => {
    return localStorage.getItem("defaultPage") || "Dashboards";
  });

  // Nav items with versioning
  const NAV_VERSION = "1.3";   // ✅ kept at 1.3 (or bump to 1.4 if needed)
  const [navItems, setNavItems] = useState(() => {
    const saved = localStorage.getItem("navItems");
    const savedVersion = localStorage.getItem("navItemsVersion");
    if (saved && savedVersion === NAV_VERSION) {
      return JSON.parse(saved);
    }
    localStorage.setItem("navItems", JSON.stringify(NAV));
    localStorage.setItem("navItemsVersion", NAV_VERSION);
    return NAV;
  });

  const [openGroups, setOpenGroups] = useState({ monitoring: true });

  // Persist sidebar collapse state
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    return saved === "true";
  });

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(collapsed));
  }, [collapsed]);

  // Mobile sidebar state
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleMobile = () => setMobileOpen(!mobileOpen);

  // ---- Helper to find the parent section for nested nav ----
  const findSection = (items, target) => {
    for (const item of items) {
      // Direct child
      if (item.children && item.children.includes(target)) {
        return item.label;
      }
      // Nested child
      if (item.children && Array.isArray(item.children)) {
        for (const child of item.children) {
          if (typeof child === 'object' && child.children && child.children.includes(target)) {
            return item.label;
          }
        }
      }
    }
    return "Home";
  };

  // Navigate to a page
  const go = (item, groupId) => {
    setActive(item);
    if (groupId) {
      setOpenGroups((g) => ({ ...g, [groupId]: true }));
    }
  };

  // Add/remove sidebar items (admin only)
  const addMenuItem = (groupId) => {
    const name = prompt(`Add item to ${groupId}`);
    if (!name) return;
    const updated = navItems.map((item) =>
      item.id === groupId
        ? { ...item, children: [...item.children, name] }
        : item
    );
    setNavItems(updated);
    localStorage.setItem("navItems", JSON.stringify(updated));
    toast.success(`Added "${name}"`);
  };

  const removeMenuItem = (groupId, child) => {
    if (!window.confirm(`Remove ${child}?`)) return;
    const updated = navItems.map((item) =>
      item.id === groupId
        ? { ...item, children: item.children.filter((c) => c !== child) }
        : item
    );
    setNavItems(updated);
    localStorage.setItem("navItems", JSON.stringify(updated));
    toast.error(`Removed "${child}"`);
  };

  const toggle = (id) =>
    setOpenGroups((g) => ({ ...g, [id]: !g[id] }));

  const section = findSection(navItems, active);
  const Page = PAGES[active] || GenericPage;

  return (
    <div className="flex h-screen w-full bg-[var(--color-bg)] font-sans">
      {/* Sidebar with overlay on mobile */}
      <div
        className={`
          fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out
          lg:relative lg:transform-none lg:z-0
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <Sidebar
          navItems={navItems}
          addMenuItem={addMenuItem}
          removeMenuItem={removeMenuItem}
          active={active}
          collapsed={collapsed}
          openGroups={openGroups}
          onToggle={toggle}
          onNavigate={go}
          onCollapsedToggle={setCollapsed}
          onItemClick={toggleMobile}
        />
      </div>

      {/* Overlay background when mobile sidebar is open */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={toggleMobile}
        />
      )}

      <div className="flex flex-col flex-1 min-w-0">
        <Header
          active={active}
          section={section}
          onNavigate={go}
          onToggleSidebar={toggleMobile}
        />

        <main className="flex-1 overflow-y-auto p-5">
          <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={() => window.location.reload()}
          >
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-64">
                  <LoadingSpinner size={48} />
                </div>
              }
            >
              {active === "Home" ? (
                <HomePage go={go} />
              ) : (
                // ✅ Pass `active` as a prop to the rendered page
                <Page name={active} section={section} go={go} active={active} />
              )}
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}

// ---- Auth guards ----
function ProtectedRoute({ children }) {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  return children;
}

function PublicRoute() {
  if (isAuthenticated()) return <Navigate to="/" replace />;
  return <LoginPage />;
}

// ---- Main App ----
export default function App() {
  return (
    <WebSocketProvider>
      <AlertProvider>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "var(--color-panel)",
              color: "var(--color-text)",
              border: "1px solid var(--color-border)",
              fontFamily: "var(--font-sans)",
            },
          }}
        />
        <Routes>
          <Route path="/login" element={<PublicRoute />} />
          <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AlertProvider>
    </WebSocketProvider>
  );
}