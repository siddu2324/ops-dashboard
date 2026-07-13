import { useState } from "react";
import { Upload, Database, Users, LayoutDashboard, Tag, PlayCircle, Camera, AlertCircle, Activity } from "lucide-react";
import Card from "../components/common/Card";

export default function StatisticsAndLicensing() {
  const [licenseToken, setLicenseToken] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const stats = {
    dashboardsStarred: 7,
    dashboardsTotal: 0,
    tags: 4,
    playlists: 0,
    snapshots: 0,
    dataSources: 8,
    organizations: 2,
    usersTotal: 7,
    activeSessions: 21,
    activeUsersLast30Days: 6,
    alerts: 17,
  };

  const handleUploadLicense = () => {
    if (!licenseToken.trim()) {
      alert("Please enter a license token");
      return;
    }
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      alert("License uploaded successfully!");
      setLicenseToken("");
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Statistics and licensing</h1>
        <p className="text-sm text-[var(--color-muted)]">Instance statistics and license management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[var(--color-muted)] text-xs uppercase tracking-wider">Dashboards (starred)</div>
              <div className="text-2xl font-bold text-[var(--color-text)] mt-1">
                {stats.dashboardsStarred} <span className="text-sm text-[var(--color-muted)] font-normal">({stats.dashboardsTotal})</span>
              </div>
            </div>
            <LayoutDashboard size={24} className="text-[var(--color-accent)] opacity-60" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[var(--color-muted)] text-xs uppercase tracking-wider">Tags</div>
              <div className="text-2xl font-bold text-[var(--color-text)] mt-1">{stats.tags}</div>
            </div>
            <Tag size={24} className="text-[var(--color-accent)] opacity-60" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[var(--color-muted)] text-xs uppercase tracking-wider">Playlists</div>
              <div className="text-2xl font-bold text-[var(--color-text)] mt-1">{stats.playlists}</div>
            </div>
            <PlayCircle size={24} className="text-[var(--color-accent)] opacity-60" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[var(--color-muted)] text-xs uppercase tracking-wider">Snapshots</div>
              <div className="text-2xl font-bold text-[var(--color-text)] mt-1">{stats.snapshots}</div>
            </div>
            <Camera size={24} className="text-[var(--color-accent)] opacity-60" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[var(--color-muted)] text-xs uppercase tracking-wider">Data sources</div>
              <div className="text-2xl font-bold text-[var(--color-text)] mt-1">{stats.dataSources}</div>
            </div>
            <Database size={24} className="text-[var(--color-accent)] opacity-60" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[var(--color-muted)] text-xs uppercase tracking-wider">Organisations</div>
              <div className="text-2xl font-bold text-[var(--color-text)] mt-1">{stats.organizations}</div>
            </div>
            <Users size={24} className="text-[var(--color-accent)] opacity-60" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[var(--color-muted)] text-xs uppercase tracking-wider">Users total</div>
              <div className="text-2xl font-bold text-[var(--color-text)] mt-1">{stats.usersTotal}</div>
            </div>
            <Users size={24} className="text-[var(--color-accent)] opacity-60" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[var(--color-muted)] text-xs uppercase tracking-wider">Active sessions</div>
              <div className="text-2xl font-bold text-[var(--color-text)] mt-1">{stats.activeSessions}</div>
            </div>
            <Activity size={24} className="text-[var(--color-accent)] opacity-60" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[var(--color-muted)] text-xs uppercase tracking-wider">Active users (30d)</div>
              <div className="text-2xl font-bold text-[var(--color-text)] mt-1">{stats.activeUsersLast30Days}</div>
            </div>
            <Users size={24} className="text-[var(--color-accent)] opacity-60" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[var(--color-muted)] text-xs uppercase tracking-wider">Alerts</div>
              <div className="text-2xl font-bold text-[var(--color-text)] mt-1">{stats.alerts}</div>
            </div>
            <AlertCircle size={24} className="text-[var(--color-accent)] opacity-60" />
          </div>
        </Card>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-4">
        <button className="px-4 py-2 bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90 transition text-sm">
          Manage data sources
        </button>
        <button className="px-4 py-2 bg-[var(--color-panel-alt)] border border-[var(--color-border)] text-[var(--color-text)] font-semibold rounded-lg hover:bg-[var(--color-border)] transition text-sm">
          Manage dashboards
        </button>
        <button className="px-4 py-2 bg-[var(--color-panel-alt)] border border-[var(--color-border)] text-[var(--color-text)] font-semibold rounded-lg hover:bg-[var(--color-border)] transition text-sm">
          Manage alerts
        </button>
        <button className="px-4 py-2 bg-[var(--color-panel-alt)] border border-[var(--color-border)] text-[var(--color-text)] font-semibold rounded-lg hover:bg-[var(--color-border)] transition text-sm">
          Manage users
        </button>
      </div>

      {/* Licensing Section */}
      <Card title="Licensing">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-[var(--color-muted)] text-sm font-medium mb-1">Have a license? Upload a new token</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Paste your license token here"
                  value={licenseToken}
                  onChange={(e) => setLicenseToken(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                />
                <button
                  onClick={handleUploadLicense}
                  disabled={isUploading}
                  className="flex items-center gap-2 px-4 py-2 bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-50"
                >
                  <Upload size={16} />
                  {isUploading ? "Uploading..." : "Upload token"}
                </button>
              </div>
            </div>
          </div>
          <div className="text-sm text-[var(--color-muted)]">
            <span className="font-mono bg-[var(--color-panel-alt)] px-2 py-1 rounded border border-[var(--color-border)]">
              Instance URL: http://localhost:3000/
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}