import { useState } from "react";
import { Search, Plus, Clock } from "lucide-react";
import { toast } from "react-hot-toast";
import Card from "../components/common/Card";

export default function SilencesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const silences = [
    { id: 1, name: "Maintenance window", matchers: "alertname=CPU", starts: "2 hours ago", ends: "In 4 hours", status: "Active" },
  ];

  const filtered = silences.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    toast.success("Create silence form would open here");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Silences</h1>
          <p className="text-sm text-[var(--color-muted)]">Manage alert silences</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-1 px-3 py-1.5 bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90 transition text-sm"
        >
          <Plus size={14} />
          Create silence
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-faint)]" />
        <input
          type="text"
          placeholder="Search silences..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent text-sm"
        />
      </div>

      <Card>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Clock size={32} className="text-[var(--color-faint)] mb-4" />
            <p className="text-[var(--color-muted)]">No silences configured</p>
            <button onClick={handleCreate} className="mt-2 text-sm text-[var(--color-accent)] hover:underline">
              Create silence
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--color-panel-alt)] border-b border-[var(--color-border)]">
                <tr>
                  <th className="px-3 py-2 text-[var(--color-muted)] text-xs font-medium">Name</th>
                  <th className="px-3 py-2 text-[var(--color-muted)] text-xs font-medium">Matchers</th>
                  <th className="px-3 py-2 text-[var(--color-muted)] text-xs font-medium">Starts</th>
                  <th className="px-3 py-2 text-[var(--color-muted)] text-xs font-medium">Ends</th>
                  <th className="px-3 py-2 text-[var(--color-muted)] text-xs font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((silence) => (
                  <tr key={silence.id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-panel-alt)] transition-colors">
                    <td className="px-3 py-2 text-[var(--color-text)]">{silence.name}</td>
                    <td className="px-3 py-2 text-[var(--color-muted)] font-mono text-xs">{silence.matchers}</td>
                    <td className="px-3 py-2 text-[var(--color-faint)] text-xs">{silence.starts}</td>
                    <td className="px-3 py-2 text-[var(--color-faint)] text-xs">{silence.ends}</td>
                    <td className="px-3 py-2">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--color-ok)]/20 text-[var(--color-ok)]">
                        {silence.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}