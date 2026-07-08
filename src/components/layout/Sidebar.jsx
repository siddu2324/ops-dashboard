import React from "react";
import {
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { T } from "../../constants/theme";
import { NAV } from "../../constants/navigation";

export default function Sidebar({
  active,
  collapsed,
  openGroups,
  onToggle,
  onNavigate,
  onCollapsedToggle,
}) {
  const go = (item, groupId) => {
    onNavigate(item, groupId);
  };
  const toggle = (id) => onToggle(id);

  return (
    <aside
      className="flex flex-col shrink-0"
      style={{
        width: collapsed ? 64 : 236,
        borderRight: `1px solid ${T.border}`,
        background: T.panel,
        transition: "width 160ms ease",
      }}
    >
      <div
        className="flex items-center gap-2 px-4"
        style={{ height: 56, borderBottom: `1px solid ${T.border}` }}
      >
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: 7,
            background: T.accent,
            display: "grid",
            placeItems: "center",
            color: "#06222A",
            fontWeight: 800,
            fontSize: 13,
            fontFamily: T.mono,
          }}
        >
          O
        </div>
        {!collapsed && (
          <span
            style={{
              color: T.text,
              fontWeight: 700,
              fontSize: 15,
              letterSpacing: "-0.01em",
            }}
          >
            OpsDeck
          </span>
        )}
      </div>

      <nav
        className="flex-1 overflow-y-auto py-2"
        style={{ scrollbarWidth: "thin" }}
      >
        {NAV.map((n) => {
          const isGroup = !!n.children;
          const open = !!openGroups[n.id];
          const groupActive = isGroup && n.children.includes(active);
          return (
            <div key={n.id}>
              <button
                onClick={() => (isGroup ? toggle(n.id) : go(n.label))}
                title={collapsed ? n.label : undefined}
                className="flex items-center w-full"
                style={{
                  gap: 10,
                  padding: collapsed ? "10px 0" : "9px 14px",
                  justifyContent: collapsed ? "center" : "flex-start",
                  background:
                    !isGroup && active === n.label
                      ? T.panelAlt
                      : "transparent",
                  borderLeft: `2px solid ${
                    (!isGroup && active === n.label) || groupActive
                      ? T.accent
                      : "transparent"
                  }`,
                  color:
                    groupActive || active === n.label ? T.text : T.muted,
                  border: "none",
                  cursor: "pointer",
                  fontSize: 13.5,
                  fontWeight: 500,
                }}
              >
                <n.icon size={17} />
                {!collapsed && (
                  <span style={{ flex: 1, textAlign: "left" }}>
                    {n.label}
                  </span>
                )}
                {!collapsed && isGroup && (
                  open ? (
                    <ChevronDown size={14} />
                  ) : (
                    <ChevronRight size={14} />
                  )
                )}
              </button>
              {isGroup && open && !collapsed && (
                <div style={{ paddingBottom: 4 }}>
                  {n.children.map((c) => (
                    <button
                      key={c}
                      onClick={() => go(c, n.id)}
                      className="block w-full"
                      style={{
                        textAlign: "left",
                        padding: "6px 14px 6px 41px",
                        fontSize: 13,
                        color: active === c ? T.accent : T.faint,
                        background:
                          active === c
                            ? "rgba(34,211,238,0.06)"
                            : "transparent",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <button
        onClick={() => onCollapsedToggle(!collapsed)}
        className="flex items-center justify-center"
        style={{
          height: 44,
          background: "transparent",
          border: "none",
          borderTop: `1px solid ${T.border}`,
          color: T.faint,
          cursor: "pointer",
        }}
      >
        {collapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
      </button>
    </aside>
  );
}
