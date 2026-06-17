import Card from '@/Components/Card';
import LinkButton from '@/Components/LinkButton';
import PageHeader from '@/Components/PageHeader';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Pencil } from 'lucide-react';

function Block({ label, value }) {
    return (
        <div>
            <dt className="text-xs uppercase tracking-wide text-gray-400">{label}</dt>
            <dd className="mt-1 whitespace-pre-wrap text-sm text-gray-800">{value || '—'}</dd>
        </div>
    );
}

export default function Show({ record }) {
    return (
        <AuthenticatedLayout header="Medical Records">
            <Head title="Medical Record" />
            <PageHeader
                title="Medical Record"
                subtitle={`${record.visit_date} · Dr. ${record.doctor?.user?.name}`}
                actions={
                    <LinkButton href={route('medical-records.edit', record.id)} variant="secondary">
                        <Pencil className="h-4 w-4" /> Edit
                    </LinkButton>
                }
            />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Card title="Patient">
                    <Link href={route('patients.show', record.patient_id)} className="text-sm font-medium text-indigo-600 hover:underline">
                        {record.patient?.first_name} {record.patient?.last_name}
                    </Link>
                    <p className="mt-1 text-xs text-gray-500">{record.patient?.patient_number}</p>
                </Card>
                <Card title="Clinical Details" className="lg:col-span-2">
                    <dl className="space-y-4">
                        <Block label="Symptoms" value={record.symptoms} />
                        <Block label="Diagnosis" value={record.diagnosis} />
                        <Block label="Prescription" value={record.prescription_notes} />
                        <Block label="Notes" value={record.notes} />
                    </dl>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
