// src/components/forms/AddressForm.tsx

"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface AddressFormProps {
  onSave: () => void; // A function to refetch addresses after saving
}

export default function AddressForm({ onSave }: AddressFormProps) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    address_line_1: "",
    city: "",
    state_province: "",
    postal_code: "",
    phone: "",
    type: "shipping",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      // This API route needs to be created
      const res = await fetch("/api/users/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save address.");
      onSave(); // Trigger refetch on parent component
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          name="first_name"
          placeholder="First Name"
          onChange={handleChange}
          required
        />
        <Input
          name="last_name"
          placeholder="Last Name"
          onChange={handleChange}
          required
        />
      </div>
      <Input
        name="address_line_1"
        placeholder="Address Line 1"
        onChange={handleChange}
        required
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Input
          name="city"
          placeholder="City"
          onChange={handleChange}
          required
        />
        <Input
          name="state_province"
          placeholder="State / Province"
          onChange={handleChange}
          required
        />
        <Input
          name="postal_code"
          placeholder="Postal Code"
          onChange={handleChange}
          required
        />
      </div>
      <Input name="phone" placeholder="Phone Number" onChange={handleChange} />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Address"}
      </Button>
    </form>
  );
}
