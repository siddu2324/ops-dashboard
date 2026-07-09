import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import Card from "../components/common/Card";
import { logAction } from "../services/auditService"; // ✅ Added import

// Load preferences from localStorage, or use defaults
const getDefaultPrefs = () => ({
  theme: localStorage.getItem("theme") || "dark",
  defaultPage: localStorage.getItem("defaultPage") || "Dashboards",
  emailNotifications: localStorage.getItem("emailNotifications") === "true" || true,
  pushNotifications: localStorage.getItem("pushNotifications") === "true" || true,
});

export default function PreferencesPage() {
  const [prefs, setPrefs] = useState(getDefaultPrefs);
  const [isLoading, setIsLoading] = useState(false);

  // Save individual preference and show toast
  const savePreference = (key, value) => {
    setIsLoading(true);
    setTimeout(() => {
      localStorage.setItem(key, String(value));
      setPrefs((prev) => ({ ...prev, [key]: value }));

      // Apply theme immediately
      if (key === "theme") {
        applyTheme(value);
      }

      // ✅ Log preference change
      logAction("preference_changed", { key, value });

      toast.success(`${key.replace(/([A-Z])/g, " $1").trim()} updated`);
      setIsLoading(false);
    }, 300);
  };

  // Apply dark/light theme
  const applyTheme = (theme) => {
    if (theme === "light") {
      document.documentElement.classList.remove("dark");
      document.documentElement.style.backgroundColor = "#f3f4f6";
    } else {
      document.documentElement.classList.add("dark");
      document.documentElement.style.backgroundColor = "";
    }
  };

  // Apply theme on mount
  useEffect(() => {
    applyTheme(prefs.theme);
  }, []);

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <Card title="Preferences">
        <div className="space-y-5">
          {/* Theme toggle */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[var(--color-text)] font-medium">Theme</div>
              <div className="text-[var(--color-muted)] text-sm">Choose light or dark mode</div>
            </div>
            <button
              onClick={() =>
                savePreference("theme", prefs.theme === "dark" ? "light" : "dark")
              }
              disabled={isLoading}
              className="px-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-alt)] text-[var(--color-text)] hover:bg-[var(--color-border)] transition disabled:opacity-50 cursor-pointer"
            >
              {prefs.theme === "dark" ? "🌙 Dark" : "☀️ Light"}
            </button>
          </div>

          {/* Default page */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[var(--color-text)] font-medium">Default page</div>
              <div className="text-[var(--color-muted)] text-sm">Page shown after login</div>
            </div>
            <select
              value={prefs.defaultPage}
              onChange={(e) => savePreference("defaultPage", e.target.value)}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-alt)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] cursor-pointer disabled:opacity-50"
            >
              <option value="Dashboards">Dashboards</option>
              <option value="Servers">Servers</option>
              <option value="Logs">Logs</option>
              <option value="Traces">Traces</option>
              <option value="Alerting">Alerting</option>
            </select>
          </div>

          {/* Email notifications */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[var(--color-text)] font-medium">Email notifications</div>
              <div className="text-[var(--color-muted)] text-sm">Receive alerts via email</div>
            </div>
            <button
              onClick={() =>
                savePreference("emailNotifications", !prefs.emailNotifications)
              }
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg border border-[var(--color-border)] transition disabled:opacity-50 cursor-pointer ${
                prefs.emailNotifications
                  ? "bg-[var(--color-accent)] text-[#06222A]"
                  : "bg-[var(--color-panel-alt)] text-[var(--color-muted)]"
              }`}
            >
              {prefs.emailNotifications ? "✅ On" : "❌ Off"}
            </button>
          </div>

          {/* Push notifications */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[var(--color-text)] font-medium">Push notifications</div>
              <div className="text-[var(--color-muted)] text-sm">Browser notifications for alerts</div>
            </div>
            <button
              onClick={() =>
                savePreference("pushNotifications", !prefs.pushNotifications)
              }
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg border border-[var(--color-border)] transition disabled:opacity-50 cursor-pointer ${
                prefs.pushNotifications
                  ? "bg-[var(--color-accent)] text-[#06222A]"
                  : "bg-[var(--color-panel-alt)] text-[var(--color-muted)]"
              }`}
            >
              {prefs.pushNotifications ? "✅ On" : "❌ Off"}
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}