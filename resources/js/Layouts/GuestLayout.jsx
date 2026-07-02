import { Link } from '@inertiajs/react';

export default function GuestLayout({ title, subtitle, children }) {
    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Left brand / image panel */}
            <div className="relative hidden w-1/2 overflow-hidden lg:block">
                <img
                    src="/images/login-side.png"
                    alt="MediCare HMS"
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-700/70 to-teal-600/60" />
                <div className="relative flex h-full flex-col justify-between p-12 text-white">
                    <Link href="/" className="flex items-center gap-2">
                        <img src="/images/logo.png" alt="Logo" className="h-10 w-10 rounded-lg" />
                        <span className="text-xl font-bold">MediCare HMS</span>
                    </Link>
                    <div>
                        <h2 className="text-3xl font-bold leading-snug">
                            Compassionate care,
                            <br /> powered by smart software.
                        </h2>
                        <p className="mt-4 max-w-md text-white/80">
                            One secure platform for patients, appointments, billing,
                            pharmacy, lab and ward management.
                        </p>
                    </div>
                    <p className="text-sm text-white/70">
                        &copy; {new Date().getFullYear()} MediCare HMS
                    </p>
                </div>
            </div>

            {/* Right form panel */}
            <div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
                <div className="w-full max-w-md">
                    <div className="mb-8 flex items-center gap-2 lg:hidden">
                        <img src="/images/logo.png" alt="Logo" className="h-10 w-10 rounded-lg" />
                        <span className="text-xl font-bold text-gray-900">MediCare HMS</span>
                    </div>

                    {title && (
                        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                    )}
                    {subtitle && (
                        <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
                    )}

                    <div className="mt-8">{children}</div>
                </div>
            </div>
        </div>
    );
}
