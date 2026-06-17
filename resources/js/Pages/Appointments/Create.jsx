import Card from '@/Components/Card';
import PageHeader from '@/Components/PageHeader';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import AppointmentForm from './Form';

export default function Create(props) {
    return (
        <AuthenticatedLayout header="Appointments">
            <Head title="New Appointment" />
            <PageHeader title="New Appointment" subtitle="Schedule a patient visit" />
            <Card className="max-w-4xl">
                <AppointmentForm {...props} />
            </Card>
        </AuthenticatedLayout>
    );
}
