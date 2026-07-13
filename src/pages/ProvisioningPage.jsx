import { useState } from "react";
import { Search, ChevronDown, Plus } from "lucide-react";
import { toast } from "react-hot-toast";

export default function ProvisioningPage() {
  const [activeTab, setActiveTab] = useState("repositories");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock repositories data
  const repositories = [
    { id: 1, name: "grafana-provisioning", type: "GitHub", status: "synced", lastSync: "2 min ago" },
    { id: 2, name: "dashboards-repo", type: "GitHub", status: "synced", lastSync: "15 min ago" },
    { id: 3, name: "datasources-config", type: "GitLab", status: "error", lastSync: "1 hour ago" },
  ];

  const filteredRepos = repositories.filter((repo) =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleConfigure = (repoName) => {
    toast.info(`Configure "${repoName}"`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Provisioning</h1>
        <p className="text-sm text-[var(--color-muted)]">View and manage your configured repositories</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-[var(--color-border)]">
        <button
          onClick={() => setActiveTab("repositories")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
            activeTab === "repositories"
              ? "border-[var(--color-accent)] text-[var(--color-accent)]"
              : "border-transparent text-[var(--color-muted)] hover:text-[var(--color-text)]"
          }`}
        >
          Repositories
        </button>
        <button
          onClick={() => setActiveTab("connections")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
            activeTab === "connections"
              ? "border-[var(--color-accent)] text-[var(--color-accent)]"
              : "border-transparent text-[var(--color-muted)] hover:text-[var(--color-text)]"
          }`}
        >
          Connections
        </button>
        <button
          onClick={() => setActiveTab("get-started")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
            activeTab === "get-started"
              ? "border-[var(--color-accent)] text-[var(--color-accent)]"
              : "border-transparent text-[var(--color-muted)] hover:text-[var(--color-text)]"
          }`}
        >
          Get started
        </button>
      </div>

      {/* Content */}
      <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg p-4">
        {activeTab === "repositories" && (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="relative flex-1 max-w-sm">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-faint)]" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent text-xs"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[var(--color-muted)] bg-[var(--color-panel-alt)] px-2 py-1 rounded border border-[var(--color-border)]">
                  ctrl+k
                </span>
                <button className="flex items-center gap-1 px-3 py-1.5 bg-[var(--color-accent)] text-[#06222A] text-sm font-semibold rounded-lg hover:opacity-90 transition">
                  <Plus size={14} />
                  Add repository
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[var(--color-border)] text-[var(--color-muted)] text-xs uppercase tracking-wider">
                    <th className="py-2 px-3 font-medium">Name</th>
                    <th className="py-2 px-3 font-medium">Type</th>
                    <th className="py-2 px-3 font-medium">Status</th>
                    <th className="py-2 px-3 font-medium">Last Sync</th>
                    <th className="py-2 px-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRepos.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-8 text-[var(--color-muted)]">
                        No repositories found.
                      </td>
                    </tr>
                  ) : (
                    filteredRepos.map((repo) => (
                      <tr key={repo.id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-panel-alt)] transition-colors">
                        <td className="py-2 px-3 text-[var(--color-text)] font-mono text-sm">{repo.name}</td>
                        <td className="py-2 px-3 text-[var(--color-muted)] text-sm">{repo.type}</td>
                        <td className="py-2 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            repo.status === "synced"
                              ? "bg-[var(--color-ok)]/20 text-[var(--color-ok)]"
                              : "bg-[var(--color-crit)]/20 text-[var(--color-crit)]"
                          }`}>
                            {repo.status}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-[var(--color-faint)] text-sm">{repo.lastSync}</td>
                        <td className="py-2 px-3 text-right">
                          <div className="relative inline-block">
                            <button
                              onClick={() => handleConfigure(repo.name)}
                              className="flex items-center gap-1 px-2 py-1 text-xs text-[var(--color-muted)] hover:text-[var(--color-text)] border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-panel-alt)] transition"
                            >
                              Configure
                              <ChevronDown size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === "connections" && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-[var(--color-panel-alt)] border border-[var(--color-border)] flex items-center justify-center mb-4">
              <Search size={24} className="text-[var(--color-faint)]" />
            </div>
            <h3 className="text-[var(--color-text)] font-medium">No connections configured</h3>
            <p className="text-[var(--color-muted)] text-sm max-w-sm mt-1">
              Add a connection to start provisioning resources.
            </p>
            <button className="mt-4 px-4 py-2 bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90 transition">
              Add connection
            </button>
          </div>
        )}

        {activeTab === "get-started" && (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[var(--color-panel-alt)] border border-[var(--color-border)] flex items-center justify-center">
              <span className="text-3xl">🚀</span>
            </div>
            <h3 className="text-[var(--color-text)] font-medium text-lg">Get started with provisioning</h3>
            <p className="text-[var(--color-muted)] text-sm max-w-md">
              Provisioning allows you to manage dashboards, data sources, and alerts as code.
              Add a repository or connection to begin.
            </p>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90 transition">
                Add repository
              </button>
              <button className="px-4 py-2 border border-[var(--color-border)] text-[var(--color-text)] font-semibold rounded-lg hover:bg-[var(--color-panel-alt)] transition">
                Add connection
              </button>
            </div>
            <div className="text-xs text-[var(--color-faint)] max-w-md">
              Learn more about provisioning in the <button className="text-[var(--color-accent)] hover:underline">documentation</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}