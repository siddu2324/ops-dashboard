import { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import Card from "../../components/common/Card";

const data = [
  { time: "7-14 07:49 PM", throughput: 120, sessions: 400 },
  { time: "7-14 07:57 PM", throughput: 140, sessions: 450 },
  { time: "7-14 08:06 PM", throughput: 110, sessions: 380 },
  { time: "7-14 08:15 PM", throughput: 160, sessions: 500 },
  { time: "7-14 08:24 PM", throughput: 130, sessions: 420 },
  { time: "7-14 08:33 PM", throughput: 100, sessions: 350 },
  { time: "7-14 08:42 PM", throughput: 150, sessions: 480 },
];

export default function FirewallHistoricalPerformance({ go }) {
  const goBack = () => {
    const parent = localStorage.getItem("parentDashboard") || "Dashboards";
    if (go) go(parent);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 pb-2 border-b border-[var(--color-border)]">
        <button
          onClick={goBack}
          className="text-sm text-[var(--color-accent)] hover:underline flex items-center gap-1"
        >
          ← Back to Firewall Dashboard
        </button>
        <span className="text-sm text-[var(--color-muted)]">|</span>
        <span className="text-sm text-[var(--color-text)] font-medium">Firewall Historical Performance</span>
      </div>

      <h2 className="text-xl font-bold text-[var(--color-text)]">Firewall Historical Performance</h2>
      <Card>
        <div className="space-y-4">
          <div className="text-xs text-[var(--color-muted)]">Throughput (Mbps)</div>
          <div style={{ height: 120 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="time" tick={{ fontSize: 8, fill: "var(--color-faint)" }} tickLine={false} axisLine={false} interval={2} />
                <YAxis tick={{ fontSize: 8, fill: "var(--color-faint)" }} tickLine={false} axisLine={false} width={20} />
                <Tooltip contentStyle={{ background: "var(--color-panel)", border: "1px solid var(--color-border)", fontSize: "10px", color: "var(--color-text)" }} />
                <Line type="monotone" dataKey="throughput" stroke="var(--color-accent)" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-xs text-[var(--color-muted)]">Active Sessions</div>
          <div style={{ height: 120 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="time" tick={{ fontSize: 8, fill: "var(--color-faint)" }} tickLine={false} axisLine={false} interval={2} />
                <YAxis tick={{ fontSize: 8, fill: "var(--color-faint)" }} tickLine={false} axisLine={false} width={20} />
                <Tooltip contentStyle={{ background: "var(--color-panel)", border: "1px solid var(--color-border)", fontSize: "10px", color: "var(--color-text)" }} />
                <Line type="monotone" dataKey="sessions" stroke="var(--color-warn)" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>
    </div>
  );
}