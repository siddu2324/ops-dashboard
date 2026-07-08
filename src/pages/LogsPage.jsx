import React from "react";
import Card from "../components/common/Card";
import { T } from "../constants/theme";
import { logLines } from "../data/logs";

export default function LogsPage() {
  const lvlColor = { ERROR: T.crit, WARN: T.warn, INFO: T.muted };
  return (
    <Card title="Live tail · all services">
      <div style={{ fontFamily: T.mono, fontSize: 12.5, lineHeight: 1.9 }}>
        {logLines.map((l, i) => (
          <div
            key={i}
            className="flex gap-3"
            style={{ whiteSpace: "nowrap", overflow: "hidden" }}
          >
            <span style={{ color: T.faint }}>{l.ts}</span>
            <span style={{ color: lvlColor[l.lvl], width: 46 }}>
              {l.lvl}
            </span>
            <span style={{ color: T.accent }}>{l.svc}</span>
            <span
              style={{
                color: T.text,
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
            >
              {l.msg}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
