import DeleteButton from '@/Components/DeleteButton';
import EmptyState from '@/Components/EmptyState';
import LinkButton from '@/Components/LinkButton';
import PageHeader from '@/Components/PageHeader';
import Pagination from '@/Components/Pagination';
import SearchBar from '@/Components/SearchBar';
import SelectInput from '@/Components/SelectInput';
import StatusBadge from '@/Components/StatusBadge';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Eye, Pencil, Plus, Receipt } from 'lucide-react';

export default function Index({ bills, filters, statuses }) {
    const applyFilter = (value) => {
        router.get(route('bills.index'), { ...filters, status: value }, { preserveState: true, replace: true });
    };

    return (
        <AuthenticatedLayout header="Billing">
            <Head title="Billing" />
            <PageHeader
                title="Billing"
                subtitle="Invoices and payments"
                actions={
                    <LinkButton href={route('bills.create')}>
                        <Plus className="h-4 w-4" /> New Bill
                    </LinkButton>
                }
            />
            <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
                <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center">
                    <SearchBar routeName="bills.index" initial={filters.search} placeholder="Search bill or patient..." extra={{ status: filters.status }} />
                    <SelectInput className="text-sm" value={filters.status ?? ''} onChange={(e) => applyFilter(e.target.value)}>
                        <option value="">All statuses</option>
                        {statuses.map((s) => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                    </SelectInput>
                </div>
                {bills.data.length === 0 ? (
                    <EmptyState message="No bills found." icon={Receipt} />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100 text-sm">
                            <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                <tr>
                                    <th className="px-4 py-3">Bill #</th>
                                    <th className="px-4 py-3">Patient</th>
                                    <th className="px-4 py-3">Total</th>
                                    <th className="px-4 py-3">Paid</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {bills.data.map((bill) => (
                                    <tr key={bill.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-mono text-xs text-gray-600">{bill.bill_number}</td>
                                        <td className="px-4 py-3 font-medium text-gray-800">
                                            {bill.patient?.first_name} {bill.patient?.last_name}
                                        </td>
                                        <td className="px-4 py-3 text-gray-700">${Number(bill.total_amount).toFixed(2)}</td>
                                        <td className="px-4 py-3 text-gray-700">${Number(bill.paid_amount).toFixed(2)}</td>
                                        <td className="px-4 py-3">
                                            <StatusBadge status={bill.status} />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link href={route('bills.show', bill.id)} className="rounded p-1.5 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600">
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                                <Link href={route('bills.edit', bill.id)} className="rounded p-1.5 text-gray-400 hover:bg-amber-50 hover:text-amber-600">
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                                <DeleteButton routeName="bills.destroy" routeParams={bill.id} iconOnly />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <div className="p-4">
                    <Pagination links={bills.links} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
