import Card from '@/Components/Card';
import PageHeader from '@/Components/PageHeader';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DepartmentForm from './Form';

export default function Create() {
    return (
        <AuthenticatedLayout header="Departments">
            <Head title="New Department" />
            <PageHeader title="New Department" />
            <Card className="max-w-2xl">
                <DepartmentForm />
            </Card>
        </AuthenticatedLayout>
    );
}
