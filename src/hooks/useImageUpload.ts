import { useState } from "react";

export interface UploadedImage {
  file: File;
  preview: string;
  isUploading: boolean;
  uploadedUrl?: string;
  error?: string;
}

export function useImageUpload() {
  const [images, setImages] = useState<UploadedImage[]>([]);

  const addImages = (files: File[]) => {
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      isUploading: false,
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  const uploadImage = async (index: number): Promise<string> => {
    const image = images[index];
    if (!image) throw new Error("Image not found");

    setImages((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        isUploading: true,
        error: undefined,
      };
      return updated;
    });

    try {
      const formData = new FormData();
      formData.append("file", image.file);

      // Using the products API path for consistency
      const response = await fetch("/api/products/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload image");
      }

      const data = await response.json();

      setImages((prev) => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          isUploading: false,
          uploadedUrl: data.url,
        };
        return updated;
      });

      return data.url;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Upload failed";
      setImages((prev) => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          isUploading: false,
          error: errorMessage,
        };
        return updated;
      });
      throw error;
    }
  };

  const uploadAllImages = async (): Promise<string[]> => {
    const uploadPromises = images.map((_, index) => uploadImage(index));
    return Promise.all(uploadPromises);
  };

  return {
    images,
    addImages,
    removeImage,
    uploadImage,
    uploadAllImages,
  };
}
