"use client";

import { useState, ChangeEvent, FormEvent } from "react";

interface SignupFormProps {
  onGoToLogin: () => void;
}

export default function SignupForm({ onGoToLogin }: SignupFormProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setSuccess("User registered successfully! You can now log in.");
        setForm({ name: "", email: "", password: "", phone: "" });
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
        Create your account
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
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-yellow-900"
          >
            Full Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            placeholder="John Doe"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-yellow-200 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-400 text-yellow-900 text-base transition bg-yellow-50 placeholder-yellow-300"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-yellow-900"
          >
            Email address
          </label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="you@email.com"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-yellow-200 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-400 text-yellow-900 text-base transition bg-yellow-50 placeholder-yellow-300"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-yellow-900"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-yellow-200 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-400 text-yellow-900 text-base transition bg-yellow-50 placeholder-yellow-300"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block mb-2 text-sm font-medium text-yellow-900"
          >
            Phone <span className="text-yellow-400">(optional)</span>
          </label>
          <input
            id="phone"
            type="tel"
            name="phone"
            placeholder="(555) 123-4567"
            value={form.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-yellow-200 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-400 text-yellow-900 text-base transition bg-yellow-50 placeholder-yellow-300"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900 font-semibold text-lg shadow-md hover:from-yellow-500 hover:to-yellow-700 transition disabled:opacity-50 mt-2"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="loader" /> Signing up...
            </span>
          ) : (
            "Sign Up"
          )}
        </button>
      </form>
      <p className="text-sm text-yellow-700 mt-6 text-center">
        Already have an account?{" "}
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
