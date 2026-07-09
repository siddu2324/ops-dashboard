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
} from "lucide-react";

export const NAV = [
  {
    id: "home",
    label: "Home",
    icon: Home,
  },
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
    children: [
      "Alerting",
      "Incidents",
      "RCA",
      "Automation",
    ],
  },
  {
    id: "ai",
    label: "AI",
    icon: Bot,
    children: [
      "AI Assistant",
      "Root Cause",
      "Recommendations",
      "Capacity Planning",
    ],
  },
  {
    id: "reports",
    label: "Reports",
    icon: BarChart3,
    children: [
      "Executive Dashboard",
      "SLA",
      "Availability",
      "Capacity",
    ],
  },
  {
    id: "administration",
    label: "Administration",
    icon: Settings,
    children: [
      "Users",
      "Teams",
      "Service Accounts",
      "Datasources",
      "Connections",
    ],
  },
  {
    id: "user",
    label: "User",
    icon: UserCog,
    children: [
      "Profile",
      "Preferences",
    ],
  },
];