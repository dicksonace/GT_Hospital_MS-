import DeleteButton from '@/Components/DeleteButton';
import EmptyState from '@/Components/EmptyState';
import LinkButton from '@/Components/LinkButton';
import PageHeader from '@/Components/PageHeader';
import Pagination from '@/Components/Pagination';
import SearchBar from '@/Components/SearchBar';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Activity, Eye, Pencil, Plus } from 'lucide-react';

export default function Index({ records, filters }) {
    return (
        <AuthenticatedLayout header="Medical Records">
            <Head title="Medical Records" />
            <PageHeader
                title="Medical Records"
                subtitle="Patient visit history and diagnoses"
                actions={
                    <LinkButton href={route('medical-records.create')}>
                        <Plus className="h-4 w-4" /> New Record
                    </LinkButton>
                }
            />
            <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
                <div className="border-b border-gray-100 p-4">
                    <SearchBar routeName="medical-records.index" initial={filters.search} placeholder="Search by patient..." />
                </div>
                {records.data.length === 0 ? (
                    <EmptyState message="No medical records found." icon={Activity} />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100 text-sm">
                            <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                <tr>
                                    <th className="px-4 py-3">Date</th>
                                    <th className="px-4 py-3">Patient</th>
                                    <th className="px-4 py-3">Doctor</th>
                                    <th className="px-4 py-3">Diagnosis</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {records.data.map((rec) => (
                                    <tr key={rec.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-gray-600">{rec.visit_date}</td>
                                        <td className="px-4 py-3 font-medium text-gray-800">
                                            {rec.patient?.first_name} {rec.patient?.last_name}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">Dr. {rec.doctor?.user?.name}</td>
                                        <td className="px-4 py-3 max-w-xs truncate text-gray-600">{rec.diagnosis ?? '—'}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link href={route('medical-records.show', rec.id)} className="rounded p-1.5 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600">
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                                <Link href={route('medical-records.edit', rec.id)} className="rounded p-1.5 text-gray-400 hover:bg-amber-50 hover:text-amber-600">
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                                <DeleteButton routeName="medical-records.destroy" routeParams={rec.id} iconOnly />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <div className="p-4">
                    <Pagination links={records.links} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
