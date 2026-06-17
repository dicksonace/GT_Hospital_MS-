import DeleteButton from '@/Components/DeleteButton';
import EmptyState from '@/Components/EmptyState';
import LinkButton from '@/Components/LinkButton';
import PageHeader from '@/Components/PageHeader';
import Pagination from '@/Components/Pagination';
import SearchBar from '@/Components/SearchBar';
import StatusBadge from '@/Components/StatusBadge';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Eye, Pencil, Plus, Stethoscope } from 'lucide-react';

export default function Index({ doctors, filters }) {
    return (
        <AuthenticatedLayout header="Doctors">
            <Head title="Doctors" />
            <PageHeader
                title="Doctors"
                subtitle="Medical staff directory"
                actions={
                    <LinkButton href={route('doctors.create')}>
                        <Plus className="h-4 w-4" /> New Doctor
                    </LinkButton>
                }
            />
            <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
                <div className="border-b border-gray-100 p-4">
                    <SearchBar routeName="doctors.index" initial={filters.search} placeholder="Search doctors..." />
                </div>
                {doctors.data.length === 0 ? (
                    <EmptyState message="No doctors found." icon={Stethoscope} />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100 text-sm">
                            <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                <tr>
                                    <th className="px-4 py-3">Name</th>
                                    <th className="px-4 py-3">Specialization</th>
                                    <th className="px-4 py-3">Department</th>
                                    <th className="px-4 py-3">License</th>
                                    <th className="px-4 py-3">Available</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {doctors.data.map((doc) => (
                                    <tr key={doc.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium text-gray-800">Dr. {doc.user?.name}</td>
                                        <td className="px-4 py-3 text-gray-600">{doc.specialization}</td>
                                        <td className="px-4 py-3 text-gray-600">{doc.department?.name}</td>
                                        <td className="px-4 py-3 font-mono text-xs text-gray-600">{doc.license_number}</td>
                                        <td className="px-4 py-3">
                                            <StatusBadge status={doc.is_available ? 'active' : 'inactive'} label={doc.is_available ? 'Available' : 'Off'} />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link href={route('doctors.show', doc.id)} className="rounded p-1.5 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600">
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                                <Link href={route('doctors.edit', doc.id)} className="rounded p-1.5 text-gray-400 hover:bg-amber-50 hover:text-amber-600">
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                                <DeleteButton routeName="doctors.destroy" routeParams={doc.id} iconOnly message={`Remove Dr. ${doc.user?.name}? This also deletes their login.`} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <div className="p-4">
                    <Pagination links={doctors.links} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
