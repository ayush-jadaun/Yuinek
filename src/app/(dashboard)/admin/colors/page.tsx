"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

interface IColor {
  _id: string;
  name: string;
  hex_code?: string;
  createdAt: string;
}

export default function AdminColorsPage() {
  const [colors, setColors] = useState<IColor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingColor, setEditingColor] = useState<IColor | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    hex_code: "#000000",
  });

  useEffect(() => {
    fetchColors();
  }, []);

  const fetchColors = async () => {
    try {
      const response = await fetch("/api/admin/colors");
      const data = await response.json();
      setColors(data.colors || []);
    } catch (error) {
      console.error("Failed to fetch colors:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingColor
        ? `/api/admin/colors/${editingColor._id}`
        : "/api/admin/colors";

      const method = editingColor ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchColors();
        setShowModal(false);
        resetForm();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to save color");
      }
    } catch (error) {
      console.error("Failed to save color:", error);
      alert("Failed to save color");
    }
  };

  const handleEdit = (color: IColor) => {
    setEditingColor(color);
    setFormData({
      name: color.name,
      hex_code: color.hex_code || "#000000",
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this color?")) return;

    try {
      const response = await fetch(`/api/admin/colors/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchColors();
      } else {
        alert("Failed to delete color");
      }
    } catch (error) {
      console.error("Failed to delete color:", error);
      alert("Failed to delete color");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      hex_code: "#000000",
    });
    setEditingColor(null);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Color Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage available colors for your products.
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
            Add Color
          </Button>
        </div>
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
                      Color
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hex Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
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
                        colSpan={5}
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        Loading...
                      </td>
                    </tr>
                  ) : colors.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No colors found
                      </td>
                    </tr>
                  ) : (
                    colors.map((color) => (
                      <tr key={color._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div
                            className="w-8 h-8 rounded-full border border-gray-300"
                            style={{
                              backgroundColor: color.hex_code || "#000000",
                            }}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {color.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                          {color.hex_code || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(color.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleEdit(color)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(color._id)}
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
              {editingColor ? "Edit Color" : "Add New Color"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Color Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="e.g., Red, Blue, Forest Green"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Hex Code
                </label>
                <div className="mt-1 flex items-center space-x-3">
                  <input
                    type="color"
                    value={formData.hex_code}
                    onChange={(e) =>
                      setFormData({ ...formData, hex_code: e.target.value })
                    }
                    className="h-10 w-20 rounded border border-gray-300"
                  />
                  <input
                    type="text"
                    value={formData.hex_code}
                    onChange={(e) =>
                      setFormData({ ...formData, hex_code: e.target.value })
                    }
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 font-mono"
                    placeholder="#000000"
                    pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                  />
                </div>
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
                  {editingColor ? "Update" : "Create"} Color
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
