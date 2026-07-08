import React from "react";
import { T } from "../../constants/theme";

export default function ChartTooltip({
  active,
  payload,
  label,
}) {
  if (!active || !payload?.length) return null;

  return (
    <div
      style={{
        background: T.panelAlt,
        border: `1px solid ${T.border}`,
        borderRadius: 6,
        padding: "6px 10px",
        fontFamily: T.mono,
        fontSize: 12,
        color: T.text,
      }}
    >
      <div style={{ color: T.muted }}>
        {label}
      </div>

      <div>{payload[0].value}</div>
    </div>
  );
}