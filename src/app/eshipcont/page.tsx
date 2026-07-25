"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./admin.module.css";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple hardcoded auth — replace with real auth later
    if (email === "admin@expressshipdel.com" && password === "Admin@1234") {
      localStorage.setItem("eshipcont_auth", "true");
      router.push("/eshipcont/dashboard");
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <img src="/noship.png" alt="ExpressShipDel" />
        <h2>Admin Portal</h2>
        <p style={{ color: "#888", marginBottom: "2rem", fontSize: "0.9rem" }}>
          Sign in to manage shipments and tracking
        </p>
        <form onSubmit={handleLogin}>
          <div className={styles.inputGroup}>
            <label>Email Address</label>
            <input
              type="email"
              placeholder="admin@expressshipdel.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
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
          <button type="submit" className={styles.loginBtn}>Sign In</button>
        </form>
        <p style={{ marginTop: "1.5rem", color: "#aaa", fontSize: "0.8rem" }}>
          Default: admin@expressshipdel.com / Admin@1234
        </p>
      </div>
    </div>
  );
}
