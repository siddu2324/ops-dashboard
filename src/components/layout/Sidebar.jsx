import { ChevronDown, ChevronRight, PanelLeftClose, PanelLeftOpen, Plus } from "lucide-react";
import { isAdmin } from "../../services/authService";

const ADMIN_ONLY_GROUPS = ["administration"];

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
  onItemClick,
}) {
  const admin = isAdmin();

  // Filter out admin-only groups for non-admins
  const filteredNavItems = admin
    ? navItems
    : navItems.filter((item) => !ADMIN_ONLY_GROUPS.includes(item.id));

  const go = (item, groupId) => {
    onNavigate(item, groupId);
    if (onItemClick) onItemClick();
  };

  const toggle = (id) => onToggle(id);

  // Recursive rendering for nested items
  const renderNavItem = (item, parentId = null) => {
    const isGroup = !!item.children;
    const hasNestedChildren = isGroup && item.children.length > 0 && typeof item.children[0] === 'object';
    const open = !!openGroups[item.id];
    const groupActive = isGroup && item.children && item.children.some((child) => 
      typeof child === 'string' ? child === active : child.children && child.children.includes(active)
    );
    const isActive = !isGroup && active === item.label;

    // If it's a group with nested children (like General, Plugins, etc.)
    if (isGroup && hasNestedChildren) {
      return (
        <div key={item.id}>
          <button
            onClick={() => toggle(item.id)}
            className={`flex items-center w-full gap-2.5 transition-colors
              ${collapsed ? "justify-center py-2.5 px-0" : "py-2 px-3.5 justify-start"}
              ${groupActive ? "bg-[var(--color-panel-alt)]" : ""}
              border-l-2
              ${groupActive ? "border-[var(--color-accent)]" : "border-transparent"}
              text-[${groupActive ? "var(--color-text)" : "var(--color-muted)"}]
              hover:text-[var(--color-text)] cursor-pointer`}
          >
            {typeof item.icon === "function" && <item.icon size={17} />}
            {!collapsed && (
              <>
                <span className="flex-1 text-left">{item.label}</span>
                {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </>
            )}
          </button>
          {open && !collapsed && (
            <div className="ml-4">
              {item.children.map((child) => renderNavItem(child, item.id))}
            </div>
          )}
        </div>
      );
    }

    // If it's a group with string children (like Monitoring, Infrastructure, etc.)
    if (isGroup && !hasNestedChildren) {
      const groupOpen = !!openGroups[item.id];
      const isActiveGroup = item.children && item.children.includes(active);

      return (
        <div key={item.id}>
          <button
            onClick={() => toggle(item.id)}
            className={`flex items-center w-full gap-2.5 transition-colors
              ${collapsed ? "justify-center py-2.5 px-0" : "py-2 px-3.5 justify-start"}
              ${isActiveGroup ? "bg-[var(--color-panel-alt)]" : ""}
              border-l-2
              ${isActiveGroup ? "border-[var(--color-accent)]" : "border-transparent"}
              text-[${isActiveGroup ? "var(--color-text)" : "var(--color-muted)"}]
              hover:text-[var(--color-text)] cursor-pointer`}
          >
            {typeof item.icon === "function" && <item.icon size={17} />}
            {!collapsed && (
              <>
                <span className="flex-1 text-left">{item.label}</span>
                {admin && (
                  <Plus
                    size={14}
                    onClick={(e) => {
                      e.stopPropagation();
                      addMenuItem(item.id);
                    }}
                  />
                )}
                {groupOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </>
            )}
          </button>
          {groupOpen && !collapsed && (
            <div>
              {item.children.map((child) => {
                if (typeof child === 'string') {
                  return (
                    <div key={child} className="flex items-center justify-between pr-3.5">
                      <button
                        onClick={() => go(child, item.id)}
                        className={`flex-1 text-left py-1.5 pl-10 pr-2
                          ${active === child ? "text-[var(--color-accent)]" : "text-[var(--color-faint)]"}
                          hover:text-[var(--color-text)] cursor-pointer`}
                      >
                        {child}
                      </button>
                      {admin && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeMenuItem(item.id, child);
                          }}
                          className="bg-transparent border-none text-red-400 cursor-pointer opacity-0 hover:opacity-100 transition-opacity text-sm p-1"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  );
                }
                return renderNavItem(child, item.id);
              })}
            </div>
          )}
        </div>
      );
    }

    // Single item (like Authentication, Home, etc.)
    return (
      <button
        key={item.id}
        onClick={() => go(item.label, parentId)}
        className={`flex items-center w-full gap-2.5 transition-colors
          ${collapsed ? "justify-center py-2.5 px-0" : "py-2 px-3.5 justify-start"}
          ${isActive ? "bg-[var(--color-panel-alt)]" : ""}
          border-l-2
          ${isActive ? "border-[var(--color-accent)]" : "border-transparent"}
          text-[${isActive ? "var(--color-text)" : "var(--color-muted)"}]
          hover:text-[var(--color-text)] cursor-pointer`}
      >
        {typeof item.icon === "function" && <item.icon size={17} />}
        {!collapsed && (
          <span className="flex-1 text-left">{item.label}</span>
        )}
      </button>
    );
  };

  return (
    <aside
      className="flex flex-col shrink-0 bg-[var(--color-panel)] border-r border-[var(--color-border)] transition-[width] duration-150"
      style={{ width: collapsed ? 64 : 236 }}
    >
      {/* Logo */}
      <div className="flex items-center justify-center px-4 h-14 border-b border-[var(--color-border)]">
        <img src="/logo.png" alt="AiOps360" className="h-10 w-auto" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2">
        {filteredNavItems.map((item) => renderNavItem(item))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => onCollapsedToggle(!collapsed)}
        className="h-11 bg-transparent border-none border-t border-[var(--color-border)] text-[var(--color-faint)] cursor-pointer flex items-center justify-center hover:text-[var(--color-text)] transition"
      >
        {collapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
      </button>
    </aside>
  );
}