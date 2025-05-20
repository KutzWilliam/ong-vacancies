import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

export default function Button({ children, ...props }: ButtonProps) {
    return (
        <button
            {...props}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
            {children}
        </button>
    );
}