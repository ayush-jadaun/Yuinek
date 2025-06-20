"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TrashIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/Button";

interface DeleteProductButtonProps {
  productId: string;
  productName: string;
  compact?: boolean; // For table view
}

export default function DeleteProductButton({
  productId,
  productName,
  compact = false,
}: DeleteProductButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete product");
      }

      // Success - refresh the current page
      router.refresh();
    } catch (error) {
      console.error("Delete error:", error);
      alert(
        `Failed to delete product: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  if (compact) {
    // Compact mode for table view
    if (showConfirm) {
      return (
        <div className="flex items-center space-x-1">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-600 hover:text-red-900 text-sm"
          >
            {isDeleting ? "Deleting..." : "Confirm"}
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={() => setShowConfirm(false)}
            disabled={isDeleting}
            className="text-gray-600 hover:text-gray-900 text-sm"
          >
            Cancel
          </button>
        </div>
      );
    }

    return (
      <button
        onClick={() => setShowConfirm(true)}
        className="text-red-600 hover:text-red-900"
      >
        Delete
      </button>
    );
  }

  // Full mode for detail page
  if (showConfirm) {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">Delete "{productName}"?</span>
        <Button
          variant="danger"
          size="sm"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Confirm"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowConfirm(false)}
          disabled={isDeleting}
        >
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <Button variant="danger" onClick={() => setShowConfirm(true)}>
      <TrashIcon className="h-4 w-4 mr-2" />
      Delete
    </Button>
  );
}
