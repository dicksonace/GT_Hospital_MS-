import Card from '@/Components/Card';
import PageHeader from '@/Components/PageHeader';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import BillForm from './Form';

export default function Create(props) {
    return (
        <AuthenticatedLayout header="Billing">
            <Head title="New Bill" />
            <PageHeader title="New Bill" />
            <Card className="max-w-4xl">
                <BillForm {...props} />
            </Card>
        </AuthenticatedLayout>
    );
}
