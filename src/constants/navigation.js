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
} from "lucide-react";

export const NAV = [
  { id: "home", label: "Home", icon: Home },
  {
    id: "monitoring",
    label: "Monitoring",
    icon: Activity,
    children: ["Dashboards", "Metrics", "Logs", "Traces"],
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
    children: ["Incidents", "RCA", "Automation"], // removed "Alerting"
  },
  // ---- NEW Alerting section ----
  {
    id: "alerting",
    label: "Alerting",
    icon: Bell,
    children: [
      "Alert rules",
      "Notification configuration",
      "Silences",
      "Active notifications",
      "Settings", // ⚠️ Will conflict with Admin "Settings" – consider renaming to "Alert Settings"
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
  // ---- Administration (nested) ----
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
          "Settings", // 👈 This will be overridden by Alerting Settings if the same key is used
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
      { id: "authentication", label: "Authentication", icon: Key },
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