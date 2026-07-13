import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";
import Card from "../components/common/Card";
import Stat from "../components/common/Stat";
import StatusDot from "../components/common/StatusDot";
import ChartTooltip from "../components/common/ChartTooltip";
import { cpuSeries } from "../data/cpuSeries";
import { reqSeries } from "../data/reqSeries";
import { useAlertPolling } from "../hooks/useAlertPolling";
import { initialEvents, generateNewEvent } from "../data/events";

// Severity badge colors
const severityColors = {
  Critical: "bg-[var(--color-crit)] text-white",
  High: "bg-[var(--color-crit)] text-white",
  Medium: "bg-[var(--color-warn)] text-[#06222A]",
  Low: "bg-[var(--color-ok)] text-[#06222A]",
};

export default function DashboardPage() {
  const { alerts, newAlertCount, resetNewAlertCount } = useAlertPolling(5000);
  const [events, setEvents] = useState(initialEvents);

  // Auto-refresh events every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const newEvent = generateNewEvent();
      setEvents((prev) => {
        // Check if event already exists, if so update count
        const existingIdx = prev.findIndex(e => e.name === newEvent.name);
        if (existingIdx !== -1) {
          const updated = [...prev];
          updated[existingIdx] = {
            ...updated[existingIdx],
            count: updated[existingIdx].count + Math.floor(Math.random() * 100),
            lastTriggered: newEvent.lastTriggered,
          };
          return updated;
        }
        return [newEvent, ...prev].slice(0, 10);
      });
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Reset count when component mounts
  useEffect(() => {
    resetNewAlertCount();
  }, []);

  return (
    <div className="grid gap-4">
      {/* Stats */}
      <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">
        <Stat
          label="Active alerts"
          value={alerts.length}
          delta={`${newAlertCount} new`}
          tone="var(--color-crit)"
        />
        <Stat label="Hosts up" value="248" unit="/ 251" delta="99.2% fleet" />
        <Stat label="p95 latency" value="412" unit="ms" delta="-8% vs 24h" />
        <Stat label="Error rate" value="0.42" unit="%" delta="+0.11 pt" tone="var(--color-warn)" />
      </div>

      {/* Charts */}
      <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(320px,1fr))]">
        <Card title="Fleet CPU · avg %">
          <div style={{ height: 200 }}>
            <ResponsiveContainer>
              <AreaChart data={cpuSeries} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
                <defs>
                  <linearGradient id="cpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="t" stroke="var(--color-faint)" tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-faint)" tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="v" stroke="var(--color-accent)" strokeWidth={2} fill="url(#cpu)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Requests / min">
          <div style={{ height: 200 }}>
            <ResponsiveContainer>
              <BarChart data={reqSeries} margin={{ top: 8, right: 8, left: -14, bottom: 0 }}>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="t" stroke="var(--color-faint)" tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-faint)" tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                <Bar dataKey="v" fill="var(--color-accent)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Alerts */}
      <Card title="Recent alerts" right={<span className="text-xs text-[var(--color-muted)]">Live</span>}>
        <div className="grid gap-2">
          {alerts.map((a, i) => (
            <div key={i} className="flex items-center gap-3 py-1">
              <StatusDot state={a.sev} />
              <span className="text-[var(--color-text)] text-sm flex-1">{a.name}</span>
              <span className="text-[var(--color-muted)] text-xs">{a.src}</span>
              <span className="font-mono text-[var(--color-faint)] text-xs w-9 text-right">{a.age}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Events Table */}
      <Card 
        title="Recent Events" 
        right={<span className="text-xs text-[var(--color-muted)]">Auto-refresh every 10s</span>}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-[var(--color-muted)] text-xs uppercase tracking-wider">
                <th className="py-2 px-3 font-medium">Event</th>
                <th className="py-2 px-3 font-medium">Type</th>
                <th className="py-2 px-3 font-medium">Severity</th>
                <th className="py-2 px-3 font-medium text-right">Count</th>
                <th className="py-2 px-3 font-medium">Last Triggered</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-panel-alt)] transition-colors">
                  <td className="py-2 px-3 text-[var(--color-text)] font-mono text-xs">
                    {event.name}
                  </td>
                  <td className="py-2 px-3 text-[var(--color-muted)] text-xs">
                    {event.type}
                  </td>
                  <td className="py-2 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${severityColors[event.severity] || severityColors.Medium}`}>
                      {event.severity}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right text-[var(--color-text)] font-mono text-sm">
                    {event.count.toLocaleString()}
                  </td>
                  <td className="py-2 px-3 text-[var(--color-faint)] text-xs">
                    {new Date(event.lastTriggered).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}