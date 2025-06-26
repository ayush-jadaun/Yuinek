"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function VerifyPhonePage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const params = useSearchParams();
  const userId = params.get("user");
  const phone = params.get("phone");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/verify-phone-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, code }),
      });
      console.log(userId, code);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification failed");
      setSuccess("Phone number verified! Redirecting to login...");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/request-phone-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, phone }), // <-- send phone, not code
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not resend code");
      setSuccess("Verification code resent!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-center text-2xl font-bold text-gray-900">
        Verify your phone number
      </h2>
      <p className="text-center text-sm text-gray-500 mb-4">
        Enter the 6-digit code sent to your phone.
      </p>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
        <Input
          type="text"
          inputMode="numeric"
          pattern="[0-9]{6}"
          maxLength={6}
          minLength={6}
          required
          value={code}
          onChange={(e) => setCode(e.target.value)}
          disabled={isLoading}
          placeholder="Enter verification code"
        />

        {error && (
          <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">
            {error}
          </p>
        )}
        {success && (
          <p className="text-sm text-green-600 bg-green-100 p-3 rounded-md">
            {success}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Verifying..." : "Verify"}
        </Button>
      </form>
      <div className="mt-4 text-center">
        <button
          className="text-indigo-600 hover:underline text-sm"
          onClick={handleResend}
          disabled={isLoading}
        >
          Resend code
        </button>
      </div>
    </div>
  );
}
