import Card from '@/Components/Card';
import PageHeader from '@/Components/PageHeader';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import AppointmentForm from './Form';

export default function Edit({ appointment, ...props }) {
    return (
        <AuthenticatedLayout header="Appointments">
            <Head title="Edit Appointment" />
            <PageHeader title="Edit Appointment" subtitle={appointment.appointment_number} />
            <Card className="max-w-4xl">
                <AppointmentForm appointment={appointment} {...props} />
            </Card>
        </AuthenticatedLayout>
    );
}
