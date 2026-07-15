// src/constants/navigation.js
import {
  Home,
  Activity,
  Server,
  Siren,
  Settings,
  UserCog,
  Database,
  Users,
  Plug,
  Bell,
  LayoutDashboard,
  AppWindow,
} from "lucide-react";

export const NAV = [
  { id: "home", label: "Home", icon: Home },
  {
    id: "dashboards",
    label: "Dashboards",
    icon: LayoutDashboard,
  },
  {
    id: "monitoring",
    label: "Monitoring",
    icon: Activity,
    children: ["Metrics", "Logs", "Traces"],
  },
  {
    id: "infrastructure",
    label: "Infrastructure",
    icon: Server,
    children: ["Servers", "Cloud", "Firewall"],
  },
  {
    id: "applications",
    label: "Applications",
    icon: AppWindow,
    children: ["IIS"],
  },
  {
    id: "operations",
    label: "Operations",
    icon: Siren,
    children: ["Incidents"],
  },
  {
    id: "alerting",
    label: "Alerting",
    icon: Bell,
    children: [
      "Alert rules",
      "Notification configuration",
      "Silences",
      "Active notifications",
      "Alerting Settings",
    ],
  },
  // ❌ Reports section removed entirely
  {
    id: "administration",
    label: "Administration",
    icon: Settings,
    children: [
      {
        id: "general",
        label: "General",
        icon: Settings,
        children: [
          "Statistics and licensing",
          "Default preferences",
          "Settings",
          "Organizations",
          "Migrate to Grafana Cloud",
          "Provisioning",
        ],
      },
      {
        id: "plugins-data",
        label: "Plugins and data",
        icon: Database,
        children: ["Plugins", "Correlations"],
      },
      {
        id: "users-access",
        label: "Users and access",
        icon: Users,
        children: ["Users", "Teams", "Service accounts"],
      },
      "Authentication",
    ],
  },
  {
    id: "connections",
    label: "Connections",
    icon: Plug,
  },
  {
    id: "user",
    label: "User",
    icon: UserCog,
    children: ["Profile", "Preferences"],
  },
];