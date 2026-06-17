import Card from '@/Components/Card';
import PageHeader from '@/Components/PageHeader';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import StaffForm from './Form';

export default function Edit({ staff, roles }) {
    return (
        <AuthenticatedLayout header="Staff">
            <Head title="Edit Staff" />
            <PageHeader title="Edit Staff Member" subtitle={staff.name} />
            <Card className="max-w-3xl">
                <StaffForm staff={staff} roles={roles} />
            </Card>
        </AuthenticatedLayout>
    );
}
