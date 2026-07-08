import React from "react";
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
import { T } from "../constants/theme";
import { cpuSeries } from "../data/cpuSeries";
import { reqSeries } from "../data/reqSeries";
import { alerts } from "../data/alerts";

export default function DashboardPage() {
  return (
    <div className="grid gap-4">
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}
      >
        <Stat label="Active alerts" value="7" delta="+2 last hour" tone={T.crit} />
        <Stat label="Hosts up" value="248" unit="/ 251" delta="99.2% fleet" />
        <Stat label="p95 latency" value="412" unit="ms" delta="-8% vs 24h" />
        <Stat label="Error rate" value="0.42" unit="%" delta="+0.11 pt" tone={T.warn} />
      </div>
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}
      >
        <Card title="Fleet CPU · avg %">
          <div style={{ height: 200 }}>
            <ResponsiveContainer>
              <AreaChart
                data={cpuSeries}
                margin={{ top: 8, right: 8, left: -22, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="cpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={T.accent} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={T.accent} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={T.border} vertical={false} />
                <XAxis
                  dataKey="t"
                  stroke={T.faint}
                  tick={{ fontSize: 11, fontFamily: T.mono }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke={T.faint}
                  tick={{ fontSize: 11, fontFamily: T.mono }}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 100]}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke={T.accent}
                  strokeWidth={2}
                  fill="url(#cpu)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title="Requests / min">
          <div style={{ height: 200 }}>
            <ResponsiveContainer>
              <BarChart
                data={reqSeries}
                margin={{ top: 8, right: 8, left: -14, bottom: 0 }}
              >
                <CartesianGrid stroke={T.border} vertical={false} />
                <XAxis
                  dataKey="t"
                  stroke={T.faint}
                  tick={{ fontSize: 11, fontFamily: T.mono }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke={T.faint}
                  tick={{ fontSize: 11, fontFamily: T.mono }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  content={<ChartTooltip />}
                  cursor={{ fill: "rgba(255,255,255,0.04)" }}
                />
                <Bar dataKey="v" fill={T.accent} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      <Card title="Recent alerts">
        <div className="grid gap-2">
          {alerts.map((a, i) => (
            <div key={i} className="flex items-center gap-3 py-1">
              <StatusDot state={a.sev} />
              <span style={{ color: T.text, fontSize: 14, flex: 1 }}>
                {a.name}
              </span>
              <span style={{ color: T.muted, fontSize: 12 }}>{a.src}</span>
              <span
                style={{
                  fontFamily: T.mono,
                  color: T.faint,
                  fontSize: 12,
                  width: 36,
                  textAlign: "right",
                }}
              >
                {a.age}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
