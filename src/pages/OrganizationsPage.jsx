import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "react-hot-toast";
import Card from "../components/common/Card";

export default function OrganizationsPage() {
  const [organizations] = useState([
    { id: 1, name: "Main Org." },
    { id: 2, name: "iValue" },
  ]);

  const handleNewOrg = () => {
    toast.success("New organization creation form would open here");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Organizations</h1>
          <p className="text-sm text-[var(--color-muted)]">
            Isolated instances of Grafana running on the same server
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--color-muted)] bg-[var(--color-panel-alt)] px-2 py-1 rounded border border-[var(--color-border)]">
            ctrl+k
          </span>
          <button
            onClick={handleNewOrg}
            className="flex items-center gap-2 px-3 py-1.5 bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90 transition text-sm"
          >
            <Plus size={16} />
            New org
          </button>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-[var(--color-muted)] text-xs uppercase tracking-wider">
                <th className="py-2 px-3 font-medium">ID</th>
                <th className="py-2 px-3 font-medium">Name</th>
              </tr>
            </thead>
            <tbody>
              {organizations.map((org) => (
                <tr key={org.id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-panel-alt)] transition-colors">
                  <td className="py-2 px-3 text-[var(--color-text)] font-mono text-sm">{org.id}</td>
                  <td className="py-2 px-3 text-[var(--color-text)]">{org.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}