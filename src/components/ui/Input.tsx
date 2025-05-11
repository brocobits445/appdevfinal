import React from 'react'; // Import React
import { clsx } from 'clsx'; // Import clsx for class name merging

// Define the Input component using React.forwardRef
const Input = React.forwardRef<HTMLInputElement, React.ComponentPropsWithoutRef<'input'>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={clsx("border p-2 rounded-md w-full", className)} // Use clsx here
        {...props} // Spread props here
      />
    );
  }
);

// Set displayName for debugging purposes
Input.displayName = 'Input';

export { Input };