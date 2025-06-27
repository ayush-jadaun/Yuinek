"use client";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (res.ok) setSent(true);
    else setError("Failed to send reset link.");
  }

  return (

      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 mb-2">
          Forgot your password?
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Enter your email address and we'll send you a link to reset your
          password.
        </p>
        {sent ? (
          <div className="text-center text-green-600 font-medium">
            If the email exists, you will receive a reset link.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email address
              </label>
              <input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                placeholder="you@example.com"
                autoComplete="email"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-500 sm:text-sm px-3 py-2"
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center rounded-md bg-indigo-600 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition"
            >
              Send reset link
            </button>
            {error && (
              <div className="text-red-600 text-center text-sm">{error}</div>
            )}
          </form>
        )}
      </div>

  );
}
