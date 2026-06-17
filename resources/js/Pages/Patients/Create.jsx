import Card from '@/Components/Card';
import PageHeader from '@/Components/PageHeader';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import PatientForm from './Form';

export default function Create({ genders }) {
    return (
        <AuthenticatedLayout header="Patients">
            <Head title="Register Patient" />
            <PageHeader title="Register Patient" subtitle="Add a new patient to the system" />
            <Card className="max-w-4xl">
                <PatientForm genders={genders} />
            </Card>
        </AuthenticatedLayout>
    );
}
