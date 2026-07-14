import { useState, useEffect } from "react";
import {
  Check,
  X,
  Save,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Shield,
  Key,
  Globe,
  Users,
  Lock,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";

// ---------- Default Provider Configs ----------
const defaultProviders = [
  {
    id: "github",
    name: "GitHub",
    icon: "github",
    enabled: false,
    config: {
      client_id: "",
      client_secret: "",
      allowed_organizations: "",
      allowed_domains: "",
    },
  },
  {
    id: "google",
    name: "Google",
    icon: "google",
    enabled: false,
    config: {
      client_id: "",
      client_secret: "",
      hosted_domain: "",
    },
  },
  {
    id: "ldap",
    name: "LDAP",
    icon: "ldap",
    enabled: false,
    config: {
      host: "",
      port: "389",
      use_ssl: false,
      bind_dn: "",
      bind_password: "",
      search_base: "",
      search_filter: "(cn=%s)",
    },
  },
  {
    id: "saml",
    name: "SAML",
    icon: "saml",
    enabled: false,
    config: {
      entity_id: "",
      idp_metadata_url: "",
      idp_metadata: "",
      certificate: "",
      private_key: "",
    },
  },
  {
    id: "oauth",
    name: "Generic OAuth",
    icon: "oauth",
    enabled: false,
    config: {
      client_id: "",
      client_secret: "",
      auth_url: "",
      token_url: "",
      api_url: "",
      scopes: "openid email profile",
    },
  },
  {
    id: "okta",
    name: "Okta",
    icon: "okta",
    enabled: false,
    config: {
      client_id: "",
      client_secret: "",
      okta_domain: "",
      api_token: "",
    },
  },
  {
    id: "azuread",
    name: "Azure AD",
    icon: "azuread",
    enabled: false,
    config: {
      client_id: "",
      client_secret: "",
      tenant_id: "",
    },
  },
];

const STORAGE_KEY = "authProviders";

const loadProviders = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {}
  }
  return defaultProviders;
};

const saveProviders = (providers) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(providers));
};

// ---------- Icon Helper ----------
const ProviderIcon = ({ id }) => {
  const icons = {
    github: "🐙",
    google: "🔵",
    ldap: "🔐",
    saml: "🏛️",
    oauth: "🔑",
    okta: "🟣",
    azuread: "🟦",
  };
  return <span className="text-2xl">{icons[id] || "🔒"}</span>;
};

// ---------- Main Component ----------
export default function AuthenticationPage() {
  const [providers, setProviders] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setProviders(loadProviders());
  }, []);

  useEffect(() => {
    if (providers.length > 0) {
      saveProviders(providers);
    }
  }, [providers]);

  const toggleProvider = (id) => {
    setProviders(
      providers.map((p) =>
        p.id === id ? { ...p, enabled: !p.enabled } : p
      )
    );
  };

  const updateConfig = (id, key, value) => {
    setProviders(
      providers.map((p) =>
        p.id === id
          ? { ...p, config: { ...p.config, [key]: value } }
          : p
      )
    );
  };

  const toggleExpand = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      saveProviders(providers);
      toast.success("Authentication settings saved");
      setIsSaving(false);
    }, 500);
  };

  const handleReset = () => {
    if (window.confirm("Reset all authentication settings to defaults?")) {
      setProviders(defaultProviders);
      toast.success("Settings reset to defaults");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Authentication</h1>
          <p className="text-sm text-[var(--color-muted)]">
            Configure authentication providers (OAuth, LDAP, SAML, etc.)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-3 py-1.5 border border-[var(--color-border)] text-[var(--color-muted)] rounded-lg hover:bg-[var(--color-panel-alt)] transition text-sm"
          >
            <RefreshCw size={14} />
            Reset
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1 px-4 py-1.5 bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-50 text-sm"
          >
            <Save size={14} />
            {isSaving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>

      {/* Provider Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {providers.map((provider) => (
          <div
            key={provider.id}
            className={`bg-[var(--color-panel)] border rounded-lg transition ${
              provider.enabled
                ? "border-[var(--color-accent)]"
                : "border-[var(--color-border)]"
            }`}
          >
            {/* Header - always visible */}
            <div
              onClick={() => toggleExpand(provider.id)}
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-[var(--color-panel-alt)] transition rounded-t-lg"
            >
              <div className="flex items-center gap-3">
                <ProviderIcon id={provider.id} />
                <div>
                  <div className="text-[var(--color-text)] font-medium">
                    {provider.name}
                  </div>
                  <div className="text-xs text-[var(--color-muted)]">
                    {provider.enabled ? (
                      <span className="text-[var(--color-ok)] flex items-center gap-1">
                        <Check size={12} /> Enabled
                      </span>
                    ) : (
                      <span className="text-[var(--color-muted)] flex items-center gap-1">
                        <X size={12} /> Disabled
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleProvider(provider.id);
                  }}
                  className={`relative w-10 h-5 rounded-full transition ${
                    provider.enabled
                      ? "bg-[var(--color-accent)]"
                      : "bg-[var(--color-border)]"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition ${
                      provider.enabled ? "right-0.5" : "left-0.5"
                    }`}
                  />
                </button>
                {expanded === provider.id ? (
                  <ChevronDown size={16} className="text-[var(--color-muted)]" />
                ) : (
                  <ChevronRight size={16} className="text-[var(--color-muted)]" />
                )}
              </div>
            </div>

            {/* Expanded config */}
            {expanded === provider.id && (
              <div className="p-4 border-t border-[var(--color-border)] space-y-3">
                {Object.entries(provider.config).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-xs text-[var(--color-muted)] uppercase tracking-wider mb-1">
                      {key.replace(/_/g, " ")}
                    </label>
                    {typeof value === "boolean" ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateConfig(provider.id, key, !value)}
                          className={`px-3 py-1 rounded text-sm ${
                            value
                              ? "bg-[var(--color-accent)] text-[#06222A]"
                              : "bg-[var(--color-border)] text-[var(--color-muted)]"
                          }`}
                        >
                          {value ? "Enabled" : "Disabled"}
                        </button>
                      </div>
                    ) : (
                      <input
                        type={key.includes("secret") || key.includes("password") || key.includes("token") ? "password" : "text"}
                        value={value || ""}
                        onChange={(e) => updateConfig(provider.id, key, e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] text-sm focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                        placeholder={`Enter ${key.replace(/_/g, " ")}`}
                      />
                    )}
                  </div>
                ))}
                <div className="text-xs text-[var(--color-muted)] mt-2">
                  <AlertCircle size={12} className="inline mr-1" />
                  Changes are saved when you click "Save changes" above.
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Info footer */}
      <div className="text-xs text-[var(--color-muted)] text-center border-t border-[var(--color-border)] pt-4">
        <p>
          Authentication providers are configured at the server level. These settings are stored in localStorage for demo purposes.
        </p>
      </div>
    </div>
  );
}