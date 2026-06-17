import DeleteButton from '@/Components/DeleteButton';
import EmptyState from '@/Components/EmptyState';
import LinkButton from '@/Components/LinkButton';
import PageHeader from '@/Components/PageHeader';
import Pagination from '@/Components/Pagination';
import SearchBar from '@/Components/SearchBar';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Pencil, Pill, Plus } from 'lucide-react';

export default function Index({ medicines, filters }) {
    return (
        <AuthenticatedLayout header="Pharmacy">
            <Head title="Pharmacy" />
            <PageHeader
                title="Pharmacy Inventory"
                subtitle="Medicine stock management"
                actions={
                    <LinkButton href={route('medicines.create')}>
                        <Plus className="h-4 w-4" /> Add Medicine
                    </LinkButton>
                }
            />
            <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
                <div className="border-b border-gray-100 p-4">
                    <SearchBar routeName="medicines.index" initial={filters.search} placeholder="Search medicines..." />
                </div>
                {medicines.data.length === 0 ? (
                    <EmptyState message="No medicines in inventory." icon={Pill} />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100 text-sm">
                            <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                <tr>
                                    <th className="px-4 py-3">Name</th>
                                    <th className="px-4 py-3">Category</th>
                                    <th className="px-4 py-3">Stock</th>
                                    <th className="px-4 py-3">Price</th>
                                    <th className="px-4 py-3">Expiry</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {medicines.data.map((med) => {
                                    const low = med.stock_quantity <= med.reorder_level;
                                    return (
                                        <tr key={med.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <p className="font-medium text-gray-800">{med.name}</p>
                                                <p className="text-xs text-gray-500">{med.generic_name}</p>
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">{med.category ?? '—'}</td>
                                            <td className="px-4 py-3">
                                                <span className={low ? 'font-semibold text-red-600' : 'text-gray-700'}>
                                                    {med.stock_quantity} {med.unit}
                                                </span>
                                                {low && (
                                                    <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700">
                                                        Low
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">${Number(med.unit_price).toFixed(2)}</td>
                                            <td className="px-4 py-3 text-gray-600">{med.expiry_date ?? '—'}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Link href={route('medicines.edit', med.id)} className="rounded p-1.5 text-gray-400 hover:bg-amber-50 hover:text-amber-600">
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>
                                                    <DeleteButton routeName="medicines.destroy" routeParams={med.id} iconOnly />
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
                <div className="p-4">
                    <Pagination links={medicines.links} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
