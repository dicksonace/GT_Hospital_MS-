import Card from '@/Components/Card';
import PageHeader from '@/Components/PageHeader';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import LabOrderForm from './Form';

export default function Edit({ labOrder, ...props }) {
    return (
        <AuthenticatedLayout header="Lab Orders">
            <Head title="Edit Lab Order" />
            <PageHeader title="Edit Lab Order" subtitle={labOrder.order_number} />
            <Card className="max-w-4xl">
                <LabOrderForm labOrder={labOrder} {...props} />
            </Card>
        </AuthenticatedLayout>
    );
}
