export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateProductForm(formData: any): ValidationResult {
  const errors: string[] = [];

  if (!formData.name?.trim()) errors.push("Product name is required");
  if (!formData.description?.trim()) errors.push("Description is required");
  if (!formData.base_price || formData.base_price <= 0)
    errors.push("Price must be greater than 0");
  if (!formData.category_id) errors.push("Please select a category");
  if (formData.stock_quantity < 0)
    errors.push("Stock quantity cannot be negative");
  if (!formData.slug?.trim()) errors.push("Slug is required");
  if (!formData.product_code) errors.push("Product code is required");

  // Validate slug format
  if (formData.slug && !/^[a-z0-9-]+$/.test(formData.slug)) {
    errors.push(
      "Slug can only contain lowercase letters, numbers, and hyphens"
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
