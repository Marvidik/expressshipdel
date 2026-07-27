"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import styles from "./admin.module.css";

import { API_BASE_URL } from "../../config";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/public/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("eshipcont_auth", "true");
        localStorage.setItem("eshipcont_token", data.Token || data.token); // saving the token
        router.push("/eshipcont/dashboard");
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("An error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <img src="/noship.png" alt="ExpressShipDelivery" />
        <h2>Admin Portal</h2>
        <p style={{ color: "#888", marginBottom: "2rem", fontSize: "0.9rem" }}>
          Sign in to manage shipments and tracking
        </p>
        <form onSubmit={handleLogin}>
          <div className={styles.inputGroup}>
            <label>Username</label>
            <input
              type="text"
              placeholder="admin"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p style={{ color: "#ff3b30", marginBottom: "1rem", fontSize: "0.9rem" }}>{error}</p>}
          <button type="submit" disabled={isLoading} className={styles.loginBtn} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', opacity: isLoading ? 0.7 : 1 }}>
            {isLoading ? <Loader2 size={18} className={styles.spin} /> : null}
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>
        <p style={{ marginTop: "1.5rem", color: "#aaa", fontSize: "0.8rem" }}>
          Default: admin@expreshipdeliv.com  / Admin@1234
        </p>
      </div>
    </div>
  );
}
