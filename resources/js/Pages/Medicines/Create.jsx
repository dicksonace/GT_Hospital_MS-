import Card from '@/Components/Card';
import PageHeader from '@/Components/PageHeader';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import MedicineForm from './Form';

export default function Create() {
    return (
        <AuthenticatedLayout header="Pharmacy">
            <Head title="Add Medicine" />
            <PageHeader title="Add Medicine" />
            <Card className="max-w-3xl">
                <MedicineForm />
            </Card>
        </AuthenticatedLayout>
    );
}
