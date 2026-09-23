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

export default function Show({ checkup }) {
    return (
        <AuthenticatedLayout header="Checkups">
            <Head title={checkup.appointment_number} />
            <PageHeader
                title={checkup.appointment_number}
                subtitle="Outpatient checkup"
                actions={
                    <LinkButton href={route('checkups.edit', checkup.id)} variant="secondary">
                        <Pencil className="h-4 w-4" /> Edit
                    </LinkButton>
                }
            />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Card title="Visit details" className="lg:col-span-2">
                    <dl className="grid grid-cols-2 gap-4">
                        <Info
                            label="Patient"
                            value={
                                <Link href={route('patients.show', checkup.patient_id)} className="text-indigo-600 hover:underline">
                                    {checkup.patient?.first_name} {checkup.patient?.last_name}
                                </Link>
                            }
                        />
                        <Info label="Doctor" value={`Dr. ${checkup.doctor?.user?.name}`} />
                        <Info label="Department" value={checkup.department?.name} />
                        <Info label="Date" value={checkup.appointment_date} />
                        <Info label="Time" value={checkup.appointment_time} />
                    </dl>
                    <div className="mt-4 space-y-4 border-t border-gray-100 pt-4">
                        <Info label="Reason" value={checkup.reason} />
                        <Info label="Notes" value={checkup.notes} />
                    </div>
                </Card>
                <div className="space-y-6">
                    <Card title="Status">
                        <StatusBadge status={checkup.status} />
                    </Card>
                    <Card title="Medical record">
                        {checkup.medical_record ? (
                            <Link href={route('medical-records.show', checkup.medical_record.id)} className="text-sm text-indigo-600 hover:underline">
                                Open visit record
                            </Link>
                        ) : (
                            <p className="text-sm text-gray-500">No record linked yet.</p>
                        )}
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
