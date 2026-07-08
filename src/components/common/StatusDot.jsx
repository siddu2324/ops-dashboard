import React from "react";
import { Circle } from "lucide-react";
import { T } from "../../constants/theme";

const sevColor = (s) =>
  s === "crit" ? T.crit : s === "warn" ? T.warn : T.ok;

export default function StatusDot({ state }) {
  return (
    <Circle
      size={8}
      fill={sevColor(state)}
      color={sevColor(state)}
    />
  );
}