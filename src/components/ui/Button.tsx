import React from "react";

// Define the props for the button
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
}

// Use React.forwardRef to allow parent components to get a ref to the button element
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, children, variant = "default", size = "md", ...props },
    ref
  ) => {
    // Base styles for all buttons
    const baseStyles =
      "inline-flex items-center justify-center rounded-md font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-colors";

    // Variant styles
    const variantStyles = {
      default:
        "bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600",
      outline:
        "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus-visible:outline-gray-500",
      secondary:
        "bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:outline-gray-500",
      danger:
        "bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600",
    };

    // Size styles
    const sizeStyles = {
      sm: "px-2 py-1 text-sm h-8",
      md: "px-3 py-2 text-sm h-10",
      lg: "px-4 py-3 text-base h-12",
    };

    // Disabled styles
    const disabledStyles = "opacity-50 cursor-not-allowed pointer-events-none";

    return (
      <button
        ref={ref}
        className={`
          ${baseStyles} 
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${props.disabled ? disabledStyles : ""} 
          ${className || ""} 
        `
          .trim()
          .replace(/\s+/g, " ")}
        {...props}
      >
        {children}
      </button>
    );
  }
);

// Set a display name for easier debugging in React DevTools
Button.displayName = "Button";
