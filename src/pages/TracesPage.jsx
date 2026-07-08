import React from "react";
import Card from "../components/common/Card";
import StatusDot from "../components/common/StatusDot";
import { T } from "../constants/theme";
import { traces } from "../data/traces";

export default function TracesPage() {
  return (
    <Card title="Recent traces">
      <div className="grid gap-2">
        {traces.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-3 py-1"
            style={{ fontSize: 13 }}
          >
            <StatusDot state={t.status} />
            <span style={{ fontFamily: T.mono, color: T.faint, width: 90 }}>
              {t.id}
            </span>
            <span style={{ color: T.text, flex: 1 }}>{t.op}</span>
            <span style={{ fontFamily: T.mono, color: T.muted }}>
              {t.spans} spans
            </span>
            <span
              style={{
                fontFamily: T.mono,
                color:
                  t.status === "crit"
                    ? T.crit
                    : t.status === "warn"
                      ? T.warn
                      : T.ok,
                width: 64,
                textAlign: "right",
              }}
            >
              {t.dur}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
