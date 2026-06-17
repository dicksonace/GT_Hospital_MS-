import Card from '@/Components/Card';
import LinkButton from '@/Components/LinkButton';
import PageHeader from '@/Components/PageHeader';
import StatusBadge from '@/Components/StatusBadge';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Pencil } from 'lucide-react';

export default function Show({ bill }) {
    const balance = Math.max(0, Number(bill.total_amount) - Number(bill.paid_amount));

    return (
        <AuthenticatedLayout header="Billing">
            <Head title={bill.bill_number} />
            <PageHeader
                title={bill.bill_number}
                subtitle={`${bill.patient?.first_name} ${bill.patient?.last_name}`}
                actions={
                    <LinkButton href={route('bills.edit', bill.id)} variant="secondary">
                        <Pencil className="h-4 w-4" /> Edit
                    </LinkButton>
                }
            />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Card title="Invoice" className="lg:col-span-2">
                    <table className="min-w-full text-sm">
                        <thead className="border-b border-gray-100 text-left text-xs uppercase text-gray-400">
                            <tr>
                                <th className="py-2">Description</th>
                                <th className="py-2 text-center">Qty</th>
                                <th className="py-2 text-right">Unit Price</th>
                                <th className="py-2 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {bill.items?.map((item) => (
                                <tr key={item.id}>
                                    <td className="py-2 text-gray-800">{item.description}</td>
                                    <td className="py-2 text-center text-gray-600">{item.quantity}</td>
                                    <td className="py-2 text-right text-gray-600">${Number(item.unit_price).toFixed(2)}</td>
                                    <td className="py-2 text-right font-medium text-gray-800">${Number(item.total).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {bill.notes && (
                        <p className="mt-4 border-t border-gray-100 pt-4 text-sm text-gray-500">{bill.notes}</p>
                    )}
                </Card>
                <div className="space-y-6">
                    <Card title="Summary">
                        <dl className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <dt className="text-gray-500">Total</dt>
                                <dd className="font-medium text-gray-800">${Number(bill.total_amount).toFixed(2)}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-gray-500">Paid</dt>
                                <dd className="font-medium text-green-600">${Number(bill.paid_amount).toFixed(2)}</dd>
                            </div>
                            <div className="flex justify-between border-t border-gray-100 pt-3">
                                <dt className="text-gray-500">Balance</dt>
                                <dd className="font-bold text-gray-900">${balance.toFixed(2)}</dd>
                            </div>
                            <div className="flex justify-between pt-2">
                                <dt className="text-gray-500">Status</dt>
                                <dd><StatusBadge status={bill.status} /></dd>
                            </div>
                        </dl>
                    </Card>
                    {bill.appointment && (
                        <Card title="Linked Appointment">
                            <Link href={route('appointments.show', bill.appointment.id)} className="text-sm text-indigo-600 hover:underline">
                                {bill.appointment.appointment_number}
                            </Link>
                        </Card>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
