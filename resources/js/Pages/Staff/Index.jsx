import DeleteButton from '@/Components/DeleteButton';
import EmptyState from '@/Components/EmptyState';
import LinkButton from '@/Components/LinkButton';
import PageHeader from '@/Components/PageHeader';
import Pagination from '@/Components/Pagination';
import SearchBar from '@/Components/SearchBar';
import SelectInput from '@/Components/SelectInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Plus, UserCog } from 'lucide-react';

export default function Index({ staff, filters, roles }) {
    const applyFilter = (value) => {
        router.get(route('staff.index'), { ...filters, role: value }, { preserveState: true, replace: true });
    };

    return (
        <AuthenticatedLayout header="Staff">
            <Head title="Staff" />
            <PageHeader
                title="Staff Management"
                subtitle="System users and role assignment"
                actions={
                    <LinkButton href={route('staff.create')}>
                        <Plus className="h-4 w-4" /> New Staff
                    </LinkButton>
                }
            />
            <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
                <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center">
                    <SearchBar routeName="staff.index" initial={filters.search} placeholder="Search staff..." extra={{ role: filters.role }} />
                    <SelectInput className="text-sm" value={filters.role ?? ''} onChange={(e) => applyFilter(e.target.value)}>
                        <option value="">All roles</option>
                        {roles.map((r) => (
                            <option key={r.value} value={r.value}>{r.label}</option>
                        ))}
                    </SelectInput>
                </div>
                {staff.data.length === 0 ? (
                    <EmptyState message="No staff found." icon={UserCog} />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100 text-sm">
                            <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                <tr>
                                    <th className="px-4 py-3">Name</th>
                                    <th className="px-4 py-3">Email</th>
                                    <th className="px-4 py-3">Role</th>
                                    <th className="px-4 py-3">Phone</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {staff.data.map((member) => (
                                    <tr key={member.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium text-gray-800">{member.name}</td>
                                        <td className="px-4 py-3 text-gray-600">{member.email}</td>
                                        <td className="px-4 py-3">
                                            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium capitalize text-indigo-700">
                                                {String(member.role ?? '').replace(/_/g, ' ')}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">{member.phone ?? '—'}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link href={route('staff.edit', member.id)} className="rounded p-1.5 text-gray-400 hover:bg-amber-50 hover:text-amber-600">
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                                <DeleteButton routeName="staff.destroy" routeParams={member.id} iconOnly />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <div className="p-4">
                    <Pagination links={staff.links} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
