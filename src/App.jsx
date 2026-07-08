
import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { NAV } from "./constants/navigation";
import { T } from "./constants/theme";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import ServersPage from "./pages/ServersPage";
import LogsPage from "./pages/LogsPage";
import TracesPage from "./pages/TracesPage";
import AlertingPage from "./pages/AlertingPage";
import AssistantPage from "./pages/AssistantPage";
import GenericPage from "./pages/GenericPage";
import LoginPage from "./pages/auth/LoginPage";
import { isAuthenticated } from "./services/authService";

const PAGES = {
  Home: HomePage,
  Dashboards: DashboardPage,
  Servers: ServersPage,
  Logs: LogsPage,
  Traces: TracesPage,
  Alerting: AlertingPage,
  "AI Assistant": AssistantPage,
};

function DashboardLayout() {
  const [active, setActive] = useState("Dashboards");
  const [openGroups, setOpenGroups] = useState({ monitoring: true });
  const [collapsed, setCollapsed] = useState(false);

  const go = (item, groupId) => {
    setActive(item);
    if (groupId) setOpenGroups((g) => ({ ...g, [groupId]: true }));
  };

  const toggle = (id) => setOpenGroups((g) => ({ ...g, [id]: !g[id] }));

  const section = NAV.find((n) => n.children?.includes(active))?.label || "Home";
  const Page = PAGES[active] || GenericPage;

  return (
    <div
      className="flex h-screen w-full"
      style={{ background: T.bg, fontFamily: T.sans }}
    >
      <Sidebar
        active={active}
        collapsed={collapsed}
        openGroups={openGroups}
        onToggle={toggle}
        onNavigate={go}
        onCollapsedToggle={(value) => setCollapsed(value)}
      />

      <div className="flex flex-col flex-1 min-w-0">
        <Header active={active} section={section} />

        <main className="flex-1 overflow-y-auto p-5">
          {active === "Home" ? (
            <HomePage go={(x) => go(x)} />
          ) : (
            <Page name={active} section={section} go={(x) => go(x)} />
          )}
        </main>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function PublicRoute() {
  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return <LoginPage />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}