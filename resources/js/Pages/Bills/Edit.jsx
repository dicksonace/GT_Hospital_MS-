import Card from '@/Components/Card';
import PageHeader from '@/Components/PageHeader';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import BillForm from './Form';

export default function Edit({ bill, ...props }) {
    return (
        <AuthenticatedLayout header="Billing">
            <Head title="Edit Bill" />
            <PageHeader title="Edit Bill" subtitle={bill.bill_number} />
            <Card className="max-w-4xl">
                <BillForm bill={bill} {...props} />
            </Card>
        </AuthenticatedLayout>
    );
}
