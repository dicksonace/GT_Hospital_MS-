import Card from '@/Components/Card';
import PageHeader from '@/Components/PageHeader';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import LabTestForm from './Form';

export default function Create() {
    return (
        <AuthenticatedLayout header="Lab Catalog">
            <Head title="New Lab Test" />
            <PageHeader title="New Lab Test" />
            <Card className="max-w-3xl">
                <LabTestForm />
            </Card>
        </AuthenticatedLayout>
    );
}
