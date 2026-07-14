// src/pages/dashboards/FirewallHistoricalPerformance.jsx
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
import { X, AlertCircle, Clock } from "lucide-react";

const mockData = [
  { time: "7-14 07:49 PM", throughput: 120, sessions: 400 },
  { time: "7-14 08:15 PM", throughput: 140, sessions: 450 },
  { time: "7-14 08:24 PM", throughput: 110, sessions: 380 },
  { time: "7-14 08:33 PM", throughput: 160, sessions: 500 },
  { time: "7-14 08:42 PM", throughput: 130, sessions: 420 },
  { time: "7-14 08:51 PM", throughput: 100, sessions: 350 },
  { time: "7-14 09:00 PM", throughput: 150, sessions: 480 },
];

// ---- Problem Detail Modal ----
const PointDetailModal = ({ isOpen, onClose, point, metricType }) => {
  if (!isOpen || !point) return null;

  const title = `${metricType} spike detected at ${point.time}`;
  const confidence = Math.floor(70 + Math.random() * 25);
  const rootCause = `The ${metricType} value reached ${point[metricType]} at ${point.time}. This may indicate increased network traffic or a potential issue.`;
  const metrics = [
    `${metricType}: ${point[metricType]}`,
    `Time: ${point.time}`,
    `Active sessions: ${point.sessions}`
  ];
  const recommendation = `Investigate the spike in ${metricType}. Check for unusual activity, review firewall logs, and verify if this aligns with expected traffic patterns.`;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
          <div className="flex items-center gap-3">
            <AlertCircle size={20} className="text-[var(--color-crit)]" />
            <div>
              <h3 className="text-xl font-bold text-[var(--color-text)]">{title}</h3>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-xs bg-[var(--color-panel-alt)] px-2 py-0.5 rounded border border-[var(--color-border)] text-[var(--color-muted)]">
                  Firewall Historical
                </span>
                <span className="text-xs text-[var(--color-muted)]">Time {point.time}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl hover:bg-[var(--color-border)]/10 transition flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-text)]"
          >
            <X size={22} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <span className="text-[var(--color-muted)]">As of {new Date().toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
            <span className="text-xs font-mono text-[var(--color-faint)]">Reference ID FW-{point.time.replace(/[^a-zA-Z0-9]/g, '')}</span>
          </div>

          <div className="bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)] p-4">
            <p className="text-sm text-[var(--color-text)]">
              Live resource snapshot for Firewall at {point.time}.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-2">
              <h4 className="text-sm font-semibold text-[var(--color-text)] uppercase tracking-wider">Root Cause Analysis</h4>
              <span className="text-xs font-bold text-[var(--color-accent)] bg-[var(--color-accent)]/10 px-2 py-0.5 rounded-full border border-[var(--color-accent)]/20">
                {confidence}% CONFIDENCE
              </span>
            </div>
            <p className="text-sm text-[var(--color-text)] leading-relaxed">{rootCause}</p>
            <ul className="mt-3 space-y-1">
              {metrics.map((metric, i) => (
                <li key={i} className="text-sm text-[var(--color-muted)] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]"></span>
                  {metric}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[var(--color-text)] uppercase tracking-wider mb-2">Recommended Action</h4>
            <div className="bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)] p-4">
              <p className="text-sm text-[var(--color-text)] leading-relaxed">{recommendation}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-4 border-t border-[var(--color-border)] bg-[var(--color-bg)] px-6">
          <button
            onClick={() => alert('Marked as reviewed')}
            className="px-4 py-2 text-sm border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-border)]/10 transition text-[var(--color-text)]"
          >
            Mark reviewed
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90 transition shadow-lg shadow-[var(--color-accent)]/20"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default function FirewallHistoricalPerformance({ go }) {
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [metricType, setMetricType] = useState("throughput");

  const goBack = () => {
    const parent = localStorage.getItem("parentDashboard") || "Dashboards";
    if (go) go(parent);
  };

  const handlePointClick = (data) => {
    if (data && data.activePayload && data.activePayload.length > 0) {
      const payload = data.activePayload[0].payload;
      setSelectedPoint(payload);
      setMetricType(data.activePayload[0].dataKey);
      setModalOpen(true);
    }
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
          <div className="text-xs text-[var(--color-muted)]">Throughput (Mbps) – click a point for details</div>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData} onClick={handlePointClick}>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="time" tick={{ fontSize: 9, fill: "var(--color-faint)" }} tickLine={false} axisLine={false} interval={1} />
                <YAxis tick={{ fontSize: 9, fill: "var(--color-faint)" }} tickLine={false} axisLine={false} width={25} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-panel)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "6px",
                    fontSize: "10px",
                    color: "var(--color-text)",
                  }}
                  cursor={{ stroke: "var(--color-border)", strokeWidth: 1, strokeDasharray: "4 4" }}
                />
                <Line
                  type="monotone"
                  dataKey="throughput"
                  stroke="var(--color-accent)"
                  strokeWidth={2}
                  dot={{ r: 5, fill: "var(--color-accent)" }}
                  activeDot={{ r: 8, onClick: (e, data) => handlePointClick({ activePayload: [{ payload: data.payload, dataKey: "throughput" }] }) }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-xs text-[var(--color-muted)]">Active Sessions – click a point for details</div>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData} onClick={handlePointClick}>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="time" tick={{ fontSize: 9, fill: "var(--color-faint)" }} tickLine={false} axisLine={false} interval={1} />
                <YAxis tick={{ fontSize: 9, fill: "var(--color-faint)" }} tickLine={false} axisLine={false} width={25} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-panel)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "6px",
                    fontSize: "10px",
                    color: "var(--color-text)",
                  }}
                  cursor={{ stroke: "var(--color-border)", strokeWidth: 1, strokeDasharray: "4 4" }}
                />
                <Line
                  type="monotone"
                  dataKey="sessions"
                  stroke="var(--color-warn)"
                  strokeWidth={2}
                  dot={{ r: 5, fill: "var(--color-warn)" }}
                  activeDot={{ r: 8, onClick: (e, data) => handlePointClick({ activePayload: [{ payload: data.payload, dataKey: "sessions" }] }) }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>

      <PointDetailModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        point={selectedPoint}
        metricType={metricType}
      />
    </div>
  );
}