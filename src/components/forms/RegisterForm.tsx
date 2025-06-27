"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

// Minimal country code list, you can expand as needed
const COUNTRY_CODES = [
  { code: "+1", label: "🇺🇸 US (+1)" },
  { code: "+44", label: "🇬🇧 UK (+44)" },
  { code: "+91", label: "🇮🇳 India (+91)" },
  { code: "+63", label: "🇵🇭 PH (+63)" },
  { code: "+61", label: "🇦🇺 AU (+61)" },
  { code: "+81", label: "🇯🇵 JP (+81)" },
  // ...add more as desired
];

export default function RegisterForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState(COUNTRY_CODES[0].code); // default to first
  const [phone, setPhone] = useState(""); // only local part
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    // 1. Client-side validation
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setIsLoading(false);
      return;
    }

    // Format phone as E.164: +<countrycode><number>
    // Remove leading zero from phone if present
    let formattedPhone = phone.replace(/^0+/, "");
    formattedPhone = countryCode + formattedPhone;

    try {
      // 2. API call
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email,
          phone: formattedPhone, // send E.164 format
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Something went wrong during registration."
        );
      }

      // 3. Redirect to phone verification page
      router.push(
        `/verify-phone?user=${encodeURIComponent(
          data.user.id
        )}&phone=${encodeURIComponent(data.user.phone)}`
      );
    } catch (err: any) {
      setError(err.message);
    } finally {
      if (error) {
        setIsLoading(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex gap-x-4">
        <div className="w-1/2">
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700"
          >
            First Name
          </label>
          <div className="mt-1">
            <Input
              id="firstName"
              name="firstName"
              type="text"
              autoComplete="given-name"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>
        <div className="w-1/2">
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700"
          >
            Last Name
          </label>
          <div className="mt-1">
            <Input
              id="lastName"
              name="lastName"
              type="text"
              autoComplete="family-name"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email address
        </label>
        <div className="mt-1">
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700"
        >
          Phone number
        </label>
        <div className="mt-1 flex">
          <select
            className="rounded-l-md border-gray-300 bg-gray-50 text-gray-900 text-sm focus:ring-indigo-500 focus:border-indigo-500 block w-21"
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            disabled={isLoading}
            required
            aria-label="Country code"
          >
            {COUNTRY_CODES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>
          <Input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={isLoading}
            placeholder="e.g. 9123456789"
            className="rounded-l-none"
            style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <div className="mt-1">
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700"
        >
          Confirm Password
        </label>
        <div className="mt-1">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>

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

      <div>
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || !!success}
        >
          {isLoading ? "Creating account..." : "Create Account"}
        </Button>
      </div>
    </form>
  );
}
