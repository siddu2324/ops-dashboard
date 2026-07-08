import React from "react";
import { T } from "../../constants/theme";

export default function Card({
  title,
  right,
  children,
  style,
}) {
  return (
    <div
      style={{
        background: T.panel,
        border: `1px solid ${T.border}`,
        borderRadius: 10,
        ...style,
      }}
    >
      {(title || right) && (
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <div
            style={{
              color: T.muted,
              fontSize: 12,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            {title}
          </div>

          {right}
        </div>
      )}

      <div className="px-4 pb-4">
        {children}
      </div>
    </div>
  );
}