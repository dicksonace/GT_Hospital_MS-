import Card from '@/Components/Card';
import PageHeader from '@/Components/PageHeader';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import CheckupForm from './Form';

export default function Create(props) {
    return (
        <AuthenticatedLayout header="Checkups">
            <Head title="New Checkup" />
            <PageHeader title="Book Checkup" subtitle="Outpatient visit — no ward or bed needed" />
            <Card className="max-w-4xl">
                <CheckupForm {...props} />
            </Card>
        </AuthenticatedLayout>
    );
}
