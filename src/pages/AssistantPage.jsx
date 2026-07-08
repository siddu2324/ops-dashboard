import React from "react";
import Card from "../components/common/Card";
import { T } from "../constants/theme";

export default function AssistantPage() {
  return (
    <Card title="AI Assistant">
      <div className="grid gap-3" style={{ maxWidth: 720 }}>
        <div
          style={{
            background: T.panelAlt,
            border: `1px solid ${T.border}`,
            borderRadius: 10,
            padding: "12px 14px",
            fontSize: 14,
            color: T.text,
          }}
        >
          <span
            style={{
              color: T.accent,
              fontFamily: T.mono,
              fontSize: 12,
              display: "block",
              marginBottom: 6,
            }}
          >
            ASSISTANT
          </span>
          The spike in p95 latency at 10:40 correlates with connection-pool exhaustion on
          prod-db-02. Two alerts and 14 error logs point to the same host. Suggested
          action: raise the pool limit or fail over reads to prod-db-03.
        </div>
        <div className="flex gap-2">
          <input
            placeholder="Ask about your infrastructure…"
            style={{
              flex: 1,
              background: T.panelAlt,
              border: `1px solid ${T.border}`,
              borderRadius: 8,
              padding: "10px 12px",
              color: T.text,
              fontSize: 14,
              outline: "none",
            }}
          />
          <button
            style={{
              background: T.accent,
              color: "#06222A",
              border: "none",
              borderRadius: 8,
              padding: "10px 16px",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Send
          </button>
        </div>
      </div>
    </Card>
  );
}
