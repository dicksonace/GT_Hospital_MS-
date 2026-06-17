import Card from '@/Components/Card';
import PageHeader from '@/Components/PageHeader';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import WardForm from './Form';

export default function Create() {
    return (
        <AuthenticatedLayout header="Wards">
            <Head title="New Ward" />
            <PageHeader title="New Ward" />
            <Card className="max-w-2xl">
                <WardForm />
            </Card>
        </AuthenticatedLayout>
    );
}
