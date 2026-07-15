// src/pages/CloudPage.jsx
import { useState } from "react";
import { Cloud, Plus, Download } from "lucide-react";
import { toast } from "react-hot-toast";
import AzurePage from "./cloud/AzurePage";

export default function CloudPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)] flex items-center gap-2">
            <Cloud size={28} className="text-[var(--color-accent)]" />
            Azure Cloud
          </h1>
          <p className="text-[var(--color-muted)] text-sm mt-1">
            Manage your Azure cloud resources
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => toast.success('Add Cloud Account clicked')}
            className="px-4 py-2 bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-80 transition flex items-center gap-2"
          >
            <Plus size={16} />
            Add Cloud Account
          </button>
          <button className="p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] text-[var(--color-muted)] hover:text-[var(--color-text)] transition">
            <Download size={16} />
          </button>
        </div>
      </div>

      {/* ❌ Removed tabs – only Azure */}
      <div className="mt-6">
        <AzurePage />
      </div>
    </div>
  );
}