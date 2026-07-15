import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  LogOut,
  User,
  Settings,
  ChevronDown,
  Menu,
  BellOff,
  LayoutDashboard,
  FileText,
} from "lucide-react";
import { logout, getRole } from "../../services/authService";
import { useWebSocket } from "../../context/WebSocketContext";
import { logAction } from "../../services/auditService";
import { NAV } from "../../constants/navigation";
import { defaultDashboards } from "../../data/defaultDashboards";

// Flatten navigation items to get all page names
const getAllPages = () => {
  const pages = [];
  const flatten = (items) => {
    items.forEach((item) => {
      if (item.children && Array.isArray(item.children)) {
        // If children are strings (simple pages)
        if (typeof item.children[0] === "string") {
          item.children.forEach((child) => {
            pages.push({ name: child, type: "page", category: item.label });
          });
        } else {
          // Nested children (like Administration -> General -> Settings)
          item.children.forEach((child) => {
            if (child.children) {
              child.children.forEach((sub) => {
                if (typeof sub === "string") {
                  pages.push({ name: sub, type: "page", category: child.label });
                }
              });
            } else if (typeof child === "string") {
              pages.push({ name: child, type: "page", category: item.label });
            }
          });
        }
      }
    });
  };
  flatten(NAV);
  return pages;
};

const allPages = getAllPages();

