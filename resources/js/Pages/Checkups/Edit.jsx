import Card from '@/Components/Card';
import PageHeader from '@/Components/PageHeader';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import CheckupForm from './Form';

export default function Edit(props) {
    return (
        <AuthenticatedLayout header="Checkups">
            <Head title="Edit Checkup" />
            <PageHeader title="Edit Checkup" subtitle={props.checkup?.appointment_number} />
            <Card className="max-w-4xl">
                <CheckupForm {...props} />
            </Card>
        </AuthenticatedLayout>
    );
}
