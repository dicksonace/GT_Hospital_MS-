import Card from '@/Components/Card';
import PageHeader from '@/Components/PageHeader';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import StaffForm from './Form';

export default function Create({ roles }) {
    return (
        <AuthenticatedLayout header="Staff">
            <Head title="New Staff" />
            <PageHeader title="New Staff Member" />
            <Card className="max-w-3xl">
                <StaffForm roles={roles} />
            </Card>
        </AuthenticatedLayout>
    );
}
