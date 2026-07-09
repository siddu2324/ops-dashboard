import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { login } from "../../services/authService";
import LoadingSpinner from "../common/LoadingSpinner";

// Demo credentials
const USERS = {
  admin: { password: "admin123", role: "admin" },
  user: { password: "user123", role: "user" },
};

export default function LoginForm() {
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
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      const user = USERS[trimmedUsername];
      if (user && user.password === trimmedPassword) {
        login(user.role); // store role
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
    <div className="w-[380px] bg-[var(--color-panel)] p-8 rounded-xl border border-[var(--color-border)] shadow-2xl">
      <h2 className="text-[var(--color-text)] text-2xl font-bold text-center mb-6">
        OpsDeck Login
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-alt)] text-[var(--color-text)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-alt)] text-[var(--color-text)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-lg bg-[var(--color-accent)] text-[#06222A] font-bold text-base hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <LoadingSpinner size={20} className="text-[#06222A]" />
              <span>Logging in…</span>
            </>
          ) : (
            "Login"
          )}
        </button>

        <div className="text-center text-xs text-[var(--color-muted)] mt-2">
          <p>Demo credentials:</p>
          <p>Admin: admin / admin123</p>
          <p>User: user / user123</p>
        </div>
      </form>
    </div>
  );
}