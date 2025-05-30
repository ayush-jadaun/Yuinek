"use client";

import { useState, ChangeEvent, FormEvent } from "react";

interface ForgotPasswordFormProps {
  onGoToLogin: () => void;
}

export default function ForgotPasswordForm({
  onGoToLogin,
}: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Could not send reset email");
      } else {
        setSuccess("Password reset email sent! Check your inbox.");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-3xl font-extrabold mb-8 text-center text-yellow-700 tracking-tight">
        Forgot your password?
      </h2>
      {error && (
        <p className="mb-4 text-yellow-900 bg-yellow-100 p-3 rounded-lg text-center border border-yellow-300">
          {error}
        </p>
      )}
      {success && (
        <p className="mb-4 text-green-700 bg-green-100 p-3 rounded-lg text-center border border-green-200">
          {success}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 animate-fadeIn"
        autoComplete="on"
      >
        <div>
          <label
            htmlFor="reset-email"
            className="block mb-2 text-sm font-medium text-yellow-900"
          >
            Enter your email to reset password
          </label>
          <input
            id="reset-email"
            type="email"
            name="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            required
            className="w-full px-4 py-3 border border-yellow-200 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-400 text-yellow-900 text-base transition bg-yellow-50 placeholder-yellow-300"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900 font-semibold text-lg shadow-md hover:from-yellow-500 hover:to-yellow-700 transition disabled:opacity-50 mt-4"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="loader" /> Sending...
            </span>
          ) : (
            "Send Reset Email"
          )}
        </button>
      </form>
      <p className="text-sm text-yellow-700 mt-6 text-center">
        Remembered your password?{" "}
        <button
          className="text-yellow-600 hover:underline font-bold cursor-pointer"
          onClick={onGoToLogin}
          tabIndex={0}
          style={{ cursor: "pointer" }}
        >
          Log in
        </button>
      </p>
      <style jsx global>{`
        .loader {
          border: 3px solid #f9e79f;
          border-top: 3px solid #f1c40f;
          border-radius: 50%;
          width: 1em;
          height: 1em;
          animation: spin 0.75s linear infinite;
          display: inline-block;
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
