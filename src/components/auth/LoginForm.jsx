import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService";

export default function LoginForm() {
  const navigate = useNavigate();

  // Change these credentials
  const VALID_USERNAME = "admin";
  const VALID_PASSWORD = "admin123";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Please enter Username and Password");
      return;
    }

    if (
      username === VALID_USERNAME &&
      password === VALID_PASSWORD
    ) {
      login();
      navigate("/");
    } else {
      alert("Invalid Username or Password");
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      style={{
        width: "380px",
        background: "#10151F",
        padding: "30px",
        borderRadius: "10px",
        border: "1px solid #1E2634",
        boxShadow: "0 0 20px rgba(0,0,0,0.4)",
      }}
    >
      <h2
        style={{
          color: "#FFFFFF",
          textAlign: "center",
          marginBottom: "25px",
        }}
      >
        OpsDeck Login
      </h2>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "15px",
          borderRadius: "6px",
          border: "1px solid #333",
          background: "#141B28",
          color: "#FFFFFF",
          fontSize: "15px",
          outline: "none",
          boxSizing: "border-box",
        }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "20px",
          borderRadius: "6px",
          border: "1px solid #333",
          background: "#141B28",
          color: "#FFFFFF",
          fontSize: "15px",
          outline: "none",
          boxSizing: "border-box",
        }}
      />

      <button
        type="submit"
        style={{
          width: "100%",
          padding: "12px",
          background: "#22D3EE",
          color: "#06222A",
          border: "none",
          borderRadius: "6px",
          fontWeight: "bold",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Login
      </button>
    </form>
  );
}