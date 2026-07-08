import React from "react";
import Card from "../components/common/Card";
import Stat from "../components/common/Stat";
import StatusDot from "../components/common/StatusDot";
import { T } from "../constants/theme";
import { alerts } from "../data/alerts";

export default function AlertingPage() {
  return (
    <div className="grid gap-4">
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}
      >
        <Stat label="Firing" value="7" tone={T.crit} delta="2 critical" />
        <Stat label="Acknowledged" value="3" tone={T.warn} delta="oldest 42m" />
        <Stat label="Silenced" value="12" delta="4 expire today" tone={T.muted} />
      </div>
      <Card title="Firing now">
        <div className="grid gap-2">
          {alerts
            .filter((a) => a.sev !== "ok")
            .map((a, i) => (
              <div key={i} className="flex items-center gap-3 py-1">
                <StatusDot state={a.sev} />
                <span style={{ color: T.text, fontSize: 14, flex: 1 }}>
                  {a.name}
                </span>
                <span style={{ color: T.muted, fontSize: 12 }}>{a.src}</span>
                <button
                  style={{
                    background: T.panelAlt,
                    border: `1px solid ${T.border}`,
                    color: T.text,
                    fontSize: 12,
                    padding: "4px 10px",
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                >
                  Acknowledge
                </button>
              </div>
            ))}
        </div>
      </Card>
    </div>
  );
}
