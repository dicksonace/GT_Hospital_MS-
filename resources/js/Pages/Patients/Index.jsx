import DeleteButton from '@/Components/DeleteButton';
import EmptyState from '@/Components/EmptyState';
import LinkButton from '@/Components/LinkButton';
import PageHeader from '@/Components/PageHeader';
import Pagination from '@/Components/Pagination';
import SearchBar from '@/Components/SearchBar';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Eye, Pencil, Plus, Users } from 'lucide-react';

export default function Index({ patients, filters }) {
    return (
        <AuthenticatedLayout header="Patients">
            <Head title="Patients" />

            <PageHeader
                title="Patients"
                subtitle="Manage patient registrations and records"
                actions={
                    <LinkButton href={route('patients.create')}>
                        <Plus className="h-4 w-4" /> New Patient
                    </LinkButton>
                }
            />

            <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
                <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <SearchBar
                        routeName="patients.index"
                        initial={filters.search}
                        placeholder="Search by name, number, phone..."
                    />
                </div>

                {patients.data.length === 0 ? (
                    <EmptyState message="No patients found." icon={Users} />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100 text-sm">
                            <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                <tr>
                                    <th className="px-4 py-3">Patient #</th>
                                    <th className="px-4 py-3">Name</th>
                                    <th className="px-4 py-3">Gender</th>
                                    <th className="px-4 py-3">Phone</th>
                                    <th className="px-4 py-3">Blood</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {patients.data.map((patient) => (
                                    <tr key={patient.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-mono text-xs text-gray-600">
                                            {patient.patient_number}
                                        </td>
                                        <td className="px-4 py-3 font-medium text-gray-800">
                                            {patient.first_name} {patient.last_name}
                                        </td>
                                        <td className="px-4 py-3 capitalize text-gray-600">
                                            {patient.gender}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">
                                            {patient.phone}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">
                                            {patient.blood_group ?? '—'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link
                                                    href={route('patients.show', patient.id)}
                                                    className="rounded p-1.5 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                                <Link
                                                    href={route('patients.edit', patient.id)}
                                                    className="rounded p-1.5 text-gray-400 hover:bg-amber-50 hover:text-amber-600"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                                <DeleteButton
                                                    routeName="patients.destroy"
                                                    routeParams={patient.id}
                                                    iconOnly
                                                    message={`Delete ${patient.first_name} ${patient.last_name}?`}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="p-4">
                    <Pagination links={patients.links} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
