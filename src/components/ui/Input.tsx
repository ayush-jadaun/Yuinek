// src/components/ui/Input.tsx

import React from "react";

// Extend the standard HTML input attributes for full compatibility
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    // Define the base styles for the input field
    const baseStyles =
      "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6";

    // Define styles for the disabled state
    const disabledStyles =
      "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200";

    return (
      <input
        type={type}
        ref={ref}
        className={`
          ${baseStyles}
          ${disabledStyles}
          ${className} // Allow overriding styles
        `}
        {...props} // Spread the rest of the props (e.g., value, onChange, required)
      />
    );
  }
);

Input.displayName = "Input";
