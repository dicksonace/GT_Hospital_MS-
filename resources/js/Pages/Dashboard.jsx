import StatusBadge from '@/Components/StatusBadge';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    BedDouble,
    CalendarDays,
    FlaskConical,
    Package,
    Receipt,
    Stethoscope,
    Users,
} from 'lucide-react';

const STAT_CARDS = [
    { key: 'patients', label: 'Total Patients', icon: Users, color: 'bg-blue-500' },
    { key: 'doctors', label: 'Doctors', icon: Stethoscope, color: 'bg-emerald-500' },
    { key: 'appointments_today', label: "Today's Appointments", icon: CalendarDays, color: 'bg-indigo-500' },
    { key: 'pending_bills', label: 'Pending Bills', icon: Receipt, color: 'bg-amber-500' },
    { key: 'active_admissions', label: 'Active Admissions', icon: BedDouble, color: 'bg-purple-500' },
    { key: 'pending_lab_orders', label: 'Pending Lab Orders', icon: FlaskConical, color: 'bg-rose-500' },
    { key: 'low_stock_medicines', label: 'Low Stock Medicines', icon: Package, color: 'bg-orange-500' },
];

export default function Dashboard({ stats, recentAppointments, recentPatients }) {
    return (
        <AuthenticatedLayout header="Dashboard">
            <Head title="Dashboard" />

            <h1 className="mb-6 text-2xl font-bold text-gray-900">
                Hospital Overview
            </h1>

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {STAT_CARDS.map((card) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={card.key}
                            className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
                        >
                            <div
                                className={
                                    'flex h-12 w-12 items-center justify-center rounded-lg text-white ' +
                                    card.color
                                }
                            >
                                <Icon className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">
                                    {stats[card.key] ?? 0}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {card.label}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="rounded-xl border border-gray-100 bg-white shadow-sm lg:col-span-2">
                    <div className="border-b border-gray-100 px-6 py-4">
                        <h2 className="font-semibold text-gray-800">
                            Upcoming Appointments
                        </h2>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {recentAppointments.length === 0 && (
                            <p className="px-6 py-8 text-center text-sm text-gray-500">
                                No upcoming appointments.
                            </p>
                        )}
                        {recentAppointments.map((apt) => (
                            <Link
                                key={apt.id}
                                href={route('appointments.show', apt.id)}
                                className="flex items-center justify-between px-6 py-3 hover:bg-gray-50"
                            >
                                <div>
                                    <p className="text-sm font-medium text-gray-800">
                                        {apt.patient?.first_name}{' '}
                                        {apt.patient?.last_name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Dr. {apt.doctor?.user?.name} ·{' '}
                                        {apt.department?.name}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-600">
                                        {apt.appointment_date} {apt.appointment_time}
                                    </p>
                                    <StatusBadge status={apt.status} />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
                    <div className="border-b border-gray-100 px-6 py-4">
                        <h2 className="font-semibold text-gray-800">
                            Recently Registered
                        </h2>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {recentPatients.length === 0 && (
                            <p className="px-6 py-8 text-center text-sm text-gray-500">
                                No patients yet.
                            </p>
                        )}
                        {recentPatients.map((patient) => (
                            <Link
                                key={patient.id}
                                href={route('patients.show', patient.id)}
                                className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50"
                            >
                                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                                    {patient.first_name?.charAt(0)}
                                </span>
                                <div>
                                    <p className="text-sm font-medium text-gray-800">
                                        {patient.first_name} {patient.last_name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {patient.patient_number}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
