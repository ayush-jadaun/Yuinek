// src/components/ui/Button.tsx

import React from "react";

// Define the props for the button. We extend the standard HTML button attributes.
// This allows us to pass any valid button prop like `onClick`, `type`, etc.
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // We can add custom props here if needed, e.g., variant, size
  // For now, we'll keep it simple.
}

// Use React.forwardRef to allow parent components to get a ref to the button element
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => {
    // Define the base styles for the button
    const baseStyles =
      "flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

    // Define styles for different states
    const activeStyles =
      "bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600";

    const disabledStyles = "bg-gray-400 text-gray-200 cursor-not-allowed";

    return (
      <button
        ref={ref}
        className={`
          ${baseStyles} 
          ${props.disabled ? disabledStyles : activeStyles} 
          ${className} // Allow overriding styles with the className prop
        `}
        {...props} // Spread the rest of the props (e.g., type, disabled, onClick)
      >
        {children}
      </button>
    );
  }
);

// Set a display name for easier debugging in React DevTools
Button.displayName = "Button";
