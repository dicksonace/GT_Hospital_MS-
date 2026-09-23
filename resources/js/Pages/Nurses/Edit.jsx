import Card from '@/Components/Card';
import PageHeader from '@/Components/PageHeader';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import NurseForm from './Form';

export default function Edit({ nurse, departments, shifts }) {
    return (
        <AuthenticatedLayout header="Nurses">
            <Head title="Edit Nurse" />
            <PageHeader title="Edit Nurse" subtitle={nurse.user?.name} />
            <Card className="max-w-3xl">
                <NurseForm nurse={nurse} departments={departments} shifts={shifts} />
            </Card>
        </AuthenticatedLayout>
    );
}
