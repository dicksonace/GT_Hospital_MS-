import DeleteButton from '@/Components/DeleteButton';
import EmptyState from '@/Components/EmptyState';
import LinkButton from '@/Components/LinkButton';
import PageHeader from '@/Components/PageHeader';
import Pagination from '@/Components/Pagination';
import SearchBar from '@/Components/SearchBar';
import StatusBadge from '@/Components/StatusBadge';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Eye, HeartPulse, Pencil, Plus } from 'lucide-react';

export default function Index({ nurses, filters }) {
    return (
        <AuthenticatedLayout header="Nurses">
            <Head title="Nurses" />
            <PageHeader
                title="Nurses"
                subtitle="Each nurse gets a private login that only they can use"
                actions={
                    <LinkButton href={route('nurses.create')}>
                        <Plus className="h-4 w-4" /> New Nurse
                    </LinkButton>
                }
            />
            <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
                <div className="border-b border-gray-100 p-4">
                    <SearchBar routeName="nurses.index" initial={filters.search} placeholder="Search nurses..." />
                </div>
                {nurses.data.length === 0 ? (
                    <EmptyState message="No nurses found." icon={HeartPulse} />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100 text-sm">
                            <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                <tr>
                                    <th className="px-4 py-3">Name</th>
                                    <th className="px-4 py-3">Email / Login</th>
                                    <th className="px-4 py-3">Department</th>
                                    <th className="px-4 py-3">Shift</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {nurses.data.map((nurse) => (
                                    <tr key={nurse.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium text-gray-800">{nurse.user?.name}</td>
                                        <td className="px-4 py-3 text-gray-600">{nurse.user?.email}</td>
                                        <td className="px-4 py-3 text-gray-600">{nurse.department?.name ?? '—'}</td>
                                        <td className="px-4 py-3 capitalize text-gray-600">{nurse.shift ?? '—'}</td>
                                        <td className="px-4 py-3">
                                            <StatusBadge status={nurse.is_available ? 'active' : 'inactive'} label={nurse.is_available ? 'On duty' : 'Off'} />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link href={route('nurses.show', nurse.id)} className="rounded p-1.5 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600">
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                                <Link href={route('nurses.edit', nurse.id)} className="rounded p-1.5 text-gray-400 hover:bg-amber-50 hover:text-amber-600">
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                                <DeleteButton routeName="nurses.destroy" routeParams={nurse.id} iconOnly message={`Remove ${nurse.user?.name}? This also deletes their login.`} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <div className="p-4">
                    <Pagination links={nurses.links} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
