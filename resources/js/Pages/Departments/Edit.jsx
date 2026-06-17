import Card from '@/Components/Card';
import PageHeader from '@/Components/PageHeader';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DepartmentForm from './Form';

export default function Edit({ department }) {
    return (
        <AuthenticatedLayout header="Departments">
            <Head title="Edit Department" />
            <PageHeader title="Edit Department" subtitle={department.name} />
            <Card className="max-w-2xl">
                <DepartmentForm department={department} />
            </Card>
        </AuthenticatedLayout>
    );
}
