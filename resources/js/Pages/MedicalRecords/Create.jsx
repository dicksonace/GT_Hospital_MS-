import Card from '@/Components/Card';
import PageHeader from '@/Components/PageHeader';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import MedicalRecordForm from './Form';

export default function Create(props) {
    return (
        <AuthenticatedLayout header="Medical Records">
            <Head title="New Medical Record" />
            <PageHeader title="New Medical Record" />
            <Card className="max-w-4xl">
                <MedicalRecordForm {...props} />
            </Card>
        </AuthenticatedLayout>
    );
}
