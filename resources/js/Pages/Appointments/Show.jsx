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

export default function Show({ appointment }) {
    return (
        <AuthenticatedLayout header="Appointments">
            <Head title={appointment.appointment_number} />

            <PageHeader
                title={appointment.appointment_number}
                subtitle="Appointment details"
                actions={
                    <LinkButton href={route('appointments.edit', appointment.id)} variant="secondary">
                        <Pencil className="h-4 w-4" /> Edit
                    </LinkButton>
                }
            />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Card title="Details" className="lg:col-span-2">
                    <dl className="grid grid-cols-2 gap-4">
                        <Info
                            label="Patient"
                            value={
                                <Link
                                    href={route('patients.show', appointment.patient_id)}
                                    className="text-indigo-600 hover:underline"
                                >
                                    {appointment.patient?.first_name} {appointment.patient?.last_name}
                                </Link>
                            }
                        />
                        <Info label="Doctor" value={`Dr. ${appointment.doctor?.user?.name}`} />
                        <Info label="Department" value={appointment.department?.name} />
                        <Info label="Type" value={appointment.type} />
                        <Info label="Date" value={appointment.appointment_date} />
                        <Info label="Time" value={appointment.appointment_time} />
                    </dl>
                    <div className="mt-4 space-y-4 border-t border-gray-100 pt-4">
                        <Info label="Reason" value={appointment.reason} />
                        <Info label="Notes" value={appointment.notes} />
                    </div>
                </Card>

                <div className="space-y-6">
                    <Card title="Status">
                        <StatusBadge status={appointment.status} />
                    </Card>
                    <Card title="Linked Bill">
                        {appointment.bill ? (
                            <Link
                                href={route('bills.show', appointment.bill.id)}
                                className="text-sm text-indigo-600 hover:underline"
                            >
                                {appointment.bill.bill_number}
                            </Link>
                        ) : (
                            <p className="text-sm text-gray-500">No bill linked.</p>
                        )}
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
