import Card from '@/Components/Card';
import LinkButton from '@/Components/LinkButton';
import PageHeader from '@/Components/PageHeader';
import StatusBadge from '@/Components/StatusBadge';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Pencil } from 'lucide-react';

function Info({ label, value }) {
    return (
        <div>
            <dt className="text-xs uppercase tracking-wide text-gray-400">{label}</dt>
            <dd className="mt-0.5 text-sm text-gray-800">{value || '—'}</dd>
        </div>
    );
}

export default function Show({ doctor }) {
    return (
        <AuthenticatedLayout header="Doctors">
            <Head title={`Dr. ${doctor.user?.name}`} />
            <PageHeader
                title={`Dr. ${doctor.user?.name}`}
                subtitle={doctor.specialization}
                actions={
                    <LinkButton href={route('doctors.edit', doctor.id)} variant="secondary">
                        <Pencil className="h-4 w-4" /> Edit
                    </LinkButton>
                }
            />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Card title="Profile">
                    <dl className="space-y-4">
                        <Info label="Email" value={doctor.user?.email} />
                        <Info label="Phone" value={doctor.phone} />
                        <Info label="Department" value={doctor.department?.name} />
                        <Info label="License" value={doctor.license_number} />
                        <div>
                            <dt className="text-xs uppercase tracking-wide text-gray-400">Status</dt>
                            <dd className="mt-1">
                                <StatusBadge status={doctor.is_available ? 'active' : 'inactive'} label={doctor.is_available ? 'Available' : 'Off'} />
                            </dd>
                        </div>
                    </dl>
                </Card>
                <Card title="Recent Appointments" className="lg:col-span-2">
                    {doctor.appointments?.length ? (
                        <ul className="divide-y divide-gray-50">
                            {doctor.appointments.map((apt) => (
                                <li key={apt.id} className="flex items-center justify-between py-2">
                                    <div>
                                        <Link href={route('appointments.show', apt.id)} className="text-sm font-medium text-indigo-600 hover:underline">
                                            {apt.appointment_number}
                                        </Link>
                                        <p className="text-xs text-gray-500">
                                            {apt.patient?.first_name} {apt.patient?.last_name} · {apt.appointment_date}
                                        </p>
                                    </div>
                                    <StatusBadge status={apt.status} />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500">No appointments.</p>
                    )}
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
