import DeleteButton from '@/Components/DeleteButton';
import EmptyState from '@/Components/EmptyState';
import LinkButton from '@/Components/LinkButton';
import PageHeader from '@/Components/PageHeader';
import Pagination from '@/Components/Pagination';
import SearchBar from '@/Components/SearchBar';
import StatusBadge from '@/Components/StatusBadge';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { ClipboardPlus, Eye, Pencil, Plus } from 'lucide-react';

export default function Index({ notes, filters, canWrite }) {
    const role = usePage().props.auth?.user?.role;
    const nurseId = usePage().props.auth?.user?.nurse_id;

    return (
        <AuthenticatedLayout header="Nurse Notes">
            <Head title="Nurse Notes" />
            <PageHeader
                title="Nurse Notes"
                subtitle={role === 'doctor' ? 'Review what nurses recorded for your patients' : 'Record vitals and observations doctors can review'}
                actions={
                    canWrite ? (
                        <LinkButton href={route('nurse-notes.create')}>
                            <Plus className="h-4 w-4" /> New Note
                        </LinkButton>
                    ) : null
                }
            />
            <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
                <div className="border-b border-gray-100 p-4">
                    <SearchBar routeName="nurse-notes.index" initial={filters.search} placeholder="Search by patient..." />
                </div>
                {notes.data.length === 0 ? (
                    <EmptyState message="No nurse notes found." icon={ClipboardPlus} />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100 text-sm">
                            <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                <tr>
                                    <th className="px-4 py-3">Recorded</th>
                                    <th className="px-4 py-3">Patient</th>
                                    <th className="px-4 py-3">Nurse</th>
                                    <th className="px-4 py-3">Doctor</th>
                                    <th className="px-4 py-3">Type</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {notes.data.map((note) => {
                                    const canEdit = canWrite && (role === 'admin' || note.nurse_id === nurseId);
                                    return (
                                        <tr key={note.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-gray-600">{note.recorded_at}</td>
                                            <td className="px-4 py-3 font-medium text-gray-800">
                                                {note.patient?.first_name} {note.patient?.last_name}
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">{note.nurse?.user?.name}</td>
                                            <td className="px-4 py-3 text-gray-600">{note.doctor?.user?.name ? `Dr. ${note.doctor.user.name}` : '—'}</td>
                                            <td className="px-4 py-3">
                                                <StatusBadge status={note.note_type} />
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Link href={route('nurse-notes.show', note.id)} className="rounded p-1.5 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600">
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                    {canEdit && (
                                                        <>
                                                            <Link href={route('nurse-notes.edit', note.id)} className="rounded p-1.5 text-gray-400 hover:bg-amber-50 hover:text-amber-600">
                                                                <Pencil className="h-4 w-4" />
                                                            </Link>
                                                            <DeleteButton routeName="nurse-notes.destroy" routeParams={note.id} iconOnly />
                                                        </>
                                                    )}
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
                    <Pagination links={notes.links} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
