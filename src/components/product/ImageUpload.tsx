"use client";

import { useRef } from "react";
import { UploadedImage } from "@/hooks/useImageUpload";
import { Button } from "@/components/ui/Button";
import { X, Upload, AlertCircle } from "lucide-react";

interface ImageUploadProps {
  images: UploadedImage[];
  onAddImages: (files: File[]) => void;
  onRemoveImage: (index: number) => void;
  maxImages?: number;
}

export function ImageUpload({
  images,
  onAddImages,
  onRemoveImage,
  maxImages = 10,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onAddImages(files);
    }
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    if (imageFiles.length > 0) {
      onAddImages(imageFiles);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Product Images
        </label>
        <span className="text-sm text-gray-500">
          {images.length} / {maxImages} images
        </span>
      </div>

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <div className="mt-2">
          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={images.length >= maxImages}
          >
            Choose Images
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Drag and drop images here, or click to select files
        </p>
        <p className="text-xs text-gray-400">PNG, JPG, WebP up to 5MB each</p>
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={image.preview}
                  alt={`Product ${index + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Upload Status Overlay */}
                {image.isUploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="text-white text-sm">Uploading...</div>
                  </div>
                )}

                {/* Error Overlay */}
                {image.error && (
                  <div className="absolute inset-0 bg-red-500 bg-opacity-50 flex items-center justify-center">
                    <AlertCircle className="text-white h-6 w-6" />
                  </div>
                )}

                {/* Success Indicator */}
                {image.uploadedUrl && (
                  <div className="absolute top-2 right-2">
                    <div className="bg-green-500 text-white text-xs px-2 py-1 rounded">
                      ✓
                    </div>
                  </div>
                )}
              </div>

              {/* Remove Button */}
              <button
                type="button"
                onClick={() => onRemoveImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Error Message */}
              {image.error && (
                <p className="text-red-500 text-xs mt-1 truncate">
                  {image.error}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
