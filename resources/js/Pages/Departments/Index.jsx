import DeleteButton from '@/Components/DeleteButton';
import EmptyState from '@/Components/EmptyState';
import LinkButton from '@/Components/LinkButton';
import PageHeader from '@/Components/PageHeader';
import Pagination from '@/Components/Pagination';
import SearchBar from '@/Components/SearchBar';
import StatusBadge from '@/Components/StatusBadge';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Building2, Pencil, Plus } from 'lucide-react';

export default function Index({ departments, filters }) {
    return (
        <AuthenticatedLayout header="Departments">
            <Head title="Departments" />
            <PageHeader
                title="Departments"
                subtitle="Clinical and operational departments"
                actions={
                    <LinkButton href={route('departments.create')}>
                        <Plus className="h-4 w-4" /> New Department
                    </LinkButton>
                }
            />
            <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
                <div className="border-b border-gray-100 p-4">
                    <SearchBar routeName="departments.index" initial={filters.search} placeholder="Search departments..." />
                </div>
                {departments.data.length === 0 ? (
                    <EmptyState message="No departments found." icon={Building2} />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100 text-sm">
                            <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                <tr>
                                    <th className="px-4 py-3">Name</th>
                                    <th className="px-4 py-3">Doctors</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {departments.data.map((dep) => (
                                    <tr key={dep.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <p className="font-medium text-gray-800">{dep.name}</p>
                                            <p className="text-xs text-gray-500">{dep.description}</p>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">{dep.doctors_count}</td>
                                        <td className="px-4 py-3">
                                            <StatusBadge status={dep.is_active ? 'active' : 'inactive'} />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link href={route('departments.edit', dep.id)} className="rounded p-1.5 text-gray-400 hover:bg-amber-50 hover:text-amber-600">
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                                <DeleteButton routeName="departments.destroy" routeParams={dep.id} iconOnly />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <div className="p-4">
                    <Pagination links={departments.links} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
