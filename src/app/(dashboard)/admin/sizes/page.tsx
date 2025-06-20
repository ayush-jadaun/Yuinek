"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

interface ISize {
  _id: string;
  us_size: string;
  eu_size?: string;
  uk_size?: string;
  cm_size?: number;
  gender: "men" | "women" | "kids";
  createdAt: string;
}

export default function AdminSizesPage() {
  const [sizes, setSizes] = useState<ISize[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSize, setEditingSize] = useState<ISize | null>(null);
  const [selectedGender, setSelectedGender] = useState<string>("all");

  const [formData, setFormData] = useState({
    us_size: "",
    eu_size: "",
    uk_size: "",
    cm_size: "",
    gender: "men" as "men" | "women" | "kids",
  });

  useEffect(() => {
    fetchSizes();
  }, [selectedGender]);

  const fetchSizes = async () => {
    try {
      const genderParam =
        selectedGender !== "all" ? `?gender=${selectedGender}` : "";
      const response = await fetch(`/api/admin/sizes${genderParam}`);
      const data = await response.json();
      setSizes(data.sizes || []);
    } catch (error) {
      console.error("Failed to fetch sizes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingSize
        ? `/api/admin/sizes/${editingSize._id}`
        : "/api/admin/sizes";

      const method = editingSize ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          cm_size: formData.cm_size ? parseFloat(formData.cm_size) : undefined,
        }),
      });

      if (response.ok) {
        fetchSizes();
        setShowModal(false);
        resetForm();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to save size");
      }
    } catch (error) {
      console.error("Failed to save size:", error);
      alert("Failed to save size");
    }
  };

  const handleEdit = (size: ISize) => {
    setEditingSize(size);
    setFormData({
      us_size: size.us_size,
      eu_size: size.eu_size || "",
      uk_size: size.uk_size || "",
      cm_size: size.cm_size?.toString() || "",
      gender: size.gender,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this size?")) return;

    try {
      const response = await fetch(`/api/admin/sizes/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchSizes();
      } else {
        alert("Failed to delete size");
      }
    } catch (error) {
      console.error("Failed to delete size:", error);
      alert("Failed to delete size");
    }
  };

  const resetForm = () => {
    setFormData({
      us_size: "",
      eu_size: "",
      uk_size: "",
      cm_size: "",
      gender: "men",
    });
    setEditingSize(null);
  };

  const filteredSizes =
    selectedGender === "all"
      ? sizes
      : sizes.filter((size) => size.gender === selectedGender);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Size Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage shoe sizes for different genders and sizing systems.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Size
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6">
        <select
          value={selectedGender}
          onChange={(e) => setSelectedGender(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="all">All Genders</option>
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="kids">Kids</option>
        </select>
      </div>

      {/* Table */}
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      US Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      EU Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      UK Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CM
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gender
                    </th>
                    <th className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        Loading...
                      </td>
                    </tr>
                  ) : filteredSizes.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No sizes found
                      </td>
                    </tr>
                  ) : (
                    filteredSizes.map((size) => (
                      <tr key={size._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {size.us_size}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {size.eu_size || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {size.uk_size || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {size.cm_size || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                            {size.gender}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleEdit(size)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(size._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {editingSize ? "Edit Size" : "Add New Size"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  US Size *
                </label>
                <input
                  type="text"
                  required
                  value={formData.us_size}
                  onChange={(e) =>
                    setFormData({ ...formData, us_size: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  EU Size
                </label>
                <input
                  type="text"
                  value={formData.eu_size}
                  onChange={(e) =>
                    setFormData({ ...formData, eu_size: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  UK Size
                </label>
                <input
                  type="text"
                  value={formData.uk_size}
                  onChange={(e) =>
                    setFormData({ ...formData, uk_size: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  CM Size
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.cm_size}
                  onChange={(e) =>
                    setFormData({ ...formData, cm_size: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Gender *
                </label>
                <select
                  required
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      gender: e.target.value as "men" | "women" | "kids",
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="kids">Kids</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingSize ? "Update" : "Create"} Size
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
