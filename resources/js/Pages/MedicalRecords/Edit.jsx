import Card from '@/Components/Card';
import PageHeader from '@/Components/PageHeader';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import MedicalRecordForm from './Form';

export default function Edit({ record, ...props }) {
    return (
        <AuthenticatedLayout header="Medical Records">
            <Head title="Edit Medical Record" />
            <PageHeader title="Edit Medical Record" subtitle={`${record.patient?.first_name} ${record.patient?.last_name}`} />
            <Card className="max-w-4xl">
                <MedicalRecordForm record={record} {...props} />
            </Card>
        </AuthenticatedLayout>
    );
}
