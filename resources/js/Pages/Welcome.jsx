import { Head, Link } from '@inertiajs/react';
import {
    Activity,
    BedDouble,
    CalendarDays,
    FlaskConical,
    Pill,
    Receipt,
    ShieldCheck,
    Stethoscope,
    Users,
} from 'lucide-react';

const FEATURES = [
    { icon: Users, title: 'Patient Records', desc: 'Register patients and keep full demographics, allergies and medical history in one place.' },
    { icon: CalendarDays, title: 'Appointments', desc: 'Schedule OPD, follow-up and emergency visits with real-time status tracking.' },
    { icon: Activity, title: 'Medical Records', desc: 'Capture symptoms, diagnoses and prescriptions for every visit.' },
    { icon: Receipt, title: 'Billing & Payments', desc: 'Generate itemised invoices, record payments and track outstanding balances.' },
    { icon: Pill, title: 'Pharmacy', desc: 'Manage medicine inventory with stock levels, reorder alerts and expiry tracking.' },
    { icon: FlaskConical, title: 'Laboratory', desc: 'Order lab tests and record results against a configurable test catalog.' },
    { icon: BedDouble, title: 'Wards & Admissions', desc: 'Track bed capacity and manage inpatient admissions and discharges.' },
    { icon: ShieldCheck, title: 'Role-based Access', desc: 'Admin, doctor, nurse, receptionist, pharmacist and lab technician roles.' },
];

const STATS = [
    { value: '12+', label: 'Modules' },
    { value: '6', label: 'Staff Roles' },
    { value: '24/7', label: 'Availability' },
    { value: '100%', label: 'Paperless' },
];

export default function Welcome() {
    return (
        <div className="min-h-screen bg-white text-gray-800">
            <Head title="MediCare HMS — Hospital Management System" />

            {/* Nav */}
            <header className="sticky top-0 z-20 border-b border-gray-100 bg-white/80 backdrop-blur">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-2">
                        <img src="/images/logo.png" alt="MediCare HMS" className="h-9 w-9 rounded-lg" />
                        <span className="text-lg font-bold text-gray-900">MediCare HMS</span>
                    </div>
                    <nav className="hidden items-center gap-8 text-sm font-medium text-gray-600 md:flex">
                        <a href="#features" className="hover:text-indigo-600">Features</a>
                        <a href="#about" className="hover:text-indigo-600">About</a>
                    </nav>
                    <Link
                        href={route('login')}
                        className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                    >
                        Staff Login
                    </Link>
                </div>
            </header>

            {/* Hero */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-teal-50" />
                <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 lg:grid-cols-2 lg:py-24">
                    <div>
                        <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                            <Stethoscope className="h-4 w-4" /> Hospital Management System
                        </span>
                        <h1 className="mt-5 text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl">
                            Run your hospital,{' '}
                            <span className="bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent">
                                all in one place
                            </span>
                        </h1>
                        <p className="mt-5 max-w-lg text-lg text-gray-600">
                            MediCare HMS brings patients, doctors, appointments, billing,
                            pharmacy, lab and ward management into a single, easy-to-use
                            platform for your entire care team.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-4">
                            <Link
                                href={route('login')}
                                className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700"
                            >
                                Get Started
                            </Link>
                            <a
                                href="#features"
                                className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                            >
                                Explore Features
                            </a>
                        </div>
                        <div className="mt-10 grid max-w-md grid-cols-4 gap-4">
                            {STATS.map((s) => (
                                <div key={s.label}>
                                    <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                                    <p className="text-xs text-gray-500">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="relative">
                        <img
                            src="/images/hero.png"
                            alt="Hospital care team with management dashboard"
                            className="w-full rounded-2xl shadow-2xl ring-1 ring-gray-100"
                        />
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="mx-auto max-w-7xl px-6 py-20">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold text-gray-900">Everything a modern hospital needs</h2>
                    <p className="mt-3 text-gray-600">
                        A complete set of modules to digitise every department and workflow.
                    </p>
                </div>
                <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {FEATURES.map((f) => {
                        const Icon = f.icon;
                        return (
                            <div
                                key={f.title}
                                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                            >
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-teal-500 text-white">
                                    <Icon className="h-6 w-6" />
                                </div>
                                <h3 className="mt-4 font-semibold text-gray-900">{f.title}</h3>
                                <p className="mt-1 text-sm text-gray-600">{f.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* About */}
            <section id="about" className="bg-gray-50 py-20">
                <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
                    <img
                        src="/images/login-side.png"
                        alt="Doctor using the MediCare platform"
                        className="w-full rounded-2xl shadow-xl ring-1 ring-gray-100"
                    />
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">About the project</h2>
                        <p className="mt-4 text-gray-600">
                            MediCare HMS is a web-based Hospital Management System built with
                            Laravel, Inertia.js and React. It replaces paperwork and scattered
                            spreadsheets with one secure system that every department shares —
                            from the reception desk to the pharmacy and laboratory.
                        </p>
                        <ul className="mt-6 space-y-3 text-sm text-gray-700">
                            {[
                                'Secure, role-based access for every type of staff member',
                                'Real-time dashboard with hospital-wide statistics',
                                'Automated billing, inventory alerts and reporting',
                                'Fast, modern single-page interface',
                            ].map((item) => (
                                <li key={item} className="flex items-start gap-2">
                                    <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-teal-500" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                        <Link
                            href={route('login')}
                            className="mt-8 inline-block rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                        >
                            Enter the System
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-100 bg-white">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-8 sm:flex-row">
                    <div className="flex items-center gap-2">
                        <img src="/images/logo.png" alt="MediCare HMS" className="h-7 w-7 rounded-md" />
                        <span className="font-semibold text-gray-800">MediCare HMS</span>
                    </div>
                    <p className="text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} MediCare HMS. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
