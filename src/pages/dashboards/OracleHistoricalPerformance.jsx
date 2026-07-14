// src/pages/dashboards/OracleHistoricalPerformance.jsx
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

// Mock data for each chart
const generateTimeData = () => {
  const times = [
    "7-14 07:49 PM",
    "7-14 07:57 PM",
    "7-14 08:06 PM",
    "7-14 08:15 PM",
    "7-14 08:24 PM",
    "7-14 08:33 PM",
    "7-14 08:42 PM",
  ];
  return {
    bufferCacheHit: times.map((t, i) => ({
      time: t,
      value: Math.floor(85 + Math.random() * 14),
    })),
    sga: times.map((t, i) => ({
      time: t,
      value: Math.floor(60 + Math.random() * 35),
    })),
    datafiles: times.map((t, i) => ({
      time: t,
      value: Math.floor(0 + Math.random() * 2),
    })),
    tablespaceFree: times.map((t, i) => ({
      time: t,
      value: Math.floor(0 + Math.random() * 2),
    })),
  };
};

export default function OracleHistoricalPerformance({ go }) {
  const [data] = useState(generateTimeData());

  const goBack = () => {
    const parent = localStorage.getItem("parentDashboard") || "Dashboards";
    if (go) go(parent);
  };

  return (
    <div className="space-y-4">
      {/* Back button and header */}
      <div className="flex items-center gap-4 pb-2 border-b border-[var(--color-border)]">
        <button
          onClick={goBack}
          className="text-sm text-[var(--color-accent)] hover:underline flex items-center gap-1"
        >
          ← Back to Oracle Monitoring
        </button>
        <span className="text-sm text-[var(--color-muted)]">|</span>
        <span className="text-sm text-[var(--color-text)] font-medium">Oracle Historical Performance</span>
      </div>

      <h2 className="text-xl font-bold text-[var(--color-text)]">
        Oracle: SGA, buffer cache
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Buffer Cache Hit Ratio */}
        <Card title="Oracle: Buffer cache hit ratio">
          <div style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.bufferCacheHit}>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 9, fill: "var(--color-faint)" }}
                  tickLine={false}
                  axisLine={false}
                  interval={2}
                />
                <YAxis
                  tick={{ fontSize: 9, fill: "var(--color-faint)" }}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 100]}
                  width={20}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-panel)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "6px",
                    fontSize: "10px",
                    color: "var(--color-text)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="var(--color-accent)"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "var(--color-accent)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Datafiles Count */}
        <Card title="Oracle: Datafiles count">
          <div style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.datafiles}>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 9, fill: "var(--color-faint)" }}
                  tickLine={false}
                  axisLine={false}
                  interval={2}
                />
                <YAxis
                  tick={{ fontSize: 9, fill: "var(--color-faint)" }}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 2]}
                  width={20}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-panel)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "6px",
                    fontSize: "10px",
                    color: "var(--color-text)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="var(--color-warn)"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "var(--color-warn)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* TBS SYSTEM Tablespace free */}
        <Card title="Oracle: TBS SYSTEM: Tablespace free, bytes">
          <div style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.tablespaceFree}>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 9, fill: "var(--color-faint)" }}
                  tickLine={false}
                  axisLine={false}
                  interval={2}
                />
                <YAxis
                  tick={{ fontSize: 9, fill: "var(--color-faint)" }}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 2]}
                  width={20}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-panel)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "6px",
                    fontSize: "10px",
                    color: "var(--color-text)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="var(--color-ok)"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "var(--color-ok)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* SGA (extra chart) */}
        <Card title="Oracle: SGA">
          <div style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.sga}>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 9, fill: "var(--color-faint)" }}
                  tickLine={false}
                  axisLine={false}
                  interval={2}
                />
                <YAxis
                  tick={{ fontSize: 9, fill: "var(--color-faint)" }}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 100]}
                  width={20}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-panel)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "6px",
                    fontSize: "10px",
                    color: "var(--color-text)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="var(--color-crit)"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "var(--color-crit)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}