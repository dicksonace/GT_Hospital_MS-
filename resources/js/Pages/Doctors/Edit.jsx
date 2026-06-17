import Card from '@/Components/Card';
import PageHeader from '@/Components/PageHeader';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DoctorForm from './Form';

export default function Edit({ doctor, departments }) {
    return (
        <AuthenticatedLayout header="Doctors">
            <Head title="Edit Doctor" />
            <PageHeader title="Edit Doctor" subtitle={`Dr. ${doctor.user?.name}`} />
            <Card className="max-w-3xl">
                <DoctorForm doctor={doctor} departments={departments} />
            </Card>
        </AuthenticatedLayout>
    );
}
