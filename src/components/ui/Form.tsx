import React from 'react';

interface FormControlProps {
    children: React.ReactNode;
}

const FormControl: React.FC<FormControlProps> = ({ children }) => {
    return (
        <div className="mb-4">
            {children}
        </div>
    );
};

const FormItem: React.FC<FormControlProps> = ({ children }) => {
    return (
        <div className="mb-4">
            {children}
        </div>
    );
};

const FormLabel: React.FC<FormControlProps> = ({ children }) => {
    return (
        <label className="font-medium text-gray-700 block mb-1">
            {children}
        </label>
    );
};

const FormMessage: React.FC = () => {
    return (
        <p className="text-sm text-red-500 mt-1">Error message</p>
    );
};

// Use React.FormHTMLAttributes<HTMLFormElement> for the Form component's props
const Form: React.FC<React.FormHTMLAttributes<HTMLFormElement>> = ({ children, ...props }) => {
    return <form {...props}>{children}</form>;
};

export { FormControl, FormItem, FormLabel, FormMessage, Form };