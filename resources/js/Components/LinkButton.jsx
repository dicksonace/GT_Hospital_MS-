import { Link } from '@inertiajs/react';

const VARIANTS = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
    secondary: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
    danger: 'bg-red-600 text-white hover:bg-red-700',
};

export default function LinkButton({
    href,
    variant = 'primary',
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            href={href}
            className={
                'inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition ' +
                VARIANTS[variant] +
                ' ' +
                className
            }
            {...props}
        >
            {children}
        </Link>
    );
}
