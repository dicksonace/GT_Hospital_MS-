import Card from '@/Components/Card';
import PageHeader from '@/Components/PageHeader';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import PatientForm from './Form';

export default function Edit({ patient, genders }) {
    return (
        <AuthenticatedLayout header="Patients">
            <Head title="Edit Patient" />
            <PageHeader
                title="Edit Patient"
                subtitle={`${patient.first_name} ${patient.last_name} · ${patient.patient_number}`}
            />
            <Card className="max-w-4xl">
                <PatientForm patient={patient} genders={genders} />
            </Card>
        </AuthenticatedLayout>
    );
}
