import { useEffect } from "react";
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
import { exportToCSV } from "../utils/exportCSV";

export default function DashboardPage() {
  const { alerts, newAlertCount, resetNewAlertCount } = useAlertPolling(5000);

  // Reset count when component mounts
  useEffect(() => {
    resetNewAlertCount();
  }, []);

  // Export dashboard metrics
  const handleExport = () => {
    const combined = cpuSeries.map((cpu, index) => ({
      time: cpu.t,
      cpu: cpu.v,
      requests: reqSeries[index]?.v ?? 0,
    }));

    exportToCSV(combined, "dashboard-metrics.csv");
  };

  return (
    <div className="grid gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[var(--color-text)]">
          Dashboard
        </h2>

        <button
          onClick={handleExport}
          className="px-4 py-2 rounded-lg bg-[var(--color-accent)] text-[#06222A] font-semibold hover:opacity-90 transition"
        >
          Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">
        <Stat
          label="Active alerts"
          value={alerts.length}
          delta={`${newAlertCount} new`}
          tone="var(--color-crit)"
        />

        <Stat
          label="Hosts up"
          value="248"
          unit="/ 251"
          delta="99.2% fleet"
        />

        <Stat
          label="p95 latency"
          value="412"
          unit="ms"
          delta="-8% vs 24h"
        />

        <Stat
          label="Error rate"
          value="0.42"
          unit="%"
          delta="+0.11 pt"
          tone="var(--color-warn)"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(320px,1fr))]">
        {/* CPU */}
        <Card title="Fleet CPU · avg %">
          <div style={{ height: 200 }}>
            <ResponsiveContainer>
              <AreaChart
                data={cpuSeries}
                margin={{ top: 8, right: 8, left: -22, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="cpu" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="var(--color-accent)"
                      stopOpacity={0.35}
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--color-accent)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  stroke="var(--color-border)"
                  vertical={false}
                />

                <XAxis
                  dataKey="t"
                  stroke="var(--color-faint)"
                  tick={{
                    fontSize: 11,
                    fontFamily: "var(--font-mono)",
                  }}
                  tickLine={false}
                  axisLine={false}
                />

                <YAxis
                  stroke="var(--color-faint)"
                  tick={{
                    fontSize: 11,
                    fontFamily: "var(--font-mono)",
                  }}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 100]}
                />

                <Tooltip content={<ChartTooltip />} />

                <Area
                  type="monotone"
                  dataKey="v"
                  stroke="var(--color-accent)"
                  strokeWidth={2}
                  fill="url(#cpu)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Requests */}
        <Card title="Requests / min">
          <div style={{ height: 200 }}>
            <ResponsiveContainer>
              <BarChart
                data={reqSeries}
                margin={{ top: 8, right: 8, left: -14, bottom: 0 }}
              >
                <CartesianGrid
                  stroke="var(--color-border)"
                  vertical={false}
                />

                <XAxis
                  dataKey="t"
                  stroke="var(--color-faint)"
                  tick={{
                    fontSize: 11,
                    fontFamily: "var(--font-mono)",
                  }}
                  tickLine={false}
                  axisLine={false}
                />

                <YAxis
                  stroke="var(--color-faint)"
                  tick={{
                    fontSize: 11,
                    fontFamily: "var(--font-mono)",
                  }}
                  tickLine={false}
                  axisLine={false}
                />

                <Tooltip
                  content={<ChartTooltip />}
                  cursor={{ fill: "rgba(255,255,255,0.04)" }}
                />

                <Bar
                  dataKey="v"
                  fill="var(--color-accent)"
                  radius={[3, 3, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Alerts */}
      <Card
        title="Recent alerts"
        right={
          <span className="text-xs text-[var(--color-muted)]">
            Live
          </span>
        }
      >
        <div className="grid gap-2">
          {alerts.map((a, i) => (
            <div
              key={i}
              className="flex items-center gap-3 py-1"
            >
              <StatusDot state={a.sev} />

              <span className="text-[var(--color-text)] text-sm flex-1">
                {a.name}
              </span>

              <span className="text-[var(--color-muted)] text-xs">
                {a.src}
              </span>

              <span className="font-mono text-[var(--color-faint)] text-xs w-9 text-right">
                {a.age}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}