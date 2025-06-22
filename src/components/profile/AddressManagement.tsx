"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { IUser } from "@/models/User";

interface Address {
  _id?: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default?: boolean;
}

interface AddressManagementProps {
  user: IUser;
  setUser: (user: IUser) => void;
}

export default function AddressManagement({
  user,
  setUser,
}: AddressManagementProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<Address>({
    address_line_1: "",
    address_line_2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "Philippines",
    is_default: false,
  });

  const resetForm = () => {
    setFormData({
      address_line_1: "",
      address_line_2: "",
      city: "",
      state: "",
      postal_code: "",
      country: "Philippines",
      is_default: false,
    });
    setShowAddForm(false);
    setEditingAddress(null);
    setError("");
  };

  const handleEdit = (address: any) => {
    setFormData({
      address_line_1: address.address_line_1 || "",
      address_line_2: address.address_line_2 || "",
      city: address.city || "",
      state: address.state || "",
      postal_code: address.postal_code || "",
      country: address.country || "Philippines",
      is_default: address.is_default || false,
    });
    setEditingAddress(address);
    setShowAddForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const method = editingAddress ? "PUT" : "POST";
      const url = editingAddress
        ? `/api/users/profile/addresses/${editingAddress._id}`
        : "/api/users/profile/addresses";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        resetForm();
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to save address");
      }
    } catch (err) {
      setError("Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (addressId: string) => {
    if (!confirm("Are you sure you want to delete this address?")) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/users/profile/addresses/${addressId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to delete address");
      }
    } catch (err) {
      setError("Failed to delete address");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Manage Addresses</h2>
        <Button onClick={() => setShowAddForm(true)} disabled={loading}>
          Add New Address
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Address List */}
      <div className="grid gap-4 mb-6">
        {user.addresses && user.addresses.length > 0 ? (
          user.addresses.map((address: any) => (
            <div key={address._id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-medium">{address.address_line_1}</div>
                  {address.address_line_2 && (
                    <div className="text-gray-600">
                      {address.address_line_2}
                    </div>
                  )}
                  <div className="text-gray-600">
                    {address.city}, {address.state} {address.postal_code}
                  </div>
                  <div className="text-gray-600">{address.country}</div>
                  {address.is_default && (
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-2">
                      Default
                    </span>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(address)}
                    disabled={loading}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(address._id)}
                    disabled={loading}
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No addresses saved yet. Add your first address to get started.
          </div>
        )}
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="border rounded-lg p-6 bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">
            {editingAddress ? "Edit Address" : "Add New Address"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address Line 1 *
              </label>
              <input
                type="text"
                required
                value={formData.address_line_1}
                onChange={(e) =>
                  setFormData({ ...formData, address_line_1: e.target.value })
                }
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Street address, building number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address Line 2
              </label>
              <input
                type="text"
                value={formData.address_line_2}
                onChange={(e) =>
                  setFormData({ ...formData, address_line_2: e.target.value })
                }
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Apartment, suite, unit (optional)"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State/Province *
                </label>
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Postal Code *
                </label>
                <input
                  type="text"
                  required
                  value={formData.postal_code}
                  onChange={(e) =>
                    setFormData({ ...formData, postal_code: e.target.value })
                  }
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country *
                </label>
                <select
                  required
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Philippines">Philippines</option>
                  {/* Add more countries as needed */}
                </select>
              </div>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_default}
                  onChange={(e) =>
                    setFormData({ ...formData, is_default: e.target.checked })
                  }
                  className="mr-2"
                />
                Set as default address
              </label>
            </div>

            <div className="flex space-x-4">
              <Button type="submit" disabled={loading}>
                {loading
                  ? "Saving..."
                  : editingAddress
                  ? "Update Address"
                  : "Add Address"}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
