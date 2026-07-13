import { useState } from "react";
import { toast } from "react-hot-toast";
import Card from "../components/common/Card";

export default function DefaultPreferences() {
  const [orgName, setOrgName] = useState("iValue");
  const [theme, setTheme] = useState("Default");
  const [homeDashboard, setHomeDashboard] = useState("Default dashboard");
  const [timezone, setTimezone] = useState("Default");
  const [weekStart, setWeekStart] = useState("Default");
  const [language, setLanguage] = useState("Preview");
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdateOrg = () => {
    if (!orgName.trim()) {
      toast.error("Organization name cannot be empty");
      return;
    }
    toast.success(`Organization name updated to "${orgName}"`);
  };

  const handleSavePreferences = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Preferences saved successfully!");
    }, 800);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Default preferences</h1>
        <p className="text-sm text-[var(--color-muted)]">Manage preferences across an organization</p>
      </div>

      {/* Organization profile */}
      <Card title="Organization profile">
        <div className="space-y-4">
          <div>
            <label className="block text-[var(--color-muted)] text-sm font-medium mb-1">
              Organization name
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
              />
              <button
                onClick={handleUpdateOrg}
                className="px-4 py-2 bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90 transition whitespace-nowrap"
              >
                Update organization name
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Preferences */}
      <Card title="Preferences">
        <div className="space-y-4">
          {/* Theme */}
          <div>
            <label className="block text-[var(--color-muted)] text-sm font-medium mb-1">
              Interface theme
            </label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
            >
              <option value="Default">Default</option>
              <option value="Dark">Dark</option>
              <option value="Light">Light</option>
            </select>
          </div>

          {/* Home Dashboard */}
          <div>
            <label className="block text-[var(--color-muted)] text-sm font-medium mb-1">
              Home Dashboard
            </label>
            <select
              value={homeDashboard}
              onChange={(e) => setHomeDashboard(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
            >
              <option value="Default dashboard">Default dashboard</option>
              <option value="Dashboards">Dashboards</option>
              <option value="Home">Home</option>
            </select>
          </div>

          {/* Timezone */}
          <div>
            <label className="block text-[var(--color-muted)] text-sm font-medium mb-1">
              Timezone
            </label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
            >
              <option value="Default">Default</option>
              <option value="UTC">UTC</option>
              <option value="America/New_York">America/New_York</option>
              <option value="Europe/London">Europe/London</option>
              <option value="Asia/Kolkata">Asia/Kolkata</option>
            </select>
          </div>

          {/* Week start */}
          <div>
            <label className="block text-[var(--color-muted)] text-sm font-medium mb-1">
              Week start
            </label>
            <select
              value={weekStart}
              onChange={(e) => setWeekStart(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
            >
              <option value="Default">Default</option>
              <option value="Monday">Monday</option>
              <option value="Sunday">Sunday</option>
              <option value="Saturday">Saturday</option>
            </select>
          </div>

          {/* Language */}
          <div>
            <label className="block text-[var(--color-muted)] text-sm font-medium mb-1">
              Language
            </label>
            <div className="flex gap-3">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
              >
                <option value="Preview">Preview</option>
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
              </select>
              <span className="px-4 py-2 bg-[var(--color-panel-alt)] border border-[var(--color-border)] rounded-lg text-[var(--color-muted)] text-sm flex items-center">
                Default
              </span>
            </div>
          </div>

          <button
            onClick={handleSavePreferences}
            disabled={isSaving}
            className="px-6 py-2 bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save preferences"}
          </button>
        </div>
      </Card>
    </div>
  );
}