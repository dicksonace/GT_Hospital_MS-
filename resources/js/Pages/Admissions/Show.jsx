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
            <dd className="mt-0.5 whitespace-pre-wrap text-sm text-gray-800">{value || '—'}</dd>
        </div>
    );
}

export default function Show({ admission }) {
    return (
        <AuthenticatedLayout header="Admissions">
            <Head title={admission.admission_number} />
            <PageHeader
                title={admission.admission_number}
                subtitle={`${admission.patient?.first_name} ${admission.patient?.last_name}`}
                actions={
                    <LinkButton href={route('admissions.edit', admission.id)} variant="secondary">
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
                                <Link href={route('patients.show', admission.patient_id)} className="text-indigo-600 hover:underline">
                                    {admission.patient?.first_name} {admission.patient?.last_name}
                                </Link>
                            }
                        />
                        <Info label="Doctor" value={`Dr. ${admission.doctor?.user?.name}`} />
                        <Info label="Ward" value={admission.ward?.name} />
                        <Info label="Bed" value={admission.bed_number} />
                        <Info label="Admitted" value={admission.admission_date} />
                        <Info label="Discharged" value={admission.discharge_date} />
                    </dl>
                    <div className="mt-4 space-y-4 border-t border-gray-100 pt-4">
                        <Info label="Diagnosis" value={admission.diagnosis} />
                        <Info label="Notes" value={admission.notes} />
                    </div>
                </Card>
                <Card title="Status">
                    <StatusBadge status={admission.status} />
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
