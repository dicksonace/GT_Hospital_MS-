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
import { Eye, HeartPulse, Pencil, Plus } from 'lucide-react';

export default function Index({ checkups, filters, statuses }) {
    const applyFilter = (key, value) => {
        router.get(route('checkups.index'), { ...filters, [key]: value }, { preserveState: true, replace: true });
    };

    return (
        <AuthenticatedLayout header="Checkups">
            <Head title="Checkups" />
            <PageHeader
                title="Checkups"
                subtitle="Outpatient visits. Use Admissions for admit, transfer, or discharge."
                actions={
                    <LinkButton href={route('checkups.create')}>
                        <Plus className="h-4 w-4" /> New Checkup
                    </LinkButton>
                }
            />
            <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
                <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center">
                    <SearchBar routeName="checkups.index" initial={filters.search} placeholder="Search checkup or patient..." extra={{ status: filters.status, date: filters.date }} />
                    <SelectInput className="text-sm" value={filters.status ?? ''} onChange={(e) => applyFilter('status', e.target.value)}>
                        <option value="">All statuses</option>
                        {statuses.map((s) => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                    </SelectInput>
                    <input
                        type="date"
                        value={filters.date ?? ''}
                        onChange={(e) => applyFilter('date', e.target.value)}
                        className="rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>
                {checkups.data.length === 0 ? (
                    <EmptyState message="No checkups found." icon={HeartPulse} />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100 text-sm">
                            <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                <tr>
                                    <th className="px-4 py-3">Checkup #</th>
                                    <th className="px-4 py-3">Patient</th>
                                    <th className="px-4 py-3">Doctor</th>
                                    <th className="px-4 py-3">Date / Time</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {checkups.data.map((visit) => (
                                    <tr key={visit.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-mono text-xs text-gray-600">{visit.appointment_number}</td>
                                        <td className="px-4 py-3 font-medium text-gray-800">
                                            {visit.patient?.first_name} {visit.patient?.last_name}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">Dr. {visit.doctor?.user?.name}</td>
                                        <td className="px-4 py-3 text-gray-600">{visit.appointment_date} · {visit.appointment_time}</td>
                                        <td className="px-4 py-3"><StatusBadge status={visit.status} /></td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link href={route('checkups.show', visit.id)} className="rounded p-1.5 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600">
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                                <Link href={route('checkups.edit', visit.id)} className="rounded p-1.5 text-gray-400 hover:bg-amber-50 hover:text-amber-600">
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                                <DeleteButton routeName="checkups.destroy" routeParams={visit.id} iconOnly />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <div className="p-4">
                    <Pagination links={checkups.links} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
