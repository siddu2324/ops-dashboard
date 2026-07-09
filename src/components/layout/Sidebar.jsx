import {
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
} from "lucide-react";
import { isAdmin } from "../../services/authService";

// Admin-only group IDs (these will be completely hidden for users)
const ADMIN_ONLY_GROUPS = ["administration", "reports"]; // feel free to add more

export default function Sidebar({
  navItems,
  active,
  collapsed,
  openGroups,
  onToggle,
  onNavigate,
  onCollapsedToggle,
  addMenuItem,
  removeMenuItem,
  onItemClick, // 👈 new prop
}) {
  const admin = isAdmin();

  // Filter nav items: if not admin, hide admin-only groups
  const filteredNavItems = admin
    ? navItems
    : navItems.filter((item) => !ADMIN_ONLY_GROUPS.includes(item.id));

  const go = (item, groupId) => {
    onNavigate(item, groupId);

    // Close mobile sidebar if callback exists
    if (onItemClick) {
      onItemClick();
    }
  };

  const toggle = (id) => onToggle(id);

  return (
    <aside
      className="flex flex-col shrink-0 bg-[var(--color-panel)] border-r border-[var(--color-border)] transition-[width] duration-150"
      style={{ width: collapsed ? 64 : 236 }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 h-14 border-b border-[var(--color-border)]">
        <div className="w-6.5 h-6.5 rounded-lg bg-[var(--color-accent)] grid place-items-center text-[#06222A] font-extrabold">
          O
        </div>

        {!collapsed && (
          <span className="text-[var(--color-text)] font-bold">
            OpsDeck
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2">
        {filteredNavItems.map((n) => {
          const isGroup = !!n.children;
          const open = !!openGroups[n.id];
          const groupActive = isGroup && n.children.includes(active);

          return (
            <div key={n.id}>
              <button
                onClick={() => (isGroup ? toggle(n.id) : go(n.label))}
                className={`flex items-center w-full gap-2.5 transition-colors
                  ${collapsed ? "justify-center py-2.5 px-0" : "py-2 px-3.5 justify-start"}
                  ${(!isGroup && active === n.label) || groupActive ? "bg-[var(--color-panel-alt)]" : ""}
                  border-l-2
                  ${(!isGroup && active === n.label) || groupActive ? "border-[var(--color-accent)]" : "border-transparent"}
                  text-[${groupActive || active === n.label ? "var(--color-text)" : "var(--color-muted)"}]
                  hover:bg-[var(--color-panel-alt)] cursor-pointer`}
              >
                {typeof n.icon === "function" && <n.icon size={17} />}

                {!collapsed && (
                  <>
                    <span className="flex-1 text-left">{n.label}</span>

                    {/* Only show add button if admin */}
                    {admin && isGroup && (
                      <Plus
                        size={14}
                        onClick={(e) => {
                          e.stopPropagation();
                          addMenuItem(n.id);
                        }}
                      />
                    )}

                    {isGroup &&
                      (open ? (
                        <ChevronDown size={14} />
                      ) : (
                        <ChevronRight size={14} />
                      ))}
                  </>
                )}
              </button>

              {isGroup && open && !collapsed && (
                <div>
                  {n.children.map((c) => (
                    <div
                      key={c}
                      className="flex items-center justify-between pr-3.5"
                    >
                      <button
                        onClick={() => go(c, n.id)}
                        className={`flex-1 text-left py-1.5 pl-10 pr-2
                          ${
                            active === c
                              ? "bg-[rgba(34,211,238,0.06)] text-[var(--color-accent)]"
                              : "text-[var(--color-faint)]"
                          }
                          hover:bg-[var(--color-panel-alt)] cursor-pointer`}
                      >
                        {c}
                      </button>

                      {/* Only show remove button if admin */}
                      {admin && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeMenuItem(n.id, c);
                          }}
                          className="bg-transparent border-none text-red-400 cursor-pointer opacity-0 hover:opacity-100 transition-opacity text-sm p-1"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => onCollapsedToggle(!collapsed)}
        className="h-11 bg-transparent border-none border-t border-[var(--color-border)] text-[var(--color-faint)] cursor-pointer flex items-center justify-center"
      >
        {collapsed ? (
          <PanelLeftOpen size={17} />
        ) : (
          <PanelLeftClose size={17} />
        )}
      </button>
    </aside>
  );
}