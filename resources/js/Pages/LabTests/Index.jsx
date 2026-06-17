import DeleteButton from '@/Components/DeleteButton';
import EmptyState from '@/Components/EmptyState';
import LinkButton from '@/Components/LinkButton';
import PageHeader from '@/Components/PageHeader';
import Pagination from '@/Components/Pagination';
import SearchBar from '@/Components/SearchBar';
import StatusBadge from '@/Components/StatusBadge';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Pencil, Plus, TestTubes } from 'lucide-react';

export default function Index({ labTests, filters }) {
    return (
        <AuthenticatedLayout header="Lab Catalog">
            <Head title="Lab Tests" />
            <PageHeader
                title="Lab Test Catalog"
                subtitle="Available diagnostic tests"
                actions={
                    <LinkButton href={route('lab-tests.create')}>
                        <Plus className="h-4 w-4" /> New Test
                    </LinkButton>
                }
            />
            <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
                <div className="border-b border-gray-100 p-4">
                    <SearchBar routeName="lab-tests.index" initial={filters.search} placeholder="Search tests..." />
                </div>
                {labTests.data.length === 0 ? (
                    <EmptyState message="No lab tests found." icon={TestTubes} />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100 text-sm">
                            <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                <tr>
                                    <th className="px-4 py-3">Code</th>
                                    <th className="px-4 py-3">Name</th>
                                    <th className="px-4 py-3">Category</th>
                                    <th className="px-4 py-3">Price</th>
                                    <th className="px-4 py-3">Normal Range</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {labTests.data.map((test) => (
                                    <tr key={test.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-mono text-xs text-gray-600">{test.code}</td>
                                        <td className="px-4 py-3 font-medium text-gray-800">{test.name}</td>
                                        <td className="px-4 py-3 text-gray-600">{test.category ?? '—'}</td>
                                        <td className="px-4 py-3 text-gray-600">${Number(test.price).toFixed(2)}</td>
                                        <td className="px-4 py-3 text-gray-600">
                                            {test.normal_range ?? '—'} {test.unit}
                                        </td>
                                        <td className="px-4 py-3">
                                            <StatusBadge status={test.is_active ? 'active' : 'inactive'} />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link href={route('lab-tests.edit', test.id)} className="rounded p-1.5 text-gray-400 hover:bg-amber-50 hover:text-amber-600">
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                                <DeleteButton routeName="lab-tests.destroy" routeParams={test.id} iconOnly />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <div className="p-4">
                    <Pagination links={labTests.links} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
