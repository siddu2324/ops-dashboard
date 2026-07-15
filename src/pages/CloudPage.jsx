// src/pages/CloudPage.jsx
import { useState } from "react";
import { Cloud, Plus, Download } from "lucide-react";
import { toast } from "react-hot-toast";
import AzurePage from "./cloud/AzurePage";
import GCPPage from "./cloud/GCPPage";

export default function CloudPage() {
  const [activeTab, setActiveTab] = useState("azure");

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)] flex items-center gap-2">
            <Cloud size={28} className="text-[var(--color-accent)]" />
            Cloud Infrastructure
          </h1>
          <p className="text-[var(--color-muted)] text-sm mt-1">
            Manage your cloud resources across providers
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

      {/* Tabs - Only Azure and GCP */}
      <div className="flex border-b border-[var(--color-border)] gap-1">
        <button
          onClick={() => setActiveTab("azure")}
          className={`px-6 py-3 text-sm font-medium transition rounded-t-lg flex items-center gap-2 ${
            activeTab === "azure"
              ? "bg-[var(--color-panel)] text-[var(--color-text)] border border-[var(--color-border)] border-b-transparent"
              : "text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-border)]/5"
          }`}
        >
          <div className="w-4 h-4 flex items-center justify-center text-blue-500">☁</div>
          Azure
        </button>
        <button
          onClick={() => setActiveTab("gcp")}
          className={`px-6 py-3 text-sm font-medium transition rounded-t-lg flex items-center gap-2 ${
            activeTab === "gcp"
              ? "bg-[var(--color-panel)] text-[var(--color-text)] border border-[var(--color-border)] border-b-transparent"
              : "text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-border)]/5"
          }`}
        >
          <div className="w-4 h-4 flex items-center justify-center text-green-500">☁</div>
          GCP
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "azure" ? <AzurePage /> : <GCPPage />}
      </div>
    </div>
  );
}