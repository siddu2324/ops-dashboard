import {
  Home,
  Activity,
  Server,
  Radio,
  Siren,
  Bot,
  BarChart3,
  Settings,
  UserCog,
  Database,
  Users,
  Key,
  Plug,
  Bell,
  LayoutDashboard, // new icon for Dashboards
} from "lucide-react";

export const NAV = [
  { id: "home", label: "Home", icon: Home },
  {
    id: "dashboards", // 👈 new top‑level item
    label: "Dashboards",
    icon: LayoutDashboard,
  },
  {
    id: "monitoring",
    label: "Monitoring",
    icon: Activity,
    children: ["Metrics", "Logs", "Traces"], // 👈 "Dashboards" removed
  },
  {
    id: "infrastructure",
    label: "Infrastructure",
    icon: Server,
    children: ["Servers", "Kubernetes", "Docker", "VMware", "Cloud"],
  },
  {
    id: "observability",
    label: "Observability",
    icon: Radio,
    children: ["Prometheus", "Loki", "Tempo", "Mimir", "Zabbix"],
  },
  {
    id: "operations",
    label: "Operations",
    icon: Siren,
    children: ["Incidents", "RCA", "Automation"],
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
  {
    id: "ai",
    label: "AI",
    icon: Bot,
    children: ["AI Assistant", "Root Cause", "Recommendations", "Capacity Planning"],
  },
  {
    id: "reports",
    label: "Reports",
    icon: BarChart3,
    children: ["Executive Dashboard", "SLA", "Availability", "Capacity"],
  },
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