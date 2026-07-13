import { useState } from "react";
import { Search, Plus, ChevronRight, ChevronDown } from "lucide-react";
import { toast } from "react-hot-toast";
import Card from "../components/common/Card";

export default function AlertingSettingsPage() {
  const [alertmanagers, setAlertmanagers] = useState([
    { id: "builtin", name: "Grafana built-in", type: "Built-in", status: "Receiving Grafana-managed alerts", enabled: true },
  ]);

  const handleAdd = () => {
    toast.success("Add new Alertmanager form would open here");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Settings</h1>
        <p className="text-sm text-[var(--color-muted)]">
          Manage Alertmanager configurations and enable receiving Grafana-managed alerts
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[var(--color-text)]">Alert managers</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-faint)]" />
            <input
              type="text"
              placeholder="Search..."
              className="w-48 pl-9 pr-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent text-sm"
            />
          </div>
          <span className="text-xs text-[var(--color-muted)] bg-[var(--color-panel-alt)] px-2 py-1 rounded border border-[var(--color-border)]">
            ctrl+k
          </span>
          <button
            onClick={handleAdd}
            className="flex items-center gap-1 px-3 py-1.5 bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90 transition text-sm"
          >
            <Plus size={14} />
            Add new Alertmanager
          </button>
        </div>
      </div>

      <Card>
        <div className="space-y-2">
          {alertmanagers.map((am) => (
            <div
              key={am.id}
              className="flex items-center justify-between p-3 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-panel-alt)] transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[var(--color-ok)]" />
                <div>
                  <div className="text-[var(--color-text)] font-medium">{am.name}</div>
                  <div className="text-xs text-[var(--color-muted)]">{am.type}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-[var(--color-ok)]">{am.status}</span>
                <button className="text-xs text-[var(--color-accent)] hover:underline">View configuration</button>
                <button className="text-xs text-[var(--color-crit)] hover:underline">Disable</button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}