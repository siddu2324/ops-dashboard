import React from "react";
import { Search, Bell } from "lucide-react";
import { T } from "../../constants/theme";

export default function Header({ active, section }) {
  return (
    <header
      className="flex items-center gap-4 px-5 shrink-0"
      style={{
        height: 56,
        borderBottom: `1px solid ${T.border}`,
        background: T.panel,
      }}
    >
      <div style={{ fontSize: 13, color: T.faint }}>
        {section !== active && (
          <span>
            {section} <span style={{ margin: "0 6px" }}>/</span>
          </span>
        )}
        <span style={{ color: T.text, fontWeight: 600 }}>{active}</span>
      </div>
      <div className="flex-1" />
      <div
        className="flex items-center gap-2"
        style={{
          background: T.bg,
          border: `1px solid ${T.border}`,
          borderRadius: 8,
          padding: "7px 12px",
          width: 260,
        }}
      >
        <Search size={14} color={T.faint} />
        <input
          placeholder="Search hosts, alerts, dashboards…"
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            color: T.text,
            fontSize: 13,
            width: "100%",
          }}
        />
      </div>
      <span
        style={{
          fontFamily: T.mono,
          fontSize: 11,
          color: T.warn,
          border: `1px solid ${T.border}`,
          borderRadius: 999,
          padding: "4px 10px",
        }}
      >
        PROD · 2 degraded
      </span>
      <button
        style={{
          position: "relative",
          background: "transparent",
          border: "none",
          color: T.muted,
          cursor: "pointer",
        }}
      >
        <Bell size={17} />
        <span
          style={{
            position: "absolute",
            top: -3,
            right: -4,
            width: 8,
            height: 8,
            borderRadius: 8,
            background: T.crit,
          }}
        />
      </button>
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: 999,
          background: T.panelAlt,
          border: `1px solid ${T.border}`,
          display: "grid",
          placeItems: "center",
          color: T.text,
          fontSize: 12,
          fontWeight: 600,
        }}
      >
        AR
      </div>
    </header>
  );
}
