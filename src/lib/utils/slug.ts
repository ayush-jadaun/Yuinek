export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s\-]/g, "") // Escape the hyphen here too
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/\-+/g, "-") // Replace multiple hyphens with single
    .replace(/^\-|\-$/g, "") // Remove leading/trailing hyphens
    .trim();
}

export function generateProductCode(): number {
  // Generate a unique product code based on timestamp + random
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return parseInt(
    `${timestamp.toString().slice(-6)}${random.toString().padStart(3, "0")}`
  );
}
