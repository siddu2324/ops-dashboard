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
import { isAuthenticated } from "./services/authService";

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
};

// ---- Fallback UI for ErrorBoundary ----
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
  const NAV_VERSION = "1.0";
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

  // ---- Mobile sidebar state ----
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleMobile = () => setMobileOpen(!mobileOpen);

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

  const section =
    navItems.find((n) => n.children?.includes(active))?.label || "Home";
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
          onItemClick={toggleMobile}   // <-- close mobile on navigation
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
          onToggleSidebar={toggleMobile}   // <-- hamburger toggle
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
                <Page name={active} section={section} go={go} />
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
    <>
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
    </>
  );
}