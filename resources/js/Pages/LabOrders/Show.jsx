import Card from '@/Components/Card';
import LinkButton from '@/Components/LinkButton';
import PageHeader from '@/Components/PageHeader';
import StatusBadge from '@/Components/StatusBadge';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Pencil } from 'lucide-react';

function Info({ label, value }) {
    return (
        <div>
            <dt className="text-xs uppercase tracking-wide text-gray-400">{label}</dt>
            <dd className="mt-0.5 whitespace-pre-wrap text-sm text-gray-800">{value || '—'}</dd>
        </div>
    );
}

export default function Show({ labOrder }) {
    return (
        <AuthenticatedLayout header="Lab Orders">
            <Head title={labOrder.order_number} />
            <PageHeader
                title={labOrder.order_number}
                subtitle={labOrder.lab_test?.name}
                actions={
                    <LinkButton href={route('lab-orders.edit', labOrder.id)} variant="secondary">
                        <Pencil className="h-4 w-4" /> Edit
                    </LinkButton>
                }
            />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Card title="Details">
                    <dl className="space-y-4">
                        <Info
                            label="Patient"
                            value={
                                <Link href={route('patients.show', labOrder.patient_id)} className="text-indigo-600 hover:underline">
                                    {labOrder.patient?.first_name} {labOrder.patient?.last_name}
                                </Link>
                            }
                        />
                        <Info label="Doctor" value={`Dr. ${labOrder.doctor?.user?.name}`} />
                        <Info label="Test" value={labOrder.lab_test?.name} />
                        <Info label="Normal Range" value={`${labOrder.lab_test?.normal_range ?? '—'} ${labOrder.lab_test?.unit ?? ''}`} />
                        <div>
                            <dt className="text-xs uppercase tracking-wide text-gray-400">Status</dt>
                            <dd className="mt-1"><StatusBadge status={labOrder.status} /></dd>
                        </div>
                    </dl>
                </Card>
                <Card title="Result" className="lg:col-span-2">
                    <dl className="space-y-4">
                        <Info label="Result" value={labOrder.result} />
                        <Info label="Notes" value={labOrder.notes} />
                        <Info label="Ordered At" value={labOrder.ordered_at} />
                        <Info label="Completed At" value={labOrder.completed_at} />
                    </dl>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
