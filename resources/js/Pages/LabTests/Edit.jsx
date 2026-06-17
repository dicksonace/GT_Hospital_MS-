import Card from '@/Components/Card';
import PageHeader from '@/Components/PageHeader';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import LabTestForm from './Form';

export default function Edit({ labTest }) {
    return (
        <AuthenticatedLayout header="Lab Catalog">
            <Head title="Edit Lab Test" />
            <PageHeader title="Edit Lab Test" subtitle={labTest.name} />
            <Card className="max-w-3xl">
                <LabTestForm labTest={labTest} />
            </Card>
        </AuthenticatedLayout>
    );
}
