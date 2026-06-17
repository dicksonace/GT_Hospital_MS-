import Card from '@/Components/Card';
import PageHeader from '@/Components/PageHeader';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DoctorForm from './Form';

export default function Create({ departments }) {
    return (
        <AuthenticatedLayout header="Doctors">
            <Head title="New Doctor" />
            <PageHeader title="Add Doctor" subtitle="Creates a doctor login and profile" />
            <Card className="max-w-3xl">
                <DoctorForm departments={departments} />
            </Card>
        </AuthenticatedLayout>
    );
}
