"use client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const token = params.get("token") || "";
  const [password, setPassword] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    if (res.ok) setDone(true);
    else setError("Reset failed.");
  }

  return done ? (
    <div>
      Password reset successful. <a href="/login">Login</a>
    </div>
  ) : (
    <form onSubmit={handleSubmit}>
      <h1>Reset Password</h1>
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        required
        placeholder="New password"
      />
      <button type="submit">Reset</button>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </form>
  );
}
