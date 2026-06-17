import Card from '@/Components/Card';
import PageHeader from '@/Components/PageHeader';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import WardForm from './Form';

export default function Edit({ ward }) {
    return (
        <AuthenticatedLayout header="Wards">
            <Head title="Edit Ward" />
            <PageHeader title="Edit Ward" subtitle={ward.name} />
            <Card className="max-w-2xl">
                <WardForm ward={ward} />
            </Card>
        </AuthenticatedLayout>
    );
}
