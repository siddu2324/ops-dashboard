import React from "react";
import Card from "./Card";
import { T } from "../../constants/theme";

export default function Stat({
  label,
  value,
  unit,
  delta,
  tone,
}) {
  return (
    <Card>
      <div
        style={{
          color: T.muted,
          fontSize: 12,
          marginTop: 10,
        }}
      >
        {label}
      </div>

      <div
        className="flex items-baseline gap-2"
        style={{ marginTop: 4 }}
      >
        <span
          style={{
            fontFamily: T.mono,
            fontSize: 28,
            color: T.text,
          }}
        >
          {value}
        </span>

        {unit && (
          <span
            style={{
              color: T.faint,
              fontSize: 13,
            }}
          >
            {unit}
          </span>
        )}
      </div>

      {delta && (
        <div
          style={{
            fontFamily: T.mono,
            fontSize: 12,
            color: tone || T.ok,
            marginTop: 2,
          }}
        >
          {delta}
        </div>
      )}
    </Card>
  );
}