export default function Header({
  active,
  section,
  onNavigate,
  onToggleSidebar,
}) {
  const navigate = useNavigate();
  const role = getRole();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const searchRef = useRef(null);
  const { connectionStatus } = useWebSocket();

  const handleLogout = () => {
    logAction("logout", { user: getRole() });
    logout();
    navigate("/login");
  };

  // Search logic
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const term = searchTerm.toLowerCase().trim();
    const results = [];

    // Search dashboards
    defaultDashboards.forEach((dash) => {
      if (dash.name.toLowerCase().includes(term)) {
        results.push({
          name: dash.name,
          type: "dashboard",
          id: dash.id,
          category: "Dashboard",
          icon: LayoutDashboard,
        });
      }
    });

    // Search pages
    allPages.forEach((page) => {
      if (page.name.toLowerCase().includes(term)) {
        // Avoid duplicates (if a dashboard and page have same name)
        if (!results.some((r) => r.name === page.name && r.type === "dashboard")) {
          results.push({
            name: page.name,
            type: "page",
            category: page.category || "Page",
            icon: FileText,
          });
        }
      }
    });

    // Limit results to avoid clutter
    setSearchResults(results.slice(0, 10));
    setShowSearchResults(results.length > 0);
  }, [searchTerm]);

  const handleSearchSelect = (result) => {
    setSearchTerm("");
    setShowSearchResults(false);
    if (result.type === "dashboard") {
      // Navigate to DashboardView with the selected dashboard ID
      localStorage.setItem("selectedDashboard", String(result.id));
      if (onNavigate) {
        onNavigate("DashboardView", "Dashboards");
      }
    } else if (result.type === "page") {
      if (onNavigate) {
        onNavigate(result.name, result.category);
      }
    }
  };

  // Close search on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

      {/* Search with results dropdown */}
      <div className="relative" ref={searchRef}>
        <div className="flex items-center gap-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg px-3 py-1.5 w-64">
          <Search size={14} className="text-[var(--color-faint)]" />
          <input
            placeholder="Search…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => {
              if (searchTerm.trim() && searchResults.length > 0) {
                setShowSearchResults(true);
              }
            }}
            className="bg-transparent border-none outline-none text-[var(--color-text)] text-sm w-full"
          />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm("");
                setShowSearchResults(false);
              }}
              className="text-[var(--color-muted)] hover:text-[var(--color-text)]"
            >
              ✕
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {showSearchResults && (
          <div className="absolute right-0 top-full mt-2 w-96 max-h-80 overflow-y-auto bg-[var(--color-panel)] border border-[var(--color-border)] rounded-xl shadow-xl z-50 py-2">
            {searchResults.length === 0 ? (
              <div className="px-4 py-3 text-sm text-[var(--color-muted)]">
                No results found
              </div>
            ) : (
              searchResults.map((result, index) => {
                const Icon = result.icon || FileText;
                return (
                  <button
                    key={index}
                    onClick={() => handleSearchSelect(result)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--color-panel-alt)] transition text-left"
                  >
                    <Icon size={16} className="text-[var(--color-muted)] flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-[var(--color-text)] truncate">
                        {result.name}
                      </div>
                      <div className="text-xs text-[var(--color-muted)]">
                        {result.type === "dashboard" ? "Dashboard" : "Page"} · {result.category}
                      </div>
                    </div>
                    {result.type === "dashboard" && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-accent)]/20 text-[var(--color-accent)]">
                        Dashboard
                      </span>
                    )}
                  </button>
                );
              })
            )}
            {searchResults.length > 0 && (
              <div className="px-4 py-2 border-t border-[var(--color-border)] text-xs text-[var(--color-faint)]">
                {searchResults.length} result{searchResults.length > 1 ? "s" : ""}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ❌ REMOVED: Status Badge (PROD · 2 degraded) */}

      {/* WebSocket Connection Status Indicator */}
      <span className="flex items-center gap-1.5 font-mono text-xs border border-[var(--color-border)] rounded-full px-2.5 py-1">
        <span
          className={`w-2 h-2 rounded-full inline-block ${
            connectionStatus === "connected"
              ? "bg-[var(--color-ok)]"
              : connectionStatus === "connecting"
              ? "bg-[var(--color-warn)]"
              : "bg-[var(--color-crit)]"
          }`}
        />
        {connectionStatus}
      </span>

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative bg-transparent border-none text-[var(--color-muted)] cursor-pointer hover:text-[var(--color-text)] transition"
        >
          <Bell size={17} />
        </button>

        {showNotifications && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowNotifications(false)}
            />
            <div className="absolute right-0 top-full mt-2 w-72 bg-[var(--color-panel)] border border-[var(--color-border)] rounded-xl shadow-xl z-20 py-3 overflow-hidden">
              <div className="px-4 pb-2 border-b border-[var(--color-border)]">
                <span className="text-sm font-semibold text-[var(--color-text)]">Notifications</span>
              </div>
              <div className="flex flex-col items-center justify-center py-8 px-4">
                <BellOff size={32} className="text-[var(--color-faint)] mb-3" />
                <p className="text-[var(--color-text)] font-medium">No notifications</p>
                <p className="text-[var(--color-muted)] text-sm">You're all caught up!</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* User dropdown (unchanged) */}
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 bg-[var(--color-panel-alt)] border border-[var(--color-border)] rounded-full px-3 py-1 hover:bg-[var(--color-border)] transition cursor-pointer"
        >
          <div className="w-7 h-7 rounded-full bg-[var(--color-accent)] grid place-items-center text-[#06222A] text-xs font-bold">
            {role === "admin" ? "AD" : "US"}
          </div>
          <ChevronDown size={14} className="text-[var(--color-muted)]" />
        </button>

        {showDropdown && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowDropdown(false)}
            />
            <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--color-panel)] border border-[var(--color-border)] rounded-xl shadow-xl z-20 py-1 overflow-hidden">
              <div className="px-4 py-2 border-b border-[var(--color-border)]">
                <div className="text-[var(--color-text)] text-sm font-semibold">
                  {role === "admin" ? "Administrator" : "User"}
                </div>
                <div className="text-[var(--color-muted)] text-xs">Logged in</div>
              </div>

              <button
                onClick={() => {
                  setShowDropdown(false);
                  if (onNavigate) onNavigate("Profile", "user");
                }}
                className="flex items-center gap-3 w-full px-4 py-2 text-[var(--color-text)] hover:bg-[var(--color-panel-alt)] transition text-sm"
              >
                <User size={14} />
                Profile
              </button>

              {role === "admin" && (
                <button
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center gap-3 w-full px-4 py-2 text-[var(--color-text)] hover:bg-[var(--color-panel-alt)] transition text-sm"
                >
                  <Settings size={14} />
                  Settings
                </button>
              )}

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