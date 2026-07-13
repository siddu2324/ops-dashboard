import { useState } from "react";
import { Search, Plus, AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import Card from "../components/common/Card";

export default function ServiceAccountsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // all, expired, disabled
  const [serviceAccounts] = useState([]); // initially empty

  const handleAdd = () => {
    toast.success("Service account creation form would open here");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Service accounts</h1>
          <p className="text-sm text-[var(--color-muted)]">
            Service accounts and their tokens can be used to authenticate against the Grafana API.{" "}
            <button className="text-[var(--color-accent)] hover:underline">Find out more in our documentation.</button> 🔒
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-3 py-1.5 bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90 transition text-sm"
        >
          <Plus size={16} />
          Add service account
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-faint)]" />
          <input
            type="text"
            placeholder="Search service account by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent text-sm"
          />
        </div>
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1 text-sm rounded-full border transition ${
            filter === "all"
              ? "bg-[var(--color-accent)] text-[#06222A] border-[var(--color-accent)]"
              : "bg-transparent text-[var(--color-muted)] border-[var(--color-border)] hover:border-[var(--color-text)]"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("expired")}
          className={`px-3 py-1 text-sm rounded-full border transition ${
            filter === "expired"
              ? "bg-[var(--color-warn)] text-[#06222A] border-[var(--color-warn)]"
              : "bg-transparent text-[var(--color-muted)] border-[var(--color-border)] hover:border-[var(--color-text)]"
          }`}
        >
          With expired tokens
        </button>
        <button
          onClick={() => setFilter("disabled")}
          className={`px-3 py-1 text-sm rounded-full border transition ${
            filter === "disabled"
              ? "bg-[var(--color-crit)] text-white border-[var(--color-crit)]"
              : "bg-transparent text-[var(--color-muted)] border-[var(--color-border)] hover:border-[var(--color-text)]"
          }`}
        >
          Disabled
        </button>
      </div>

      {/* Empty state */}
      <Card>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-[var(--color-panel-alt)] border border-[var(--color-border)] flex items-center justify-center mb-4">
            <AlertCircle size={24} className="text-[var(--color-faint)]" />
          </div>
          <h3 className="text-[var(--color-text)] font-medium text-lg">You haven't created any service accounts yet</h3>
          <p className="text-[var(--color-muted)] text-sm max-w-sm mt-1">
            Remember, you can provide specific permissions for API access to other applications
          </p>
          <button
            onClick={handleAdd}
            className="mt-4 px-4 py-2 bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90 transition"
          >
            Add service account
          </button>
        </div>
      </Card>
    </div>
  );
}