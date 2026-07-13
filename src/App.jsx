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
import { logAction } from "./services/auditService";

// ---- Lazy load pages ----
const HomePage = lazy(() => import("./pages/HomePage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const ServersPage = lazy(() => import("./pages/ServersPage"));
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
  // Observability
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
  // Operations
  Automation: {
    title: "Automation",
    description: "Automate your workflows. No automation jobs defined.",
    actionText: "Define job",
  },
  // AI
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
  // Reports
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
  // Administration – remaining placeholders
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
  Dashboards: DashboardPage,
  Servers: ServersPage,
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
  // ---- Alerting mappings ----
  "Alert rules": AlertRulesPage,
  "Notification configuration": NotificationConfigPage,
  Silences: SilencesPage,
  "Active notifications": ActiveNotificationsPage, // ✅ mapped
  Settings: AlertingSettingsPage,   // ⚠️ Overrides Admin Settings – consider renaming to "Alert Settings"
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
  const [active, setActive] = useState(() => {
    return localStorage.getItem("defaultPage") || "Dashboards";
  });

  const NAV_VERSION = "1.1";
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
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    return saved === "true";
  });

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(collapsed));
  }, [collapsed]);

  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleMobile = () => setMobileOpen(!mobileOpen);

  // Helper to find parent group (works with nested groups)
  const findParentGroup = (items, target, parentId = null) => {
    for (const item of items) {
      if (item.children) {
        if (item.children.includes(target)) {
          return item.id;
        }
        for (const child of item.children) {
          if (typeof child === 'object' && child.children) {
            const found = findParentGroup([child], target, child.id);
            if (found) return found;
          }
        }
      }
    }
    return null;
  };

  const go = (item, groupId) => {
    setActive(item);
    const parentId = groupId || findParentGroup(navItems, item);
    if (parentId) {
      setOpenGroups((g) => ({ ...g, [parentId]: true }));
    }
  };

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
    logAction("sidebar_item_added", { groupId, name });
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
    logAction("sidebar_item_removed", { groupId, child });
    toast.error(`Removed "${child}"`);
  };

  const toggle = (id) =>
    setOpenGroups((g) => ({ ...g, [id]: !g[id] }));

  const section =
    navItems.find((n) => n.children?.includes(active))?.label || "Home";

  const placeholder = PLACEHOLDER_DATA[active];
  const PageComponent = placeholder
    ? PlaceholderPage
    : PAGES[active] || GenericPage;

  const pageProps = placeholder
    ? { ...placeholder }
    : { name: active, section, go };

  return (
    <div className="flex h-screen w-full bg-[var(--color-bg)] font-sans">
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
                <PageComponent {...pageProps} />
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
    </WebSocketProvider>
  );
}