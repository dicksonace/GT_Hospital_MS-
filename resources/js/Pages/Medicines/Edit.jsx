import Card from '@/Components/Card';
import PageHeader from '@/Components/PageHeader';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import MedicineForm from './Form';

export default function Edit({ medicine }) {
    return (
        <AuthenticatedLayout header="Pharmacy">
            <Head title="Edit Medicine" />
            <PageHeader title="Edit Medicine" subtitle={medicine.name} />
            <Card className="max-w-3xl">
                <MedicineForm medicine={medicine} />
            </Card>
        </AuthenticatedLayout>
    );
}
