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
import { Eye, FlaskConical, Pencil, Plus } from 'lucide-react';

export default function Index({ labOrders, filters, statuses }) {
    const applyFilter = (value) => {
        router.get(route('lab-orders.index'), { ...filters, status: value }, { preserveState: true, replace: true });
    };

    return (
        <AuthenticatedLayout header="Lab Orders">
            <Head title="Lab Orders" />
            <PageHeader
                title="Lab Orders"
                subtitle="Diagnostic test orders and results"
                actions={
                    <LinkButton href={route('lab-orders.create')}>
                        <Plus className="h-4 w-4" /> New Order
                    </LinkButton>
                }
            />
            <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
                <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center">
                    <SearchBar routeName="lab-orders.index" initial={filters.search} placeholder="Search order or patient..." extra={{ status: filters.status }} />
                    <SelectInput className="text-sm" value={filters.status ?? ''} onChange={(e) => applyFilter(e.target.value)}>
                        <option value="">All statuses</option>
                        {statuses.map((s) => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                    </SelectInput>
                </div>
                {labOrders.data.length === 0 ? (
                    <EmptyState message="No lab orders found." icon={FlaskConical} />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100 text-sm">
                            <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                <tr>
                                    <th className="px-4 py-3">Order #</th>
                                    <th className="px-4 py-3">Patient</th>
                                    <th className="px-4 py-3">Test</th>
                                    <th className="px-4 py-3">Doctor</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {labOrders.data.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-mono text-xs text-gray-600">{order.order_number}</td>
                                        <td className="px-4 py-3 font-medium text-gray-800">
                                            {order.patient?.first_name} {order.patient?.last_name}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">{order.lab_test?.name}</td>
                                        <td className="px-4 py-3 text-gray-600">Dr. {order.doctor?.user?.name}</td>
                                        <td className="px-4 py-3">
                                            <StatusBadge status={order.status} />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link href={route('lab-orders.show', order.id)} className="rounded p-1.5 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600">
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                                <Link href={route('lab-orders.edit', order.id)} className="rounded p-1.5 text-gray-400 hover:bg-amber-50 hover:text-amber-600">
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                                <DeleteButton routeName="lab-orders.destroy" routeParams={order.id} iconOnly />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <div className="p-4">
                    <Pagination links={labOrders.links} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
