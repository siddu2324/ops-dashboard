import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  LogOut,
  User,
  Settings,
  ChevronDown,
  Menu,
} from "lucide-react";
import { logout, getRole } from "../../services/authService";

export default function Header({
  active,
  section,
  onNavigate,
  onToggleSidebar,
}) {
  const navigate = useNavigate();
  const role = getRole();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="flex items-center gap-4 px-5 shrink-0 h-14 border-b border-[var(--color-border)] bg-[var(--color-panel)] relative">
      {/* Hamburger button - Mobile only */}
      <button
        onClick={onToggleSidebar}
        className="lg:hidden bg-transparent border-none text-[var(--color-text)] cursor-pointer p-1 mr-1"
      >
        <Menu size={20} />
      </button>

      {/* Breadcrumb */}
      <div className="text-sm text-[var(--color-faint)]">
        {section !== active && (
          <span>
            {section}
            <span className="mx-1.5">/</span>
          </span>
        )}
        <span className="text-[var(--color-text)] font-semibold">
          {active}
        </span>
      </div>

      <div className="flex-1" />

      {/* Search */}
      <div className="flex items-center gap-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg px-3 py-1.5 w-64">
        <Search size={14} className="text-[var(--color-faint)]" />
        <input
          placeholder="Search hosts, alerts, dashboards…"
          className="bg-transparent border-none outline-none text-[var(--color-text)] text-sm w-full"
        />
      </div>

      {/* Status Badge */}
      <span className="font-mono text-xs text-[var(--color-warn)] border border-[var(--color-border)] rounded-full px-2.5 py-1">
        PROD · 2 degraded
      </span>

      {/* Notifications */}
      <button className="relative bg-transparent border-none text-[var(--color-muted)] cursor-pointer hover:text-[var(--color-text)] transition">
        <Bell size={17} />
        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[var(--color-crit)]" />
      </button>

      {/* User */}
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 bg-[var(--color-panel-alt)] border border-[var(--color-border)] rounded-full px-3 py-1 hover:bg-[var(--color-border)] transition cursor-pointer"
        >
          <div className="w-7 h-7 rounded-full bg-[var(--color-accent)] grid place-items-center text-[#06222A] text-xs font-bold">
            {role === "admin" ? "AD" : "US"}
          </div>

          <ChevronDown
            size={14}
            className="text-[var(--color-muted)]"
          />
        </button>

        {showDropdown && (
          <>
            {/* Click outside */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowDropdown(false)}
            />

            {/* Dropdown */}
            <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--color-panel)] border border-[var(--color-border)] rounded-xl shadow-xl z-20 py-1 overflow-hidden">
              <div className="px-4 py-2 border-b border-[var(--color-border)]">
                <div className="text-[var(--color-text)] text-sm font-semibold">
                  {role === "admin"
                    ? "Administrator"
                    : "User"}
                </div>

                <div className="text-[var(--color-muted)] text-xs">
                  Logged in
                </div>
              </div>

              {/* Profile */}
              <button
                onClick={() => {
                  setShowDropdown(false);

                  if (onNavigate) {
                    onNavigate("Profile", "user");
                  }
                }}
                className="flex items-center gap-3 w-full px-4 py-2 text-[var(--color-text)] hover:bg-[var(--color-panel-alt)] transition text-sm"
              >
                <User size={14} />
                Profile
              </button>

              {/* Settings */}
              {role === "admin" && (
                <button
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center gap-3 w-full px-4 py-2 text-[var(--color-text)] hover:bg-[var(--color-panel-alt)] transition text-sm"
                >
                  <Settings size={14} />
                  Settings
                </button>
              )}

              {/* Logout */}
              <button
                onClick={() => {
                  setShowDropdown(false);
                  handleLogout();
                }}
                className="flex items-center gap-3 w-full px-4 py-2 text-[var(--color-crit)] hover:bg-[var(--color-panel-alt)] transition text-sm border-t border-[var(--color-border)]"
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}