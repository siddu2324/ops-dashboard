import React from "react";
import { Sparkles, AlertTriangle, LineChart as LineChartIcon } from "lucide-react";
import Card from "../components/common/Card";
import { T } from "../constants/theme";

export default function HomePage({ go }) {
  const shortcuts = [
    {
      label: "Dashboards",
      icon: LineChartIcon,
      to: "Dashboards",
      desc: "Fleet health at a glance",
    },
    {
      label: "Alerting",
      icon: AlertTriangle,
      to: "Alerting",
      desc: "7 alerts firing",
    },
    { label: "Servers", icon: LineChartIcon, to: "Servers", desc: "251 hosts monitored" },
    {
      label: "AI Assistant",
      icon: Sparkles,
      to: "AI Assistant",
      desc: "Ask about incidents",
    },
  ];
  return (
    <div className="grid gap-4">
      <Card>
        <div style={{ padding: "18px 4px 8px" }}>
          <div
            style={{
              fontFamily: T.mono,
              fontSize: 12,
              color: T.accent,
              letterSpacing: "0.08em",
            }}
          >
            ALL SYSTEMS · 2 DEGRADED
          </div>
          <h2
            style={{
              color: T.text,
              fontSize: 22,
              fontWeight: 600,
              margin: "8px 0 4px",
            }}
          >
            Good morning. Here's where to look first.
          </h2>
          <p style={{ color: T.muted, fontSize: 14, margin: 0 }}>
            prod-db-02 is under memory pressure and payments-api pods are restarting.
            Everything else is nominal.
          </p>
        </div>
      </Card>
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        }}
      >
        {shortcuts.map((s) => (
          <button
            key={s.label}
            onClick={() => go(s.to)}
            style={{
              textAlign: "left",
              background: T.panel,
              border: `1px solid ${T.border}`,
              borderRadius: 10,
              padding: 16,
              cursor: "pointer",
            }}
          >
            <s.icon size={18} color={T.accent} />
            <div
              style={{
                color: T.text,
                fontSize: 15,
                fontWeight: 600,
                marginTop: 10,
              }}
            >
              {s.label}
            </div>
            <div style={{ color: T.muted, fontSize: 13, marginTop: 2 }}>
              {s.desc}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
