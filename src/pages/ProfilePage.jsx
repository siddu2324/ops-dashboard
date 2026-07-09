import { useState } from "react";
import { toast } from "react-hot-toast";
import Card from "../components/common/Card";
import { getRole } from "../services/authService";
import { logAction } from "../services/auditService"; // ✅ Added import

export default function ProfilePage() {
  const role = getRole();
  const [displayName, setDisplayName] = useState("Aarav Rao");
  const [email, setEmail] = useState("a.rao@aiops360.io");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // ✅ Log profile update
      logAction("profile_updated", { displayName, email });
      toast.success("Settings saved successfully!");
      setPassword("");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card title="User Settings">
        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-[var(--color-muted)] text-sm font-medium mb-1">
              Display name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-[var(--color-muted)] text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-[var(--color-muted)] text-sm font-medium mb-1">
              Role
            </label>
            <div className="px-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-alt)] text-[var(--color-text)] font-medium">
              {role === "admin" ? "Administrator" : "User"}
            </div>
            <p className="text-[var(--color-faint)] text-xs mt-1">Role is assigned by administrators</p>
          </div>

          <div>
            <label className="block text-[var(--color-muted)] text-sm font-medium mb-1">
              New password
              <span className="text-[var(--color-faint)] text-xs ml-2">(leave blank to keep current)</span>
            </label>
            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition disabled:opacity-50"
            />
            <p className="text-[var(--color-faint)] text-xs mt-1">Demo build — password changes aren't persisted.</p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? "Saving…" : "Save changes"}
          </button>
        </form>
      </Card>
    </div>
  );
}