import Card from '@/Components/Card';
import PageHeader from '@/Components/PageHeader';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import NurseForm from './Form';

export default function Create({ departments, shifts }) {
    return (
        <AuthenticatedLayout header="Nurses">
            <Head title="New Nurse" />
            <PageHeader title="Add Nurse" subtitle="Creates a private nurse login and profile" />
            <Card className="max-w-3xl">
                <NurseForm departments={departments} shifts={shifts} />
            </Card>
        </AuthenticatedLayout>
    );
}
