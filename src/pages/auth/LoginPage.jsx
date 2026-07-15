// src/pages/auth/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { login } from "../../services/authService";
import { logAction } from "../../services/auditService";
import LoadingSpinner from "../../components/common/LoadingSpinner";

// Demo credentials
const USERS = {
  admin: { password: "admin123", role: "admin" },
  user: { password: "user123", role: "user" },
};

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername) {
      toast.error("Username is required");
      return;
    }
    if (!trimmedPassword) {
      toast.error("Password is required");
      return;
    }

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const user = USERS[trimmedUsername];
      if (user && user.password === trimmedPassword) {
        login(user.role);
        logAction("login", { username: trimmedUsername, role: user.role });
        toast.success(`Welcome back, ${trimmedUsername}! 🚀`);
        navigate("/");
      } else {
        toast.error("Invalid username or password");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg)] p-4">
      {/* Login Card */}
      <div className="w-[380px] bg-[var(--color-panel)] rounded-xl border border-[var(--color-border)] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-[var(--color-border)]">
          <h2 className="text-2xl font-bold text-[var(--color-text)] text-center">
            AiOps360
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">
          <div>
            <label className="block text-[var(--color-muted)] text-sm font-medium mb-1.5">
              Email or username
            </label>
            <input
              type="text"
              placeholder="Email or username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-[var(--color-muted)] text-sm font-medium mb-1.5">
              Password
            </label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-lg bg-[var(--color-accent)] text-[#06222A] font-bold text-base hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <LoadingSpinner size={20} className="text-[#06222A]" />
                <span>Logging in…</span>
              </>
            ) : (
              "Log in"
            )}
          </button>
        </form>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-xs text-[var(--color-muted)] space-y-1">
        <div className="flex items-center justify-center gap-4">
          <a
            href="https://quantanxt.com/services/it-operations/managed-operations"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--color-accent)] transition"
          >
            Documentation
          </a>
          <span className="text-[var(--color-faint)]">|</span>
          <a
            href="https://quantanxt.com/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--color-accent)] transition"
          >
            Support
          </a>
        </div>
        <div className="text-[var(--color-faint)] text-[10px] mt-2">
          AiOps360 v13.1.0 (b309c9bb3b)
        </div>
      </div>
    </div>
  );
}