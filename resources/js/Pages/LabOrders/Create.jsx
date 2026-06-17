import Card from '@/Components/Card';
import PageHeader from '@/Components/PageHeader';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import LabOrderForm from './Form';

export default function Create(props) {
    return (
        <AuthenticatedLayout header="Lab Orders">
            <Head title="New Lab Order" />
            <PageHeader title="New Lab Order" />
            <Card className="max-w-4xl">
                <LabOrderForm {...props} />
            </Card>
        </AuthenticatedLayout>
    );
}
